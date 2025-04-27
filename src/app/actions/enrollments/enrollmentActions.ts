'use server';

import { authOptions } from "@/auth"
import { getServerSession } from "next-auth/next"
import { enrollmentsRepository, clientsRepository, programsRepository } from "@/lib/repositories"
import { revalidatePath } from "next/cache"
import { z } from "zod"

// Schema for enrollment creation validation
const enrollmentSchema = z.object({
    clientId: z.string().min(1, "Client ID is required"),
    programId: z.string().min(1, "Program ID is required"),
    enrollmentDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format",
    }),
    status: z.enum(["active", "completed", "suspended"]).default("active"),
    programSpecificData: z.record(z.any()).optional(),
    notes: z.string().optional(),
})

type GetEnrollmentsResult = {
    success: boolean
    data?: any[]
    meta?: {
        page: number
        pageSize: number
        totalRecords: number
        totalPages: number
    }
    error?: string
}

type EnrollmentResult = {
    success: boolean
    data?: any
    error?: string
    details?: any
}

const hasRole = (session: any, roles: string[]) => {
    return session?.user?.role && roles.includes(session.user.role)
}

/**
 * Get enrollments with filtering options
 */
export async function getEnrollments(clientId?: string, programId?: string, page = 1, pageSize = 10): Promise<GetEnrollmentsResult> {
    const session = await getServerSession(authOptions)

    // Check authentication
    if (!session) {
        return { success: false, error: "Unauthorized" }
    }

    if (!hasRole(session, ["Admin", "Doctor", "Nurse"])) {
        return { success: false, error: "Forbidden" }
    }

    try {
        let result;
        if (clientId) {
            // Get all enrollments for a specific client
            const enrollments = await enrollmentsRepository.getClientEnrollments(clientId)
            // Serialize the data to remove methods and make it plain objects
            const serializedEnrollments = JSON.parse(JSON.stringify(enrollments))
            return { success: true, data: serializedEnrollments }
        } else if (programId) {
            // Get paginated enrollments for a specific program
            result = await enrollmentsRepository.getProgramEnrollments(programId, page, pageSize)

            // Serialize records
            const serializedRecords = JSON.parse(JSON.stringify(result.records))

            return {
                success: true,
                data: serializedRecords,
                meta: {
                    page,
                    pageSize,
                    totalRecords: result.records.length,
                    totalPages: Math.ceil(result.records.length / pageSize) || 1,
                },
            }
        } else {
            // If no filters provided, return error
            return { success: false, error: "Either clientId or programId must be provided" }
        }
    } catch (error) {
        console.error("Error fetching enrollments:", error)
        return { success: false, error: "Failed to fetch enrollments" }
    }
}

/**
 * Create a new program enrollment
 */
export async function createEnrollment(formData: any): Promise<EnrollmentResult> {
    const session = await getServerSession(authOptions)

    // Check authentication
    if (!session) {
        return { success: false, error: "Unauthorized" }
    }

    if (!hasRole(session, ["Admin", "Doctor", "Nurse"])) {
        return { success: false, error: "Forbidden" }
    }

    try {
        // Validate request body
        const validationResult = enrollmentSchema.safeParse(formData)
        if (!validationResult.success) {
            return {
                success: false,
                error: "Validation error",
                details: validationResult.error.format(),
            }
        }

        // Verify client exists
        const client = await clientsRepository.getClientById(validationResult.data.clientId)
        if (!client) {
            return { success: false, error: "Client not found" }
        }

        // Verify program exists
        const program = await programsRepository.getProgramById(validationResult.data.programId)
        if (!program) {
            return { success: false, error: "Program not found" }
        }

        // Check if client is already enrolled in this program
        const existingEnrollments = await enrollmentsRepository.getClientEnrollments(validationResult.data.clientId)
        const alreadyEnrolled = existingEnrollments.some(
            (e) => e.programId?.id === validationResult.data.programId && e.status === "active",
        )

        if (alreadyEnrolled) {
            return { success: false, error: "Client is already enrolled in this program" }
        }

        const newEnrollment = await enrollmentsRepository.createEnrollment({
            clientId: validationResult.data.clientId,
            programId: validationResult.data.programId,
            enrollmentDate: new Date(validationResult.data.enrollmentDate),
            status: validationResult.data.status,
            programSpecificData: validationResult.data.programSpecificData,
            notes: validationResult.data.notes,
            createdBy: session.user.id
        })

        // Serialize the response
        const serializedEnrollment = JSON.parse(JSON.stringify(newEnrollment))

        // Revalidate client page
        revalidatePath(`/clients/${validationResult.data.clientId}`)

        return { success: true, data: serializedEnrollment }
    } catch (error) {
        console.error("Error creating enrollment:", error)
        return { success: false, error: "Failed to create enrollment" }
    }
} 