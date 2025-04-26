"use server"

import { z } from "zod"
import { loginFormSchema } from "@/lib/validations/auth"
import { compare } from "bcryptjs"
import { xataClient } from "@/lib/repositories"
import { cookies } from "next/headers"
import { encode } from "next-auth/jwt"

export type LoginResult = {
    success: boolean
    error?: string
    details?: z.ZodFormattedError<z.infer<typeof loginFormSchema>>
}

export async function loginUser(formData: FormData): Promise<LoginResult> {
    try {
        const data = {
            email: formData.get("email"),
            password: formData.get("password"),
        }

        // Validate request body
        const validationResult = loginFormSchema.safeParse(data)
        if (!validationResult.success) {
            return {
                success: false,
                error: "Validation error",
                details: validationResult.error.format(),
            }
        }

        const { email, password } = validationResult.data

        try {
            // Find the user directly using the repository
            const user = await xataClient.db.User.filter({ email }).getFirst()

            if (!user) {
                return {
                    success: false,
                    error: "Invalid email or password",
                }
            }

            // Verify the password
            const isValidPassword = await compare(password, user.password)
            if (!isValidPassword) {
                return {
                    success: false,
                    error: "Invalid email or password",
                }
            }

            // Create session token
            const token = await encode({
                token: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                },
                secret: process.env.NEXTAUTH_SECRET || "",
            })

            // Set session cookie
            const cookieStore = await cookies();
            cookieStore.set({
                name: "next-auth.session-token",
                value: token,
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 30 * 24 * 60 * 60, // 30 days
                path: "/",
            })

            return {
                success: true,
            }
        } catch (error) {
            if (error instanceof Error) {
                return {
                    success: false,
                    error: error.message,
                }
            }
            return {
                success: false,
                error: "An unexpected error occurred",
            }
        }
    } catch (error) {
        console.error("Login error:", error)
        return {
            success: false,
            error: "An unexpected error occurred",
        }
    }
}

export async function loginWithGoogle() {
    // For OAuth providers like Google, you should redirect to the provider's auth page
    // This needs to be handled differently, as OAuth flow requires client-side redirection
    return {
        success: false,
        error: "Google login needs to be initiated from the client side",
    }
}
