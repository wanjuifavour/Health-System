export interface HealthProgram {
    id: string
    name: string
    description: string
    code: string
    active: boolean
    requiredFields: string[]
    createdAt: Date
    updatedAt: Date
}