import { notFound, redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/auth"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ClientEditForm } from "@/components/clients/client-edit-form"
import { getClient } from "@/app/actions/clients/clientActions"
import type { ClientRecord } from "@/lib/xata"

interface ClientEditPageProps {
    params: {
        id: string
    }
}

export default async function ClientEditPage({ params }: ClientEditPageProps) {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect("/login")
    }

    // Use the server action to get client data
    const result = await getClient(params.id)

    if (!result.success || !result.data) {
        notFound()
    }

    // Convert the repository data to the Client type
    const clientRecord = result.data as ClientRecord

    // Create a plain serializable object
    const clientData = {
        id: clientRecord.id,
        firstName: clientRecord.firstName,
        lastName: clientRecord.lastName,
        dateOfBirth: clientRecord.dateOfBirth,
        gender: clientRecord.gender as "male" | "female" | "other",
        nationalId: clientRecord.nationalId || undefined,
        phone: clientRecord.phone || undefined,
        email: clientRecord.email || undefined,
        address: clientRecord.address || undefined,
        emergencyContactName: clientRecord.emergencyContactName || undefined,
        emergencyContactRelationship: clientRecord.emergencyContactRelationship || undefined,
        emergencyContactPhone: clientRecord.emergencyContactPhone || undefined,
        createdBy: clientRecord.createdBy?.id || undefined
    };

    // Serialize the client data to ensure it's plain objects only
    const client = JSON.parse(JSON.stringify(clientData));

    return (
        <DashboardShell>
            <DashboardHeader
                heading={`Edit ${client.firstName} ${client.lastName}`}
                text="Update client information."
            />
            <ClientEditForm client={client} />
        </DashboardShell>
    )
} 