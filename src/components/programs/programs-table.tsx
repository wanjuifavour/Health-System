"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import type { HealthProgram } from "@/types/program"
import { getPrograms } from "@/app/actions/programs/programActions"

export function ProgramsTable() {
    const router = useRouter()
    const [programs, setPrograms] = useState<HealthProgram[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

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
        return (
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Code</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created</TableHead>
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
                                    <TableCell>
                                        <Skeleton className="h-4 w-16" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-6 w-16" />
                                    </TableCell>
                                    <TableCell>
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

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Code</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {programs.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                No health programs found
                            </TableCell>
                        </TableRow>
                    ) : (
                        programs.map((program) => (
                            <TableRow key={program.id}>
                                <TableCell>
                                    <div className="font-medium">{program.name}</div>
                                    <div className="text-sm text-muted-foreground line-clamp-1">{program.description}</div>
                                </TableCell>
                                <TableCell>{program.code}</TableCell>
                                <TableCell>
                                    <Badge variant={program.active ? "default" : "secondary"}>
                                        {program.active ? "Active" : "Inactive"}
                                    </Badge>
                                </TableCell>
                                <TableCell>{new Date(program.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" onClick={() => handleViewProgram(program.id)}>
                                        View
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}