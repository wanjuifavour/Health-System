"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import type { HealthProgram } from "@/types/program"
import { getPrograms } from "@/app/actions/programs/programActions"
import { Card, CardContent } from "@/components/ui/card"

function formatDate(dateString: string | Date): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
}

export function ProgramsTable() {
    const router = useRouter()
    const [programs, setPrograms] = useState<HealthProgram[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [viewMode, setViewMode] = useState<'table' | 'cards'>('table')

    // Set view mode based on screen size
    useEffect(() => {
        const handleResize = () => {
            setViewMode(window.innerWidth < 640 ? 'cards' : 'table')
        }

        // Set initial value
        handleResize()

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    useEffect(() => {
        const fetchPrograms = async () => {
            setLoading(true)
            try {
                const result = await getPrograms(false)

                if (result.success && result.data) {
                    setPrograms(result.data as unknown as HealthProgram[])
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

    const handleViewProgram = (id: string) => {
        router.push(`/programs/${id}`)
    }

    if (loading) {
        return viewMode === 'table' ? (
            <div className="rounded-md border overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead className="hidden sm:table-cell">Code</TableHead>
                            <TableHead className="hidden sm:table-cell">Status</TableHead>
                            <TableHead className="hidden md:table-cell">Created</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array(5)
                            .fill(0)
                            .map((_, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <Skeleton className="h-5 w-32" />
                                            <Skeleton className="h-4 w-48" />
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        <Skeleton className="h-4 w-16" />
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        <Skeleton className="h-6 w-16" />
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        <Skeleton className="h-4 w-24" />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Skeleton className="h-8 w-16 ml-auto" />
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </div>
        ) : (
            <div className="grid grid-cols-1 gap-4">
                {Array(5)
                    .fill(0)
                    .map((_, index) => (
                        <Card key={index}>
                            <CardContent className="p-4">
                                <div className="space-y-2">
                                    <Skeleton className="h-5 w-32" />
                                    <Skeleton className="h-4 w-full" />
                                    <div className="flex justify-between items-center pt-2">
                                        <Skeleton className="h-6 w-16" />
                                        <Skeleton className="h-8 w-16" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
            </div>
        )
    }

    if (error) {
        return (
            <div className="rounded-md border p-8 text-center">
                <p className="text-muted-foreground">{error}</p>
                <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                    Try Again
                </Button>
            </div>
        )
    }

    if (programs.length === 0) {
        return (
            <div className="rounded-md border p-8 text-center">
                <p className="text-muted-foreground">No health programs found</p>
            </div>
        )
    }

    if (viewMode === 'cards') {
        return (
            <div className="grid grid-cols-1 gap-4">
                {programs.map((program) => (
                    <Card key={program.id} className="overflow-hidden">
                        <CardContent className="p-4">
                            <div className="space-y-2">
                                <div className="font-medium text-lg">{program.name}</div>
                                <div className="text-sm text-muted-foreground">{program.description}</div>
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {program.code && (
                                        <div className="text-xs bg-muted px-2 py-1 rounded-md">
                                            Code: {program.code}
                                        </div>
                                    )}
                                    <Badge variant={program.active ? "default" : "secondary"}>
                                        {program.active ? "Active" : "Inactive"}
                                    </Badge>
                                </div>
                                <div className="flex justify-between items-center pt-3">
                                    <div className="text-xs text-muted-foreground">
                                        {program.xata?.createdAt
                                            ? formatDate(program.xata.createdAt)
                                            : program.createdAt
                                                ? formatDate(program.createdAt)
                                                : 'N/A'}
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleViewProgram(program.id)}
                                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200 hover:border-blue-300 dark:text-blue-400 dark:hover:text-blue-300 dark:border-blue-950 dark:hover:border-blue-900 dark:hover:bg-blue-950/30 gap-1 font-medium"
                                    >
                                        <svg
                                            width="15"
                                            height="15"
                                            viewBox="0 0 15 15"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4"
                                        >
                                            <path
                                                d="M7.5 11.25C9.57107 11.25 11.25 9.57107 11.25 7.5C11.25 5.42893 9.57107 3.75 7.5 3.75C5.42893 3.75 3.75 5.42893 3.75 7.5C3.75 9.57107 5.42893 11.25 7.5 11.25Z"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="M7.5 9.375C8.53553 9.375 9.375 8.53553 9.375 7.5C9.375 6.46447 8.53553 5.625 7.5 5.625C6.46447 5.625 5.625 6.46447 5.625 7.5C5.625 8.53553 6.46447 9.375 7.5 9.375Z"
                                                fill="currentColor"
                                            />
                                        </svg>
                                        View
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    return (
        <div className="rounded-md border overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead className="hidden sm:table-cell">Code</TableHead>
                        <TableHead className="hidden sm:table-cell">Status</TableHead>
                        <TableHead className="hidden md:table-cell">Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {programs.map((program) => (
                        <TableRow key={program.id}>
                            <TableCell>
                                <div className="font-medium">{program.name}</div>
                                <div className="text-sm text-muted-foreground line-clamp-1">{program.description}</div>
                                <div className="text-xs text-muted-foreground sm:hidden flex flex-wrap gap-1 mt-1">
                                    {program.code && <span className="inline-block">Code: {program.code}</span>}
                                    {<Badge variant={program.active ? "default" : "secondary"} className="ml-1">
                                        {program.active ? "Active" : "Inactive"}
                                    </Badge>}
                                </div>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">{program.code}</TableCell>
                            <TableCell className="hidden sm:table-cell">
                                <Badge variant={program.active ? "default" : "secondary"}>
                                    {program.active ? "Active" : "Inactive"}
                                </Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                                {program.xata?.createdAt
                                    ? formatDate(program.xata.createdAt)
                                    : program.createdAt
                                        ? formatDate(program.createdAt)
                                        : 'N/A'}
                            </TableCell>
                            <TableCell className="text-right">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleViewProgram(program.id)}
                                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200 hover:border-blue-300 dark:text-blue-400 dark:hover:text-blue-300 dark:border-blue-950 dark:hover:border-blue-900 dark:hover:bg-blue-950/30 gap-1 font-medium"
                                >
                                    <svg
                                        width="15"
                                        height="15"
                                        viewBox="0 0 15 15"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4"
                                    >
                                        <path
                                            d="M7.5 11.25C9.57107 11.25 11.25 9.57107 11.25 7.5C11.25 5.42893 9.57107 3.75 7.5 3.75C5.42893 3.75 3.75 5.42893 3.75 7.5C3.75 9.57107 5.42893 11.25 7.5 11.25Z"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M7.5 9.375C8.53553 9.375 9.375 8.53553 9.375 7.5C9.375 6.46447 8.53553 5.625 7.5 5.625C6.46447 5.625 5.625 6.46447 5.625 7.5C5.625 8.53553 6.46447 9.375 7.5 9.375Z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                    View
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}