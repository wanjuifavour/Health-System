import { ProgramEditForm } from "@/components/programs/program-edit-form"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/auth"
import { redirect } from "next/navigation"

export const metadata = {
    title: "Edit Program",
    description: "Edit an existing health program",
}

export default async function EditProgramPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and has appropriate role
    if (!session || !session.user || !['Admin', 'Doctor'].includes(session.user.role as string)) {
        // Redirect to the login page
        redirect('/login?callbackUrl=/programs')
    }

    return (
        <div className="container py-8">
            <ProgramEditForm programId={resolvedParams.id} />
        </div>
    )
}