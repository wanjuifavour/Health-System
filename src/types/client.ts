export interface ProgramEnrollment {
    id: string
    clientId: string
    programId: string
    enrollmentDate: Date
    status: "active" | "completed" | "suspended"
    programSpecificData: Record<string, any>
    notes?: string
    createdAt: Date
    updatedAt: Date
    createdBy: string
}

export interface Client {
    id: string
    firstName: string
    lastName: string
    dateOfBirth: Date | string
    gender: "male" | "female" | "other"
    nationalId?: string
    phone?: string
    email?: string
    address?: string
    emergencyContactName?: string
    emergencyContactRelationship?: string
    emergencyContactPhone?: string
    createdBy?: string | { id: string }
    xata?: {
        createdAt: string
        updatedAt: string
        version: number
    }
}