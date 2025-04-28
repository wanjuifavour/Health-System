import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/auth"
import { DoctorRegistrationForm } from "@/components/auth/registration-form"
import { Activity } from "lucide-react"

export const metadata: Metadata = {
    title: "Register | Healthcare Information System",
    description: "Register as a doctor in the healthcare information system",
}

export default async function RegisterPage() {
    const session = await getServerSession(authOptions)

    if (session) {
        redirect("/")
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-white dark:from-gray-950 dark:to-gray-900 flex flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-2 rounded-lg shadow-md">
                        <Activity className="h-8 w-8" />
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                    Create an account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                    Register as a healthcare professional to access the system
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-gray-200 dark:border-gray-700">
                    <DoctorRegistrationForm />

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
                                Already have an account?{" "}
                                <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                                    Sign in
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