"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { LinkIcon, CalendarIcon, ClipboardListIcon, GraduationCapIcon, ArrowRightIcon } from "lucide-react"
import Link from "next/link"
import { getEnrollments } from "@/app/actions/enrollments/enrollmentActions"

interface ClientEnrollmentsProps {
    clientId: string
}

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
}

export function ClientEnrollments({ clientId }: ClientEnrollmentsProps) {
    const [enrollments, setEnrollments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let isMounted = true;
        let retryCount = 0;
        const maxRetries = 2;

        async function fetchEnrollments() {
            if (!isMounted) return;

            try {
                setIsLoading(true);

                // Use server action instead of fetch API
                const result = await getEnrollments(clientId);

                if (!result.success) {
                    throw new Error(result.error || "Failed to fetch enrollments");
                }

                if (isMounted) {
                    // Log the enrollment data structure for debugging
                    // console.log("Enrollments data:", result.data);

                    // if (result.data && result.data.length > 0) {
                    //     console.log("First enrollment structure:", JSON.stringify(result.data[0], null, 2));
                    //     console.log("Program info from first enrollment:", result.data[0].programId);
                    // }

                    setEnrollments(result.data || []);
                    setError("");
                }
            } catch (err) {
                console.error("Enrollment fetch error:", err);

                if (isMounted) {
                    if (retryCount < maxRetries) {
                        retryCount++;
                        console.log(`Retrying enrollment fetch (${retryCount}/${maxRetries})...`);
                        setTimeout(fetchEnrollments, 1000 * retryCount);
                    } else {
                        setError("Could not load enrollments. Please refresh the page or try again later.");
                    }
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        fetchEnrollments();

        return () => {
            isMounted = false;
        };
    }, [clientId]);

    function getStatusColor(status: string) {
        switch (status.toLowerCase()) {
            case "active":
                return "default";
            case "completed":
                return "secondary";
            case "on hold":
                return "outline";
            case "dropped":
                return "destructive";
            default:
                return "outline";
        }
    }

    return (
        <Card className="border-blue-100 dark:border-blue-950/50 shadow-sm hover:shadow transition-shadow overflow-hidden">
            <CardHeader className="pb-4 bg-gradient-to-r from-blue-50/70 to-white dark:from-blue-950/20 dark:to-transparent">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-xl font-bold text-blue-950 dark:text-blue-100 flex items-center gap-2">
                            <GraduationCapIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            Program Enrollments
                        </CardTitle>
                        <CardDescription className="mt-1">
                            Programs the client is currently enrolled in
                        </CardDescription>
                    </div>
                    <Link href={`/clients/${clientId}/enroll`}>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white border-blue-700/20 shadow-sm hover:shadow-md transition-all duration-150">
                            <div className="flex items-center gap-1">
                                Enroll
                                <ArrowRightIcon className="h-4 w-4 ml-1" />
                            </div>
                        </Button>
                    </Link>
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                {isLoading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                ) : error ? (
                    <div className="text-center py-6">
                        <p className="text-red-500 dark:text-red-400">{error}</p>
                    </div>
                ) : enrollments.length === 0 ? (
                    <div className="text-center py-8 space-y-4 bg-gray-50 dark:bg-gray-950/20 rounded-md">
                        <ClipboardListIcon className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600" />
                        <div>
                            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">No Enrollments</h3>
                            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mt-1">
                                This client is not enrolled in any programs yet.
                            </p>
                        </div>
                        <Button asChild variant="outline" className="mt-4 border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50">
                            <Link href={`/clients/${clientId}/enroll`}>
                                <div className="flex items-center gap-1">
                                    Enroll in a Program
                                    <ArrowRightIcon className="h-4 w-4 ml-1" />
                                </div>
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {enrollments.map((enrollment) => {
                            // Verify enrollment structure to prevent errors
                            if (!enrollment) {
                                return null; // Skip invalid enrollment data
                            }

                            // Handle the case where program data is in programId field instead of program field
                            const program = enrollment.program || enrollment.programId;

                            if (!program) {
                                return null; // Skip if no program data found
                            }

                            return (
                                <div
                                    key={enrollment.id}
                                    className="p-4 border border-gray-100 dark:border-gray-800 rounded-md hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors flex flex-col sm:flex-row justify-between gap-4"
                                >
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-medium text-blue-900 dark:text-blue-100">
                                                {program.name || "Unknown Program"}
                                            </h3>
                                            <Badge variant={getStatusColor(enrollment.status || "unknown")}>
                                                {enrollment.status || "Unknown"}
                                            </Badge>
                                        </div>
                                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
                                            <div className="flex items-center gap-1">
                                                <CalendarIcon className="h-3.5 w-3.5" />
                                                <span>Enrolled: {enrollment.enrollmentDate ? formatDate(enrollment.enrollmentDate) : "Unknown"}</span>
                                            </div>
                                            {enrollment.completionDate && (
                                                <div className="flex items-center gap-1">
                                                    <CalendarIcon className="h-3.5 w-3.5" />
                                                    <span>Completed: {formatDate(enrollment.completionDate)}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <Button
                                            asChild
                                            variant="outline"
                                            size="sm"
                                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50/80 dark:text-blue-400 dark:hover:bg-blue-950/50 border-blue-200 dark:border-blue-900"
                                        >
                                            <Link href={`/enrollments/${enrollment.id}`}>
                                                <LinkIcon className="h-3.5 w-3.5 mr-1.5" />
                                                Details
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}