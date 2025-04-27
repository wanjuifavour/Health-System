"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import type { HealthProgramRecord } from "@/lib/xata"
import { enrollmentFormSchema, type EnrollmentFormValues } from "@/lib/validations/client"
import { createEnrollment } from "@/app/actions/enrollments/enrollmentActions"
import { getPrograms } from "@/app/actions/programs/programActions"

interface EnrollmentFormProps {
    clientId: string
    clientName: string
}

export function EnrollmentForm({ clientId, clientName }: EnrollmentFormProps) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [programs, setPrograms] = useState<HealthProgramRecord[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedProgram, setSelectedProgram] = useState<HealthProgramRecord | null>(null)

    const form = useForm<EnrollmentFormValues>({
        resolver: zodResolver(enrollmentFormSchema),
        defaultValues: {
            programId: "",
            enrollmentDate: new Date().toISOString().split("T")[0],
            status: "active",
            notes: "",
        },
    })

    // Fetch available programs
    useEffect(() => {
        const fetchPrograms = async () => {
            setLoading(true)
            try {
                const result = await getPrograms(true)

                if (result.success) {
                    setPrograms(result.data || [])
                } else {
                    setError(result.error || "Failed to fetch programs")
                }
            } catch (error) {
                console.error("Error fetching programs:", error)
                setError("An unexpected error occurred")
            } finally {
                setLoading(false)
            }
        }

        fetchPrograms()
    }, [])

    // Update form schema and fields when program changes
    const onProgramChange = (programId: string) => {
        const program = programs.find((p) => p.id === programId)
        setSelectedProgram(program || null)

        // Reset any previous program-specific fields
        const currentValues = form.getValues()
        const baseFields = ["programId", "enrollmentDate", "status", "notes"]
        const newValues = Object.fromEntries(Object.entries(currentValues).filter(([key]) => baseFields.includes(key)))
        form.reset(newValues)

        // If program has required fields, add them to the form
        if (program?.requiredFields && program.requiredFields.length > 0) {
            // Add required fields to the form
            program.requiredFields.forEach((field) => {
                // Add each required field to the form values
                form.setValue(field, "")
            })
        }
    }

    async function onSubmit(data: EnrollmentFormValues) {
        setIsSubmitting(true)
        setError(null)

        try {
            // Extract base fields and program-specific data
            const { programId, enrollmentDate, status, notes, ...programSpecificData } = data

            // Prepare enrollment data
            const enrollmentData = {
                clientId,
                programId,
                enrollmentDate,
                status,
                notes: notes || undefined,
                programSpecificData: Object.keys(programSpecificData).length > 0 ? programSpecificData : undefined,
            }

            const result = await createEnrollment(enrollmentData)

            if (!result.success) {
                throw new Error(result.error || "Failed to enroll client")
            }

            // Redirect to the client's profile page
            router.push(`/clients/${clientId}`)
            router.refresh()
        } catch (err) {
            console.error("Error enrolling client:", err)
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

                <Card>
                    <CardHeader>
                        <CardTitle>Program Enrollment</CardTitle>
                        <CardDescription>Enroll {clientName} in a health program.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="programId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Health Program</FormLabel>
                                    <Select
                                        onValueChange={(value) => {
                                            field.onChange(value)
                                            onProgramChange(value)
                                        }}
                                        defaultValue={field.value}
                                        disabled={loading}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a health program" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {programs.length === 0 ? (
                                                <SelectItem value="none" disabled>
                                                    No active programs available
                                                </SelectItem>
                                            ) : (
                                                programs.map((program) => (
                                                    <SelectItem key={program.id} value={program.id}>
                                                        {program.name}
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>Select the health program to enroll the client in</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="enrollmentDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Enrollment Date</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel>Enrollment Status</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex flex-col space-y-1"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="active" id="active" />
                                                <Label htmlFor="active">Active</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="completed" id="completed" />
                                                <Label htmlFor="completed">Completed</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="suspended" id="suspended" />
                                                <Label htmlFor="suspended">Suspended</Label>
                                            </div>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Notes</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Add any additional notes about this enrollment"
                                            className="resize-none min-h-[100px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                {/* Program-specific fields */}
                {selectedProgram && selectedProgram.requiredFields && selectedProgram.requiredFields.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Program-Specific Information</CardTitle>
                            <CardDescription>Additional information required for the {selectedProgram.name} program.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {selectedProgram.requiredFields.map((field) => (
                                <FormField
                                    key={field}
                                    control={form.control}
                                    name={field}
                                    render={({ field: formField }) => (
                                        <FormItem>
                                            <FormLabel>{field.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}</FormLabel>
                                            <FormControl>
                                                <Input {...formField} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ))}
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardFooter className="border-t px-6 py-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push(`/clients/${clientId}`)}
                            className="mr-auto"
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Enroll Client
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </Form>
    )
}