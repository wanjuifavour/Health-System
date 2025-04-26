import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { xataClient } from "@/lib/repositories"

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error("Missing Google OAuth credentials")
}

export const authOptions = {
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        }),
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Missing credentials")
                }

                const user = await xataClient.db.User.filter({ email: credentials.email }).getFirst()

                if (!user) {
                    throw new Error("Invalid email or password")
                }

                const isValid = user.password ? await compare(credentials.password, user.password) : false

                if (!isValid) {
                    throw new Error("Invalid email or password")
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                }
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }: { user: any; account: any; profile?: any }) {
            // Only handle Google OAuth sign-ins
            if (account?.provider === "google" && profile) {
                try {
                    // Check if user already exists in the database
                    let dbUser = await xataClient.db.User.filter({
                        email: user.email
                    }).getFirst()

                    // If the user doesn't exist, create a new one
                    if (!dbUser && user.email) {
                        dbUser = await xataClient.db.User.create({
                            email: user.email,
                            name: user.name,
                            // Assign a default role
                            role: "Doctor",
                            // Set oauthProvider
                            oauthProvider: "google",
                            oauthId: user.id,
                        })
                    }

                    if (dbUser) {
                        // Update the user object with database info
                        user.role = dbUser.role
                        user.id = dbUser.id
                        return true
                    }
                } catch (error) {
                    console.error("Error in signIn callback:", error)
                    return false
                }
            }

            return true
        },

        async jwt({ token, user }: { token: any; user?: { role?: string; id?: string } }) {
            if (user?.role) {
                token.role = user.role
            }
            if (user?.id) {
                token.userId = user.id
            }
            return token
        },

        async session({ session, token }: { session: any; token: any }) {
            if (session.user) {
                session.user.role = token.role
                session.user.id = token.userId
            }
            return session
        },
    },
    pages: {
        signIn: "/login",
        error: "/login",
    },
    session: {
        strategy: "jwt" as const,
    },
}

export default NextAuth(authOptions)