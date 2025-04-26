import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/auth"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ClientRegistrationForm } from "@/components/clients/client-registration-form"

export const metadata: Metadata = {
    title: "Register Client | Healthcare Information System",
    description: "Register a new client in the system",
}

export default async function NewClientPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect("/login")
    }

    return (
        <DashboardShell>
            <DashboardHeader heading="Register New Client" text="Add a new client to the healthcare system." />
            <ClientRegistrationForm />
        </DashboardShell>
    )
}
