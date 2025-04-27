"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Loader2, Trash2, Pencil } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { deleteProgram } from "@/app/actions/programs/programActions"
import type { HealthProgramRecord } from "@/lib/xata"

interface ProgramDetailProps {
    program: HealthProgramRecord
    canEdit: boolean
}

export function ProgramDetail({ program, canEdit }: ProgramDetailProps) {
    const router = useRouter()
    const [isDeleting, setIsDeleting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleDelete() {
        setIsDeleting(true)
        try {
            const result = await deleteProgram(program.id)

            if (!result.success) {
                throw new Error(result.error || "Failed to delete program")
            }

            router.push("/programs")
            router.refresh()
        } catch (err) {
            console.error("Error deleting program:", err)
            setError(err instanceof Error ? err.message : "An unexpected error occurred")
            setIsDeleting(false)
        }
    }

    return (
        <div className="space-y-6">
            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {canEdit && (
                <div className="flex justify-end gap-2">
                    <Button asChild>
                        <Link href={`/programs/${program.id}/edit`}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit Program
                        </Link>
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Program
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the program and remove all associated data.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="bg-destructive text-destructive-foreground"
                                >
                                    {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Program Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h3 className="font-medium">Name</h3>
                        <p className="mt-1">{program.name}</p>
                    </div>
                    <div>
                        <h3 className="font-medium">Description</h3>
                        <p className="mt-1">{program.description || "No description provided."}</p>
                    </div>
                    <div>
                        <h3 className="font-medium">Program Code</h3>
                        <p className="mt-1">{program.code}</p>
                    </div>
                    <div>
                        <h3 className="font-medium">Status</h3>
                        <div className="mt-1">
                            <Badge variant={program.active ? "default" : "secondary"}>
                                {program.active ? "Active" : "Inactive"}
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Required Fields</CardTitle>
                </CardHeader>
                <CardContent>
                    {program.requiredFields && program.requiredFields.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {program.requiredFields.map((field) => (
                                <Badge key={field} variant="secondary">
                                    {field}
                                </Badge>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">No required fields defined for this program.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}