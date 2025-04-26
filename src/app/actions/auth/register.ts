"use server"

import { hash } from "bcryptjs"
import { registrationFormSchema } from "@/lib/validations/auth"
import { xataClient } from "@/lib/repositories"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

export type RegistrationResult = {
    success: boolean
    error?: string
    details?: z.ZodFormattedError<z.infer<typeof registrationFormSchema>>
}

export async function registerUser(formData: FormData): Promise<RegistrationResult> {
    try {
        const data = {
            name: formData.get("name"),
            email: formData.get("email"),
            password: formData.get("password"),
            confirmPassword: formData.get("confirmPassword"),
            role: formData.get("role"),
            facilityName: formData.get("facilityName"),
            facilityAddress: formData.get("facilityAddress"),
            facilityPhone: formData.get("facilityPhone"),
            facilityEmail: formData.get("facilityEmail"),
            licenseNumber: formData.get("licenseNumber"),
            specialization: formData.get("specialization"),
        }

        // Validate request body
        const validationResult = registrationFormSchema.safeParse(data)
        if (!validationResult.success) {
            return {
                success: false,
                error: "Validation error",
                details: validationResult.error.format(),
            }
        }

        const {
            name,
            email,
            password,
            role,
            facilityName,
            facilityAddress,
            facilityPhone,
            facilityEmail,
            licenseNumber,
            specialization,
        } = validationResult.data

        // Check if user already exists
        const existingUser = await xataClient.db.User.filter({ email }).getFirst()
        if (existingUser) {
            return {
                success: false,
                error: "User with this email already exists"
            }
        }

        // Check if facility exists or create a new one
        let facility = await xataClient.db.Facility.filter({ name: facilityName }).getFirst()

        if (!facility) {
            // Create new facility
            facility = await xataClient.db.Facility.create({
                name: facilityName,
                address: facilityAddress,
                phone: facilityPhone ? Number.parseInt(facilityPhone.replace(/\D/g, "")) : undefined,
                email: facilityEmail || undefined,
            })
        }

        // Hash password
        const hashedPassword = await hash(password, 10)

        // Create user with role and facility
        const user = await xataClient.db.User.create({
            name,
            email,
            role,
            password: hashedPassword,
            facilityId: { id: facility.id },
        })

        // Store professional information
        const metadata = {
            licenseNumber,
            specialization,
            userId: user.id,
        }

        // In a real system, you would store this in a proper table
        console.log("Professional info:", metadata)

        revalidatePath("/")

        // Return success before redirecting
        return {
            success: true
        }

        // Redirect will happen after the response is sent
        redirect("/login?registered=true")
    } catch (error) {
        console.error("Error registering user:", error)
        return {
            success: false,
            error: "Failed to register user"
        }
    }
}