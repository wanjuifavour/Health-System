"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import { loginFormSchema, type LoginFormValues } from "@/lib/validations/auth"
import { loginUser } from "@/app/actions/auth/login"
import { toast } from "sonner"
import { Icons } from "@/components/icons"

export function LoginForm() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [isGoogleLoading, setIsGoogleLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const handleGoogleLogin = async () => {
        setIsGoogleLoading(true)
        setError(null)

        try {
            // Use direct redirection for OAuth providers
            await signIn("google", {
                callbackUrl: "/",
                redirect: true
            })
        } catch (err) {
            console.error("Google login error:", err)
            setError("An unexpected error occurred with Google login")
            toast.error("Failed to login with Google")
            setIsGoogleLoading(false)
        }
    }

    const onSubmit = async (data: LoginFormValues) => {
        setIsLoading(true)
        setError(null)

        try {
            const formData = new FormData()
            Object.entries(data).forEach(([key, value]) => {
                formData.append(key, value)
            })

            const result = await loginUser(formData)

            if (!result.success) {
                if (result.details) {
                    // Handle validation errors from server
                    Object.entries(result.details).forEach(([field, errors]) => {
                        if (Array.isArray(errors)) {
                            form.setError(field as keyof LoginFormValues, {
                                type: "server",
                                message: errors[0],
                            })
                        }
                    })
                    toast.error("Please fix the errors in the form")
                } else {
                    setError(result.error || "Failed to login")
                    toast.error(result.error || "Failed to login")
                }
                return
            }

            toast.success("Login successful!")
            router.push("/")
            router.refresh()
        } catch (err) {
            console.error("Login error:", err)
            setError(err instanceof Error ? err.message : "An unexpected error occurred")
            toast.error("An unexpected error occurred. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <Card>
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl">Sign in</CardTitle>
                        <CardDescription>Choose your preferred sign in method</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <Button variant="outline" onClick={handleGoogleLogin} disabled={isGoogleLoading} type="button">
                            {isGoogleLoading ? (
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Icons.google className="mr-2 h-4 w-4" />
                            )}
                            Google
                        </Button>
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input id="email" type="email" placeholder="name@example.com" disabled={isLoading} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="grid gap-2">
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input id="password" type="password" disabled={isLoading} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" disabled={isLoading} type="submit">
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Sign In
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </Form>
    )
}