import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { authOptions } from "@/auth"
import { getServerSession } from "next-auth/next"
import { clientsRepository } from "@/lib/repositories"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { EnrollmentForm } from "@/components/clients/enrollment-form"

interface EnrollClientPageProps {
    params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: EnrollClientPageProps): Promise<Metadata> {
    const resolvedParams = await params
    const client = await clientsRepository.getClientById(resolvedParams.id)

    if (!client) {
        return {
            title: "Client Not Found",
        }
    }

    return {
        title: `Enroll ${client.firstName} ${client.lastName} | Healthcare Information System`,
        description: `Enroll client in a health program`,
    }
}

export default async function EnrollClientPage({ params }: EnrollClientPageProps) {
    const resolvedParams = await params
    const session = await getServerSession(authOptions)
    const hasRole = (session: any, roles: string[]) => {
        return session?.user?.role && roles.includes(session.user.role)
    }

    if (!session) {
        redirect("/login")
    }

    // Check authorization
    if (!hasRole(session, ["Admin", "Doctor", "Nurse"])) {
        redirect("/clients")
    }

    const client = await clientsRepository.getClientById(resolvedParams.id)

    if (!client) {
        notFound()
    }

    return (
        <DashboardShell>
            <DashboardHeader
                heading={`Enroll ${client.firstName} ${client.lastName}`}
                text="Enroll this client in a health program."
            />
            <EnrollmentForm clientId={client.id} clientName={`${client.firstName} ${client.lastName}`} />
        </DashboardShell>
    )
}