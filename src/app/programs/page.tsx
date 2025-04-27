import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { authOptions } from "@/auth"
import { getServerSession } from "next-auth/next"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { ProgramsTable } from "@/components/programs/programs-table"
import Link from "next/link"

export const metadata: Metadata = {
    title: "Health Programs | Healthcare Information System",
    description: "Manage health programs",
}

export default async function ProgramsPage() {
    const session = await getServerSession(authOptions)
    const hasRole = (session: any, roles: string[]) => {
        return session?.user?.role && roles.includes(session.user.role)
    }
    

    if (!session) {
        redirect("/login")
    }

    const isAdmin = hasRole(session, ["Admin", "Doctor"])

    return (
        <DashboardShell>
            <DashboardHeader heading="Health Programs" text="Manage your health programs.">
                {isAdmin &&
                    <Button asChild>
                        <Link href="/programs/new"> Create Program </Link>
                    </Button>}
            </DashboardHeader>
            <ProgramsTable />
        </DashboardShell>
    )
}
