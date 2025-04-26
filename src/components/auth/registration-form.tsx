"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { registrationFormSchema, RegistrationFormValues } from "@/lib/validations/auth"
import { registerUser } from "@/app/actions/auth/register"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
// import { UserRole } from "@/lib/auth"
// import { apiClient } from "@/lib/api-client"

export function DoctorRegistrationForm() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const form = useForm<RegistrationFormValues>({
        resolver: zodResolver(registrationFormSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            // role: UserRole.DOCTOR,
            role: "Doctor",
            facilityName: "",
            facilityAddress: "",
            facilityPhone: "",
            facilityEmail: "",
            licenseNumber: "",
            specialization: "",
        },
        mode: "onChange",
    })

    const password = form.watch("password")
    const confirmPassword = form.watch("confirmPassword")

    async function onSubmit(data: RegistrationFormValues) {
        setIsSubmitting(true)
        setError(null)

        try {
            const formData = new FormData()
            Object.entries(data).forEach(([key, value]) => {
                formData.append(key, value)
            })

            const result = await registerUser(formData)

            if (!result.success) {
                if (result.details) {
                    // Handle validation errors from server
                    Object.entries(result.details).forEach(([field, errors]) => {
                        if (Array.isArray(errors)) {
                            form.setError(field as keyof RegistrationFormValues, {
                                type: "server",
                                message: errors[0],
                            })
                        }
                    })
                    toast.error("Please fix the errors in the form")
                } else {
                    toast.error(result.error || "Failed to register")
                }
                return
            }

            toast.success("Registration successful! Please log in.")
            form.reset()

        } catch (err) {
            console.error("Error registering:", err)
            setError(err instanceof Error ? err.message : "An unexpected error occurred")
            toast.error("An unexpected error occurred. Please try again.")
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

                {form.formState.errors.root && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Form Error</AlertTitle>
                        <AlertDescription>{form.formState.errors.root.message}</AlertDescription>
                    </Alert>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>Enter your personal and professional details.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Dr. Jane Smith" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="doctor@example.com" {...field} />
                                    </FormControl>
                                    <FormDescription>This will be your login email</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                {...field}
                                                className={cn(
                                                    form.formState.errors.password && "border-destructive"
                                                )}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Password must be at least 8 characters long
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                {...field}
                                                className={cn(
                                                    form.formState.errors.confirmPassword && "border-destructive"
                                                )}
                                            />
                                        </FormControl>
                                        {password && confirmPassword && password !== confirmPassword && (
                                            <FormDescription className="text-destructive">
                                                Passwords do not match
                                            </FormDescription>
                                        )}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select your role" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Doctor"/*{UserRole.DOCTOR}*/>Doctor</SelectItem>
                                            <SelectItem value="Nurse"/*{UserRole.NURSE}*/>Nurse</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="licenseNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>License Number</FormLabel>
                                        <FormControl>
                                            <Input placeholder="MD12345" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="specialization"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Specialization</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Cardiology, General Practice, etc." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Facility Information</CardTitle>
                        <CardDescription>Enter details about your healthcare facility.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="facilityName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Facility Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="City General Hospital" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="facilityAddress"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Facility Address</FormLabel>
                                    <FormControl>
                                        <Input placeholder="123 Medical Center Blvd, City, Country" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="facilityPhone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Facility Phone</FormLabel>
                                        <FormControl>
                                            <Input placeholder="+1 (555) 123-4567" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="facilityEmail"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Facility Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="info@hospital.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4">
                        <Button
                            type="submit"
                            disabled={isSubmitting || !form.formState.isValid}
                            className="ml-auto"
                        >
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Register
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </Form>
    )
}