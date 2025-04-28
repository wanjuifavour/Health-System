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
import { Card, CardContent } from "@/components/ui/card"

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
        return viewMode === 'table' ? (
            <div className="space-y-4">
                <div className="rounded-md border overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Client</TableHead>
                                <TableHead className="hidden sm:table-cell">Gender</TableHead>
                                <TableHead className="hidden md:table-cell">Contact</TableHead>
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
                                            <div className="flex items-center gap-2">
                                                <Skeleton className="h-8 w-8 rounded-full" />
                                                <div className="space-y-1">
                                                    <Skeleton className="h-4 w-24" />
                                                    <Skeleton className="h-3 w-16" />
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell">
                                            <Skeleton className="h-4 w-16" />
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            <Skeleton className="h-4 w-32" />
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
            </div>
        ) : (
            <div className="grid grid-cols-1 gap-4">
                {Array(5)
                    .fill(0)
                    .map((_, index) => (
                        <Card key={index}>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                    <div className="space-y-2 flex-1">
                                        <Skeleton className="h-5 w-32" />
                                        <Skeleton className="h-4 w-full" />
                                        <div className="flex justify-between items-center pt-2">
                                            <Skeleton className="h-6 w-16" />
                                            <Skeleton className="h-8 w-16" />
                                        </div>
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
            <div className="space-y-4">
                <div className="rounded-md border p-8 text-center">
                    <p className="text-red-500">Error loading clients: {error}</p>
                    <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                        Try Again
                    </Button>
                </div>
            </div>
        )
    }

    if (clients.length === 0) {
        return (
            <div className="space-y-4">
                <div className="rounded-md border p-8 text-center">
                    <p className="text-muted-foreground">No clients found</p>
                </div>
            </div>
        )
    }

    if (viewMode === 'cards') {
        return (
            <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                    {clients.map((client) => (
                        <Card key={client.id} className="overflow-hidden">
                            <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                    <Avatar className="h-10 w-10">
                                        <AvatarFallback>
                                            {client.firstName.charAt(0)}
                                            {client.lastName.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="space-y-2 flex-1">
                                        <div className="font-medium">
                                            {client.firstName} {client.lastName}
                                        </div>
                                        {client.nationalId && (
                                            <div className="text-xs text-muted-foreground">ID: {client.nationalId}</div>
                                        )}
                                        <div className="flex flex-wrap gap-2 pt-1">
                                            <Badge variant="outline">{client.gender}</Badge>
                                            <div className="text-xs">
                                                {client.phone || client.email || "No contact info"}
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center pt-2">
                                            <div className="text-xs text-muted-foreground">
                                                {client.xata?.createdAt ? formatDate(client.xata.createdAt) : "Unknown"}
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleViewClient(client.id)}
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
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {totalPages > 1 && (
                    <Pagination>
                        <PaginationContent className="flex flex-wrap justify-center gap-1">
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

    return (
        <div className="space-y-4">
            <div className="rounded-md border overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Client</TableHead>
                            <TableHead className="hidden sm:table-cell">Gender</TableHead>
                            <TableHead className="hidden md:table-cell">Contact</TableHead>
                            <TableHead className="hidden md:table-cell">Created</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {clients.map((client) => (
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
                                            <div className="text-xs text-muted-foreground sm:hidden">
                                                {client.gender && <Badge variant="outline" className="mr-1">{client.gender}</Badge>}
                                                <span className="md:hidden">{client.phone || client.email || ""}</span>
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="hidden sm:table-cell">
                                    <Badge variant="outline">{client.gender}</Badge>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">{client.phone || client.email || "No contact info"}</TableCell>
                                <TableCell className="hidden md:table-cell">{client.xata?.createdAt ? formatDate(client.xata.createdAt) : "Unknown"}</TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleViewClient(client.id)}
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

            {totalPages > 1 && (
                <Pagination>
                    <PaginationContent className="flex flex-wrap justify-center gap-1">
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