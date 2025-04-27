import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { authOptions } from "@/auth"
import { getServerSession } from "next-auth/next"
import { programsRepository } from "@/lib/repositories"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ProgramDetail } from "@/components/programs/program-detail"

interface ProgramPageProps {
    params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: ProgramPageProps): Promise<Metadata> {
    const resolvedParams = await params
    const program = await programsRepository.getProgramById(resolvedParams.id)

    if (!program) {
        return {
            title: "Program Not Found",
        }
    }

    return {
        title: `${program.name} | Healthcare Information System`,
        description: `Details for the ${program.name} health program`,
    }
}

export default async function ProgramPage({ params }: ProgramPageProps) {
    const resolvedParams = await params
    const session = await getServerSession(authOptions)
    const hasRole = (session: any, roles: string[]) => {
        return session?.user?.role && roles.includes(session.user.role)
    }
    if (!session) {
        redirect("/login")
    }

    const program = await programsRepository.getProgramById(resolvedParams.id)

    if (!program) {
        notFound()
    }

    const isAdmin = hasRole(session, ["Admin", "Doctor"])

    return (
        <DashboardShell>
            <DashboardHeader heading={program.name || "Program Details"} text="View and manage program details." />
            <ProgramDetail program={program} canEdit={isAdmin} />
        </DashboardShell>
    )
}