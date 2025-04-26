"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import type { ProgramEnrollment } from "@/types/client"

interface ClientEnrollmentsProps {
    clientId: string
}

export function ClientEnrollments({ clientId }: ClientEnrollmentsProps) {
    const [enrollments, setEnrollments] = useState<ProgramEnrollment[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchEnrollments = async () => {
            setLoading(true)
            try {
                const response = await fetch(`/api/enrollments?clientId=${clientId}`)
                const data = await response.json()

                if (data.success) {
                    setEnrollments(data.data)
                } else {
                    setError(data.error || "Failed to fetch enrollments")
                }
            } catch (error) {
                console.error("Error fetching enrollments:", error)
                setError("An unexpected error occurred")
            } finally {
                setLoading(false)
            }
        }

        fetchEnrollments()
    }, [clientId])

    const getStatusColor = (status: string) => {
        switch (status) {
            case "active":
                return "default"
            case "completed":
                return "secondary"
            case "suspended":
                return "destructive"
            default:
                return "outline"
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Program Enrollments</CardTitle>
                <CardDescription>Health programs this client is enrolled in.</CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="space-y-4">
                        {Array(3)
                            .fill(0)
                            .map((_, index) => (
                                <div key={index} className="flex items-center justify-between border-b pb-4">
                                    <div className="space-y-1">
                                        <Skeleton className="h-5 w-32" />
                                        <Skeleton className="h-4 w-24" />
                                    </div>
                                    <Skeleton className="h-6 w-16" />
                                </div>
                            ))}
                    </div>
                ) : error ? (
                    <div className="py-4 text-center text-muted-foreground">{error}</div>
                ) : enrollments.length === 0 ? (
                    <div className="py-8 text-center text-muted-foreground">
                        <p>This client is not enrolled in any health programs.</p>
                        <a className="mt-4 inline-block" href={`/clients/${clientId}/enroll`}>
                            <Button variant="outline" size="sm">
                                Enroll in Program
                            </Button>
                        </a>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {enrollments.map((enrollment) => (
                            <div key={enrollment.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                                <div>
                                    <div className="font-medium">{enrollment.programId}</div>
                                    <div className="text-sm text-muted-foreground">
                                        Enrolled: {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                                    </div>
                                </div>
                                <Badge variant={getStatusColor(enrollment.status)}>
                                    {enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1)}
                                </Badge>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}