import { z } from "zod"

export const clientFormSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
    gender: z.enum(["male", "female", "other"], {
        required_error: "Gender is required",
    }),
    nationalId: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email("Invalid email address").optional().or(z.literal("")),
    address: z.string().optional(),
    emergencyContactName: z.string().optional(),
    emergencyContactRelationship: z.string().optional(),
    emergencyContactPhone: z.string().optional(),
})

export type ClientFormValues = z.infer<typeof clientFormSchema>

export const clientSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    dateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format",
    }),
    gender: z.enum(["male", "female", "other"]),
    nationalId: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional().or(z.literal("")),
    address: z.string().optional(),
    emergencyContactName: z.string().optional(),
    emergencyContactRelationship: z.string().optional(),
    emergencyContactPhone: z.string().optional(),
})

export const clientUpdateSchema = z.object({
    firstName: z.string().min(1, "First name is required").optional(),
    lastName: z.string().min(1, "Last name is required").optional(),
    dateOfBirth: z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), {
            message: "Invalid date format",
        })
        .optional(),
    gender: z.enum(["male", "female", "other"]).optional(),
    nationalId: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional().or(z.literal("")),
    address: z.string().optional(),
    emergencyContactName: z.string().optional(),
    emergencyContactRelationship: z.string().optional(),
    emergencyContactPhone: z.string().optional(),
})

export const enrollmentFormSchema = z.object({
    programId: z.string().min(1, "Program is required"),
    enrollmentDate: z.string().min(1, "Enrollment date is required"),
    status: z.enum(["active", "completed", "suspended"], {
        required_error: "Status is required",
    }),
    notes: z.string().optional(),
    // Dynamic fields will be added based on program requirements
})

export type EnrollmentFormValues = z.infer<typeof enrollmentFormSchema> & Record<string, any>