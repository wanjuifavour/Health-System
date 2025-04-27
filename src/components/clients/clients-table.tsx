"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { Skeleton } from "@/components/ui/skeleton"
import { getClients } from "@/app/actions/clients/clientActions"

interface ClientsTableProps {
    initialClients?: any[]
}

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
}

export function ClientsTable({ initialClients = [] }: ClientsTableProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [clients, setClients] = useState<any[]>(initialClients || [])
    const [loading, setLoading] = useState(!initialClients?.length)
    const [error, setError] = useState<string | null>(null)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    const search = searchParams.get("search") || ""
    const pageSize = 10

    useEffect(() => {
        const fetchClients = async () => {
            setLoading(true)
            setError(null)
            try {
                const result = await getClients(page, pageSize, search || undefined)

                if (result.success) {
                    try {
                        const serializedData = JSON.parse(JSON.stringify(result.data || []))
                        setClients(serializedData)
                        setTotalPages(result.meta?.totalPages || 1)
                    } catch (err) {
                        console.error("Error serializing client data:", err)
                        setError("Error processing client data")
                        if (clients.length === 0) {
                            setClients(initialClients || [])
                        }
                    }
                } else {
                    console.error("Error fetching clients:", result.error)
                    setError(result.error || "Failed to load clients")
                    if (clients.length === 0) {
                        setClients(initialClients || [])
                    }
                }
            } catch (error) {
                console.error("Error fetching clients:", error)
                setError("An unexpected error occurred")
                if (clients.length === 0) {
                    setClients(initialClients || [])
                }
            } finally {
                setLoading(false)
            }
        }

        fetchClients()
    }, [page, search, clients.length, initialClients])

    const handleViewClient = (id: string) => {
        router.push(`/clients/${id}`)
    }

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Client</TableHead>
                                <TableHead>Gender</TableHead>
                                <TableHead>Contact</TableHead>
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
                                            <div className="flex items-center gap-2">
                                                <Skeleton className="h-8 w-8 rounded-full" />
                                                <div className="space-y-1">
                                                    <Skeleton className="h-4 w-24" />
                                                    <Skeleton className="h-3 w-16" />
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="h-4 w-16" />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="h-4 w-32" />
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
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Client</TableHead>
                            <TableHead>Gender</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {error ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-red-500">
                                    Error loading clients: {error}
                                </TableCell>
                            </TableRow>
                        ) : clients.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    No clients found
                                </TableCell>
                            </TableRow>
                        ) : (
                            clients.map((client) => (
                                <TableRow key={client.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback>
                                                    {client.firstName.charAt(0)}
                                                    {client.lastName.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div>
                                                    {client.firstName} {client.lastName}
                                                </div>
                                                <div className="text-xs text-muted-foreground">{client.nationalId || "No ID"}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{client.gender}</Badge>
                                    </TableCell>
                                    <TableCell>{client.phone || client.email || "No contact info"}</TableCell>
                                    <TableCell>{client.xata?.createdAt ? formatDate(client.xata.createdAt) : "Unknown"}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" onClick={() => handleViewClient(client.id)}>
                                            View
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {totalPages > 1 && (
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault()
                                    if (page > 1) setPage(page - 1)
                                }}
                                className={page === 1 ? "pointer-events-none opacity-50" : ""}
                            />
                        </PaginationItem>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                            <PaginationItem key={pageNum}>
                                <PaginationLink
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        setPage(pageNum)
                                    }}
                                    isActive={pageNum === page}
                                >
                                    {pageNum}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault()
                                    if (page < totalPages) setPage(page + 1)
                                }}
                                className={page === totalPages ? "pointer-events-none opacity-50" : ""}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    )
}