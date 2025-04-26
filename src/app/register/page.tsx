import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/auth"
import { DoctorRegistrationForm } from "@/components/auth/registration-form"

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
        <div className="container flex h-screen w-screen flex-col items-center justify-center">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
                <div className="flex flex-col space-y-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
                    <p className="text-sm text-muted-foreground">Register as a healthcare professional to access the system</p>
                </div>
                <DoctorRegistrationForm />
                <p className="px-8 text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link href="/login" className="underline underline-offset-4 hover:text-primary">
                        Sign in
                    </Link>
                </p>
                <p className="px-8 text-center text-sm text-muted-foreground">
                    By continuing, you agree to our{" "}
                    <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
                        Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
                        Privacy Policy
                    </Link>
                    .
                </p>
            </div>
        </div>
    )
}