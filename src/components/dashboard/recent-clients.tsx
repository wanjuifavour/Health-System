"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import type { RecentClient } from "@/app/actions/dashboard/dashboardActions"

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
}

interface RecentClientsProps {
    clients: RecentClient[];
}

export function RecentClients({ clients }: RecentClientsProps) {
    // Show a message if there's no data
    if (!clients || clients.length === 0) {
        return <div className="py-4 text-center text-muted-foreground">No recent clients found</div>
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Programs</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {clients.map((client) => (
                    <TableRow key={client.id}>
                        <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback>{client.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <div>{client.name}</div>
                                    <div className="text-xs text-muted-foreground">{client.email || 'No email'}</div>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="flex gap-1 flex-wrap">
                                {client.programs.length > 0 ? (
                                    client.programs.map((program) => (
                                        <Badge key={program.id} variant="outline">
                                            {program.name}
                                        </Badge>
                                    ))
                                ) : (
                                    <span className="text-xs text-muted-foreground">No programs</span>
                                )}
                            </div>
                        </TableCell>
                        <TableCell>
                            <Badge variant={client.status === "Active" ? "default" : "secondary"}>{client.status}</Badge>
                        </TableCell>
                        <TableCell>{formatDate(client.lastUpdated)}</TableCell>
                        <TableCell className="text-right">
                            <Button
                                variant="outline"
                                size="sm"
                                asChild
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200 hover:border-blue-300 dark:text-blue-400 dark:hover:text-blue-300 dark:border-blue-950 dark:hover:border-blue-900 dark:hover:bg-blue-950/30 gap-1 font-medium"
                            >
                                <Link href={`/clients/${client.id}`} className="flex items-center gap-1">
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
                                </Link>
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}