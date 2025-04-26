import { z } from "zod"

export const registrationFormSchema = z
    .object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.string().email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
        confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
        role: z.enum(/*[UserRole.DOCTOR, UserRole.NURSE]*/["Doctor", "Nurse"]),
        facilityName: z.string().min(2, "Facility name is required"),
        facilityAddress: z.string().optional(),
        facilityPhone: z.string().optional(),
        facilityEmail: z.string().email("Invalid facility email").optional().or(z.literal("")),
        licenseNumber: z.string().min(2, "License number is required"),
        specialization: z.string().optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    })

export type RegistrationFormValues = z.infer<typeof registrationFormSchema>

export const loginFormSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
})

export type LoginFormValues = z.infer<typeof loginFormSchema>