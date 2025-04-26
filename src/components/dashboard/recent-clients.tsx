"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const clients = [
    {
        id: "1",
        name: "John Doe",
        email: "john.doe@example.com",
        programs: ["TB", "Malaria"],
        status: "Active",
        lastUpdated: "2023-04-12T09:00:00",
    },
    {
        id: "2",
        name: "Jane Smith",
        email: "jane.smith@example.com",
        programs: ["HIV"],
        status: "Active",
        lastUpdated: "2023-04-11T14:30:00",
    },
    {
        id: "3",
        name: "Robert Johnson",
        email: "robert.johnson@example.com",
        programs: ["Diabetes", "Hypertension"],
        status: "Inactive",
        lastUpdated: "2023-04-10T11:15:00",
    },
    {
        id: "4",
        name: "Emily Davis",
        email: "emily.davis@example.com",
        programs: ["TB"],
        status: "Active",
        lastUpdated: "2023-04-09T16:45:00",
    },
    {
        id: "5",
        name: "Michael Wilson",
        email: "michael.wilson@example.com",
        programs: ["Malaria"],
        status: "Active",
        lastUpdated: "2023-04-08T10:30:00",
    },
]

export function RecentClients() {
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
                                    <div className="text-xs text-muted-foreground">{client.email}</div>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="flex gap-1 flex-wrap">
                                {client.programs.map((program) => (
                                    <Badge key={program} variant="outline">
                                        {program}
                                    </Badge>
                                ))}
                            </div>
                        </TableCell>
                        <TableCell>
                            <Badge variant={client.status === "Active" ? "default" : "secondary"}>{client.status}</Badge>
                        </TableCell>
                        <TableCell>{new Date(client.lastUpdated).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                                View
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}