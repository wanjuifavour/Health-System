import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { authOptions } from "@/auth"
import { getServerSession } from "next-auth/next"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ProgramCreationForm } from "@/components/programs/program-creation-form"

export const metadata: Metadata = {
    title: "Create Program | Healthcare Information System",
    description: "Create a new health program in the system",
}

export default async function NewProgramPage() {
    const session = await getServerSession(authOptions)

    const hasRole = (session: any, roles: string[]) => {
        return session?.user?.role && roles.includes(session.user.role)
    }

    if (!session) {
        redirect("/login")
    }

    // Only admins can create programs
    if (!hasRole(session, ["Admin", "Doctor"])) {
        redirect("/programs")
    }

    return (
        <DashboardShell>
            <DashboardHeader heading="Create Health Program" text="Add a new health program to the system." />
            <ProgramCreationForm />
        </DashboardShell>
    )
}
