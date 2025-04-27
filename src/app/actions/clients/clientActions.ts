'use server';

import { authOptions } from "@/auth"
import { getServerSession } from "next-auth/next"
import { clientsRepository } from "@/lib/repositories"
import { clientSchema, clientUpdateSchema } from "@/lib/validations/client"
import { revalidatePath } from "next/cache"

type GetClientsResult = {
    success: boolean
    data?: any[]
    meta?: {
        page: number
        pageSize: number
        totalRecords: number
        totalPages: number
    }
    error?: string
    details?: string
}

type ClientResult = {
    success: boolean
    data?: any
    error?: string
    details?: any
    message?: string
}

const hasRole = (session: any, roles: string[]) => {
    return session?.user?.role && roles.includes(session.user.role)
}

export async function getClient(id: string): Promise<ClientResult> {
    const session = await getServerSession(authOptions)

    // Check authentication
    if (!session) {
        return { success: false, error: "Unauthorized" }
    }

    // Check authorization
    if (!hasRole(session, ["Admin", "Doctor", "Nurse"])) {
        return { success: false, error: "Forbidden" }
    }

    try {
        const clientData = await clientsRepository.getClientById(id)

        if (!clientData) {
            return { success: false, error: "Client not found" }
        }

        return { success: true, data: clientData }
    } catch (error) {
        console.error("Error fetching client:", error)
        return { success: false, error: "Failed to fetch client" }
    }
}

export async function getClients(page = 1, pageSize = 10, search?: string): Promise<GetClientsResult> {
    const session = await getServerSession(authOptions)

    // Check authentication
    if (!session) {
        return { success: false, error: "Unauthorized" }
    }

    // Check authorization
    if (!hasRole(session, ["Admin", "Doctor", "Nurse"])) {
        return { success: false, error: "Forbidden" }
    }

    try {
        let records: any[] = [];
        let totalPages = 1;

        if (search) {
            const result = await clientsRepository.searchClients(search, page, pageSize);
            records = JSON.parse(JSON.stringify(result.records));
            totalPages = 1;
        } else {
            const result = await clientsRepository.getClients(page, pageSize);
            records = JSON.parse(JSON.stringify(result.records));

            if (records.length < pageSize && page === 1) {
                totalPages = 1;
            } else {
                totalPages = page + 1;
            }
        }

        return {
            success: true,
            data: records,
            meta: {
                page,
                pageSize,
                totalRecords: records.length * totalPages,
                totalPages,
            },
        }
    } catch (error) {
        console.error("Error fetching clients:", error)
        return {
            success: false,
            error: "Failed to fetch clients",
            details: error instanceof Error ? error.message : String(error)
        }
    }
}

export async function updateClient(id: string, data: any): Promise<ClientResult> {
    const session = await getServerSession(authOptions)

    // Check authentication
    if (!session) {
        return { success: false, error: "Unauthorized" }
    }

    // Check authorization
    if (!hasRole(session, ["Admin", "Doctor", "Nurse"])) {
        return { success: false, error: "Forbidden" }
    }

    try {
        const existingClient = await clientsRepository.getClientById(id)
        if (!existingClient) {
            return { success: false, error: "Client not found" }
        }

        console.log("Received update data:", JSON.stringify(data, null, 2));

        const cleanedData = { ...data };

        const validationResult = clientUpdateSchema.safeParse(cleanedData)
        if (!validationResult.success) {
            console.log("Validation error:", validationResult.error);
            return {
                success: false,
                error: "Validation error",
                details: validationResult.error.format(),
            }
        }

        const clientData: any = { ...validationResult.data }
        if (clientData.dateOfBirth) {
            clientData.dateOfBirth = new Date(clientData.dateOfBirth).toISOString()
        }

        console.log("Processed update data:", JSON.stringify(clientData, null, 2));

        const updatedClient = await clientsRepository.updateClient(id, clientData)

        revalidatePath('/clients')
        revalidatePath(`/clients/${id}`)

        return { success: true, data: updatedClient }
    } catch (error) {
        console.error("Error updating client:", error)
        return { success: false, error: "Failed to update client" }
    }
}

export async function deleteClient(id: string): Promise<ClientResult> {
    const session = await getServerSession(authOptions)

    // Check authentication
    if (!session) {
        return { success: false, error: "Unauthorized" }
    }

    // Check authorization - only doctors can delete clients
    if (!hasRole(session, ["Doctor"])) {
        return { success: false, error: "Forbidden" }
    }

    try {
        await clientsRepository.deleteClient(id)

        // Revalidate the clients page
        revalidatePath('/clients')

        return { success: true, message: "Client deleted successfully" }
    } catch (error) {
        console.error("Error deleting client:", error)
        return { success: false, error: "Failed to delete client" }
    }
}

export async function createClient(data: any): Promise<ClientResult> {
    const session = await getServerSession(authOptions)

    // Check authentication
    if (!session) {
        return { success: false, error: "Unauthorized" }
    }

    // Check authorization
    if (!hasRole(session, ["Admin", "Doctor", "Nurse"])) {
        return { success: false, error: "Forbidden" }
    }

    try {
        console.log("Received client data:", JSON.stringify(data, null, 2));

        const cleanedData = { ...data };
        // No need to handle emergency contact data as it's already flat

        const validationResult = clientSchema.safeParse(cleanedData)
        if (!validationResult.success) {
            console.log("Validation error:", validationResult.error);
            return {
                success: false,
                error: "Validation error",
                details: validationResult.error.format(),
            }
        }

        const clientData: any = {
            ...validationResult.data,
            dateOfBirth: new Date(validationResult.data.dateOfBirth).toISOString(),
        }

        // No need to process emergency contact since it's already flat

        console.log("Processed client data:", JSON.stringify(clientData, null, 2));

        // Create client with the proper ID reference
        const newClient = await clientsRepository.createClient({
            ...clientData,
            createdBy: session.user.id ? { id: session.user.id } : undefined
        })

        // Revalidate the clients page
        revalidatePath('/clients')

        return { success: true, data: newClient }
    } catch (error) {
        console.error("Error creating client:", error)
        return { success: false, error: "Failed to create client" }
    }
}