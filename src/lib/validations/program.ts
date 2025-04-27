import { z } from "zod"

export const programSchema = z.object({
    name: z.string().min(1, "Program name is required"),
    description: z.string().min(1, "Description is required"),
    code: z.string().min(1, "Program code is required"),
    active: z.boolean().default(true),
    requiredFields: z.array(z.string()).default([]),
})

export const programFormSchema = z.object({
    name: z.string().nonempty("Name is required"),
    description: z.string().nonempty("Description is required"),
    code: z.string().nonempty("Code is required"),
    active: z.boolean().optional(),
    requiredFields: z.array(z.string()).optional(),
})

export type ProgramFormValues = z.infer<typeof programFormSchema>