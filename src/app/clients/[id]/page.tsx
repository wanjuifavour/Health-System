import { notFound, redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import Link from "next/link"
import { authOptions } from "@/auth"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { ClientProfile } from "@/components/clients/client-profile"
import { ClientEnrollments } from "@/components/clients/client-enrollments"
import { getClient } from "@/app/actions/clients/clientActions"
import type { ClientRecord } from "@/lib/xata"
import { ClientDeleteButton } from "@/components/clients/client-delete-button"
import { Pencil, PlusCircle } from "lucide-react"


// export async function generateMetadata({ params }: ClientPageProps): Promise<Metadata> {
//     const client = await clientsRepository.getClientById(params.id)

//     if (!client) {
//         return {
//             title: "Client Not Found",
//         }
//     }

//     return {
//         title: `${client.firstName} ${client.lastName} | Healthcare Information System`,
//         description: `Client profile for ${client.firstName} ${client.lastName}`,
//     }
// }

export default async function ClientPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const resolvedParams = await params
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect("/login")
    }

    const result = await getClient(resolvedParams.id)

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
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <Button
                        variant="outline"
                        asChild
                        className="w-full sm:w-auto text-blue-600 border-blue-200 hover:text-blue-700 hover:bg-blue-50 hover:border-blue-300 dark:text-blue-400 dark:border-blue-950 dark:hover:border-blue-900 dark:hover:bg-blue-950/30 gap-1"
                    >
                        <Link href={`/clients/${client.id}/edit`}>
                            <Pencil className="h-4 w-4" />
                            Edit Profile
                        </Link>
                    </Button>
                    <Button
                        asChild
                        className="w-full sm:w-auto gap-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                    >
                        <Link href={`/clients/${client.id}/enroll`}>
                            <PlusCircle className="h-4 w-4" />
                            Enroll in Program
                        </Link>
                    </Button>
                    {canDelete && (
                        <ClientDeleteButton
                            clientId={client.id}
                            clientName={`${client.firstName} ${client.lastName}`}
                        />
                    )}
                </div>
            </DashboardHeader>

            <div className="grid gap-6 sm:px-4 md:grid-cols-2 lg:gap-8">
                <ClientProfile client={client} />
                <ClientEnrollments clientId={client.id} />
            </div>
        </DashboardShell>
    )
}