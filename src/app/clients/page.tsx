import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import Link from "next/link"
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
    searchParams: Promise<{ search?: string; page?: string;[key: string]: string | string[] | undefined }>
}) {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect("/login")
    }

    // Await searchParams before accessing it
    const params = await searchParams
    const pageParam = params.page || "1"
    const searchParam = params.search || ""

    const page = parseInt(pageParam as string, 10) || 1
    const result = await getClients(page, 10, searchParam ? (searchParam as string) : undefined)

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
                <Button asChild className="w-full sm:w-auto">
                    <Link href="/clients/new">Register New Client</Link>
                </Button>
            </DashboardHeader>
            <div className="space-y-4 px-1 md:px-4 w-full max-w-[1400px] mx-auto">
                <ClientSearch />
                <ClientsTable initialClients={initialClients} />
                {/* <DebugClientData /> */}
            </div>
        </DashboardShell>
    )
}