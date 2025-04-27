'use server'

import { authOptions } from "@/auth"
import { getServerSession } from "next-auth/next"
import { programsRepository, xataClient } from "@/lib/repositories"
import { revalidatePath } from "next/cache"
import { programSchema } from "@/lib/validations/program"
import type { HealthProgramRecord } from "@/lib/xata"
import { z } from "zod"

// Schema for program update validation to match the API route
const programUpdateSchema = z.object({
    name: z.string().min(1, "Program name is required").optional(),
    description: z.string().min(1, "Description is required").optional(),
    code: z.string().min(1, "Program code is required").optional(),
    active: z.boolean().optional(),
    requiredFields: z.array(z.string()).optional(),
})

type ProgramResult = {
    success: boolean
    data?: HealthProgramRecord
    error?: string
    details?: z.ZodFormattedError<z.infer<typeof programSchema>> | z.ZodFormattedError<z.infer<typeof programUpdateSchema>>
}

type GetProgramsResult = {
    success: boolean
    data?: HealthProgramRecord[]
    error?: string
}

const hasRole = (session: any, roles: string[]) => {
    return session?.user?.role && roles.includes(session.user.role)
}

export async function getPrograms(activeOnly: boolean = false): Promise<GetProgramsResult> {
    const session = await getServerSession(authOptions)

    if (!session) {
        return { success: false, error: "Unauthorized" }
    }

    try {
        let programs
        if (activeOnly) {
            programs = await programsRepository.getActivePrograms()
        } else {
            programs = await xataClient.db.HealthProgram.getAll()
        }

        const serializedPrograms = JSON.parse(JSON.stringify(programs))

        return { success: true, data: serializedPrograms }
    } catch (error) {
        console.error("Error fetching programs:", error)
        return { success: false, error: "Failed to fetch programs" }
    }
}

export async function getProgram(id: string): Promise<ProgramResult> {
    const session = await getServerSession(authOptions)

    // Check authentication
    if (!session) {
        return { success: false, error: "Unauthorized" }
    }

    try {
        const program = await programsRepository.getProgramById(id)

        if (!program) {
            return { success: false, error: "Program not found" }
        }

        return { success: true, data: program }
    } catch (error) {
        console.error("Error fetching program:", error)
        return { success: false, error: "Failed to fetch program" }
    }
}

export async function createProgram(formData: z.infer<typeof programSchema>): Promise<ProgramResult> {
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
        const validationResult = programSchema.safeParse(formData)
        if (!validationResult.success) {
            return {
                success: false,
                error: "Validation error",
                details: validationResult.error.format(),
            }
        }

        const newProgram = await programsRepository.createProgram(validationResult.data)
        revalidatePath('/programs')

        return { success: true, data: newProgram }
    } catch (error) {
        console.error("Error creating program:", error)
        return { success: false, error: "Failed to create program" }
    }
}

export async function updateProgram(id: string, formData: z.infer<typeof programUpdateSchema>): Promise<ProgramResult> {
    const session = await getServerSession(authOptions)

    // Check authentication
    if (!session) {
        return { success: false, error: "Unauthorized" }
    }

    // Allow Admins and Doctors to update programs
    if (!hasRole(session, ["Admin", "Doctor"])) {
        return { success: false, error: "Forbidden" }
    }

    try {
        // Check if program exists
        const existingProgram = await programsRepository.getProgramById(id)
        if (!existingProgram) {
            return { success: false, error: "Program not found" }
        }

        // Validate request body
        const validationResult = programUpdateSchema.safeParse(formData)
        if (!validationResult.success) {
            return {
                success: false,
                error: "Validation error",
                details: validationResult.error.format(),
            }
        }

        const updatedProgram = await programsRepository.updateProgram(id, validationResult.data)

        if (!updatedProgram) {
            return { success: false, error: "Program not found" }
        }

        revalidatePath('/programs')
        revalidatePath(`/programs/${id}`)

        return { success: true, data: updatedProgram }
    } catch (error) {
        console.error("Error updating program:", error)
        return { success: false, error: "Failed to update program" }
    }
}

export async function deleteProgram(id: string): Promise<ProgramResult> {
    const session = await getServerSession(authOptions)

    // Check authentication
    if (!session) {
        return { success: false, error: "Unauthorized" }
    }

    // Allow Admins and Doctors to delete programs
    if (!hasRole(session, ["Admin", "Doctor"])) {
        return { success: false, error: "Forbidden" }
    }

    try {
        // In a real application, you might want to check for dependencies
        // (like enrollments) before deletion or implement soft delete
        await xataClient.db.HealthProgram.delete(id)
        revalidatePath('/programs')

        return { success: true }
    } catch (error) {
        console.error("Error deleting program:", error)
        return { success: false, error: "Failed to delete program" }
    }
} 