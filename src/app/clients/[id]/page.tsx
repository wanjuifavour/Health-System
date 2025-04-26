import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/auth"
import { clientsRepository } from "@/lib/repositories"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { ClientProfile } from "@/components/clients/client-profile"
import { ClientEnrollments } from "@/components/clients/client-enrollments"
import { getClient } from "@/app/actions/clients/clientActions"
import type { ClientRecord } from "@/lib/xata"
import { ClientDeleteButton } from "@/components/clients/client-delete-button"

interface ClientPageProps {
    params: {
        id: string
    }
}

export async function generateMetadata({ params }: ClientPageProps): Promise<Metadata> {
    const client = await clientsRepository.getClientById(params.id)

    if (!client) {
        return {
            title: "Client Not Found",
        }
    }

    return {
        title: `${client.firstName} ${client.lastName} | Healthcare Information System`,
        description: `Client profile for ${client.firstName} ${client.lastName}`,
    }
}

export default async function ClientPage({ params }: ClientPageProps) {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect("/login")
    }

    const result = await getClient(params.id)

    if (!result.success || !result.data) {
        notFound()
    }

    const clientRecord = result.data as ClientRecord

    const clientData = {
        id: clientRecord.id,
        firstName: clientRecord.firstName,
        lastName: clientRecord.lastName,
        dateOfBirth: clientRecord.dateOfBirth,
        gender: clientRecord.gender as "male" | "female" | "other",
        nationalId: clientRecord.nationalId || undefined,
        phone: clientRecord.phone?.toString() || undefined,
        email: clientRecord.email || undefined,
        address: clientRecord.address || undefined,
        emergencyContactName: clientRecord.emergencyContactName || undefined,
        emergencyContactRelationship: clientRecord.emergencyContactRelationship || undefined,
        emergencyContactPhone: clientRecord.emergencyContactPhone?.toString() || undefined,
        createdBy: clientRecord.createdBy?.id || undefined,
        xata: {
            createdAt: clientRecord.xata.createdAt.toISOString(),
            updatedAt: clientRecord.xata.updatedAt.toISOString(),
            version: clientRecord.xata.version
        }
    };

    const client = JSON.parse(JSON.stringify(clientData));

    const canDelete = session?.user?.role === "Doctor"

    return (
        <DashboardShell>
            <DashboardHeader
                heading={`${client.firstName} ${client.lastName}`}
                text="Client profile and program enrollments."
            >
                <div className="flex gap-2">
                    <Button variant="outline" asChild>
                        <a href={`/clients/${client.id}/edit`}>
                            Edit Profile
                        </a>
                    </Button>
                    <Button asChild>
                        <a href={`/clients/${client.id}/enroll`}>Enroll in Program</a>
                    </Button>
                    {canDelete && (
                        <ClientDeleteButton
                            clientId={client.id}
                            clientName={`${client.firstName} ${client.lastName}`}
                        />
                    )}
                </div>
            </DashboardHeader>

            <div className="grid gap-6 md:grid-cols-2">
                <ClientProfile client={client} />
                <ClientEnrollments clientId={client.id} />
            </div>
        </DashboardShell>
    )
}