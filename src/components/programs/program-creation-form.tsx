"use client"

import { useState } from "react"
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
import { programFormSchema } from "@/lib/validations/program"
import { createProgram } from "@/app/actions/programs/programActions"
import { z } from "zod"

export function ProgramCreationForm() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [validationErrors, setValidationErrors] = useState<Record<string, string[]> | null>(null)
    const [newField, setNewField] = useState("")

    const form = useForm<z.infer<typeof programFormSchema>>({
        resolver: zodResolver(programFormSchema),
        defaultValues: {
            name: "",
            description: "",
            code: "",
            active: true,
            requiredFields: [],
        },
    })

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

    async function onSubmit(data: z.infer<typeof programFormSchema>) {
        setIsSubmitting(true)
        setError(null)
        setValidationErrors(null)

        try {
            // Convert program data to match the database schema
            const programData = {
                name: data.name,
                description: data.description,
                code: data.code,
                active: data.active === undefined ? true : data.active,
                requiredFields: data.requiredFields || [],
            }

            console.log("Submitting program data:", programData)

            const result = await createProgram(programData)

            if (!result.success) {
                if (result.details) {
                    console.error("Validation errors:", result.details)
                    setValidationErrors(result.details as any)
                }
                throw new Error(result.error || "Failed to create program")
            }

            // Redirect to the program's page
            if (result.data?.id) {
                router.push(`/programs/${result.data.id}`)
                router.refresh()
            } else {
                router.push('/programs')
                router.refresh()
            }
        } catch (err) {
            console.error("Error creating program:", err)
            setError(err instanceof Error ? err.message : "An unexpected error occurred")
        } finally {
            setIsSubmitting(false)
        }
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

                <Card>
                    <CardHeader>
                        <CardTitle>Program Information</CardTitle>
                        <CardDescription>Enter the details of the health program.</CardDescription>
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
                                            type="text"
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
                            Create Program
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </Form>
    )
}