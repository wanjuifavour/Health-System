"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Loader2, Plus, X } from "lucide-react"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Badge } from "@/components/ui/badge"
import { getProgram, updateProgram, deleteProgram } from "@/app/actions/programs/programActions"
import { z } from "zod"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

// Program update form schema
const programUpdateSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    code: z.string().min(1, "Code is required"),
    active: z.boolean().optional(),
    requiredFields: z.array(z.string()).optional(),
})

type ProgramEditFormProps = {
    programId: string
}

export function ProgramEditForm({ programId }: ProgramEditFormProps) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [validationErrors, setValidationErrors] = useState<Record<string, string[]> | null>(null)
    const [newField, setNewField] = useState("")
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

    const form = useForm<z.infer<typeof programUpdateSchema>>({
        resolver: zodResolver(programUpdateSchema),
        defaultValues: {
            name: "",
            description: "",
            code: "",
            active: true,
            requiredFields: [],
        },
    })

    // Fetch program data on component mount
    useEffect(() => {
        async function fetchProgram() {
            try {
                const result = await getProgram(programId)

                if (result.success && result.data) {
                    // Set form values
                    form.reset({
                        name: result.data.name || "",
                        description: result.data.description || "",
                        code: result.data.code || "",
                        active: result.data.active ?? true,
                        requiredFields: result.data.requiredFields || [],
                    })
                } else {
                    setError(result.error || "Failed to fetch program")
                }
            } catch (err) {
                console.error("Error fetching program:", err)
                setError("An error occurred while fetching program data")
            } finally {
                setIsLoading(false)
            }
        }

        fetchProgram()
    }, [programId, form])

    const requiredFields = form.watch("requiredFields") || []

    const handleAddField = () => {
        if (newField.trim() && !requiredFields.includes(newField.trim())) {
            form.setValue("requiredFields", [...requiredFields, newField.trim()])
            setNewField("")
        }
    }

    const handleRemoveField = (field: string) => {
        form.setValue(
            "requiredFields",
            requiredFields.filter((f) => f !== field),
        )
    }

    async function onSubmit(data: z.infer<typeof programUpdateSchema>) {
        setIsSubmitting(true)
        setError(null)
        setValidationErrors(null)

        try {
            // Program data to update
            const programData = {
                name: data.name,
                description: data.description,
                code: data.code,
                active: data.active,
                requiredFields: data.requiredFields,
            }

            const result = await updateProgram(programId, programData)

            if (!result.success) {
                if (result.details) {
                    console.error("Validation errors:", result.details)
                    setValidationErrors(result.details as any)
                }
                throw new Error(result.error || "Failed to update program")
            }

            // Redirect to the program's page
            router.push(`/programs/${programId}`)
            router.refresh()
        } catch (err) {
            console.error("Error updating program:", err)
            setError(err instanceof Error ? err.message : "An unexpected error occurred")
        } finally {
            setIsSubmitting(false)
        }
    }

    async function handleDelete() {
        setIsDeleting(true)
        setError(null)

        try {
            const result = await deleteProgram(programId)

            if (!result.success) {
                throw new Error(result.error || "Failed to delete program")
            }

            router.push('/programs')
            router.refresh()
        } catch (err) {
            console.error("Error deleting program:", err)
            setError(err instanceof Error ? err.message : "An unexpected error occurred")
            setDeleteDialogOpen(false)
        } finally {
            setIsDeleting(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[300px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {validationErrors && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Validation Errors</AlertTitle>
                        <AlertDescription>
                            <ul className="list-disc pl-5">
                                {Object.entries(validationErrors).map(([field, errors]) => (
                                    <li key={field}>
                                        {field}: {Array.isArray(errors) ? errors.join(', ') : JSON.stringify(errors)}
                                    </li>
                                ))}
                            </ul>
                        </AlertDescription>
                    </Alert>
                )}

                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Edit Program</h2>
                    <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="destructive">Delete Program</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Delete Program</DialogTitle>
                                <DialogDescription>
                                    Are you sure you want to delete this program? This action cannot be undone.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                                <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                                    {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Delete
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Program Information</CardTitle>
                        <CardDescription>Update the details of the health program.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Program Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Tuberculosis Control Program" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="A comprehensive program for TB prevention, diagnosis, and treatment."
                                            className="resize-none min-h-[100px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Program Code</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="123 or TB123"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>A unique identifier for the program (can include letters and numbers)</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="active"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">Active Status</FormLabel>
                                        <FormDescription>Set whether this program is currently active</FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch checked={field.value || false} onCheckedChange={field.onChange} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Required Fields</CardTitle>
                        <CardDescription>Define the data fields required for this program.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Input
                                placeholder="Add a required field (e.g., 'test_date', 'medication')"
                                value={newField}
                                onChange={(e) => setNewField(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault()
                                        handleAddField()
                                    }
                                }}
                            />
                            <Button type="button" onClick={handleAddField} size="sm">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-2">
                            {requiredFields.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No required fields added yet.</p>
                            ) : (
                                requiredFields.map((field) => (
                                    <Badge key={field} variant="secondary" className="flex items-center gap-1">
                                        {field}
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="h-4 w-4 p-0 hover:bg-transparent"
                                            onClick={() => handleRemoveField(field)}
                                        >
                                            <X className="h-3 w-3" />
                                            <span className="sr-only">Remove {field}</span>
                                        </Button>
                                    </Badge>
                                ))
                            )}
                        </div>
                        <FormDescription>These fields will be required when enrolling clients in this program.</FormDescription>
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4">
                        <Button type="submit" disabled={isSubmitting} className="ml-auto">
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Update Program
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </Form>
    )
} 