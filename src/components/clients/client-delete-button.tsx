"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
import { Button } from "@/components/ui/button"
import { Loader2, Trash2 } from "lucide-react"
import { deleteClient } from "@/app/actions/clients/clientActions"
import { toast } from "sonner"

interface ClientDeleteButtonProps {
    clientId: string
    clientName: string
}

export function ClientDeleteButton({ clientId, clientName }: ClientDeleteButtonProps) {
    const router = useRouter()
    const [isDeleting, setIsDeleting] = useState(false)
    const [open, setOpen] = useState(false)

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            const result = await deleteClient(clientId)

            if (result.success) {
                toast.success(`${clientName} has been deleted successfully.`)
                router.push("/clients")
                router.refresh()
            } else {
                toast.error(result.error || "Failed to delete client. Please try again.")
            }
        } catch (error) {
            console.error("Error deleting client:", error)
            toast.error("An unexpected error occurred. Please try again.")
        } finally {
            setIsDeleting(false)
            setOpen(false)
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Client
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to delete this client?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete {clientName}&apos;s records from the system.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                    <AlertDialogAction disabled={isDeleting} onClick={(e) => {
                        e.preventDefault() // Prevent the dialog from closing automatically
                        handleDelete()
                    }}>
                        {isDeleting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            "Delete"
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
} 