import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/auth"
import { LoginForm } from "@/components/auth/login-form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, Activity } from "lucide-react"

export const metadata: Metadata = {
    title: "Login | Healthcare Information System",
    description: "Login to access the healthcare information system",
}

export default async function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }> // Updated type
}) {
    const session = await getServerSession(authOptions)

    if (session) {
        redirect("/")
    }

    // Await searchParams before accessing it
    const params = await searchParams
    const registered = params.registered === "true"

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-white dark:from-gray-950 dark:to-gray-900 flex flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-2 rounded-lg shadow-md">
                        <Activity className="h-8 w-8" />
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                    Welcome back
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                    Sign in to your account to continue
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                {registered && (
                    <Alert className="mb-6 border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950 shadow-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <AlertDescription className="text-green-700 dark:text-green-300">
                            Registration successful! Please log in with your credentials.
                        </AlertDescription>
                    </Alert>
                )}

                <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-gray-200 dark:border-gray-700">
                    <LoginForm />

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                                    Or
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 flex flex-col space-y-2">
                            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                                Don&apos;t have an account?{" "}
                                <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                                    Register
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                <p className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400 px-4">
                    By continuing, you agree to our{" "}
                    <Link href="#" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                        Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="#" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                        Privacy Policy
                    </Link>.
                </p>
            </div>
        </div>
    )
}