import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/auth"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { ClientsTable } from "@/components/clients/clients-table"
import { ClientSearch } from "@/components/clients/client-search"
import { getClients } from "@/app/actions/clients/clientActions"
// import { DebugClientData } from "./debug"

export const metadata: Metadata = {
    title: "Clients | Healthcare Information System",
    description: "Manage your clients",
}

export default async function ClientsPage({
    searchParams,
}: {
    searchParams?: { search?: string; page?: string }
}) {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect("/login")
    }

    const pageParam = searchParams?.page || "1"
    const searchParam = searchParams?.search || ""

    const page = parseInt(pageParam, 10) || 1
    const result = await getClients(page, 10, searchParam || undefined)

    let initialClients = []
    if (result.success && result.data) {
        try {
            // Deep clone and serialize the data
            initialClients = JSON.parse(JSON.stringify(result.data))
        } catch (error) {
            console.error("Error serializing client data:", error)
        }
    }

    return (
        <DashboardShell>
            <DashboardHeader heading="Clients" text="Manage your client records.">
                <Button asChild>
                    <a href="/clients/new">Register New Client</a>
                </Button>
            </DashboardHeader>
            <div className="space-y-4">
                <ClientSearch />
                <ClientsTable initialClients={initialClients} />
                {/* <DebugClientData /> */}
            </div>
        </DashboardShell>
    )
}