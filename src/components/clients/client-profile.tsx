import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface ClientProfileProps {
    client: any
}

function formatDate(dateString: string | Date): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
}

export function ClientProfile({ client }: ClientProfileProps) {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                        <AvatarFallback className="text-lg">
                            {client.firstName.charAt(0)}
                            {client.lastName.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle>
                            {client.firstName} {client.lastName}
                        </CardTitle>
                        <CardDescription>
                            <Badge variant="outline" className="mt-1">
                                {client.gender.charAt(0).toUpperCase() + client.gender.slice(1)}
                            </Badge>
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Personal Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="text-sm font-medium">Date of Birth</div>
                            <div>{formatDate(client.dateOfBirth)}</div>
                        </div>
                        <div>
                            <div className="text-sm font-medium">National ID</div>
                            <div>{client.nationalId || "Not provided"}</div>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Contact Information</h3>
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <div className="text-sm font-medium">Phone</div>
                            <div>{client.phone || "Not provided"}</div>
                        </div>
                        <div>
                            <div className="text-sm font-medium">Email</div>
                            <div>{client.email || "Not provided"}</div>
                        </div>
                        <div>
                            <div className="text-sm font-medium">Address</div>
                            <div>{client.address || "Not provided"}</div>
                        </div>
                    </div>
                </div>

                {client.emergencyContactName && (
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium text-muted-foreground">Emergency Contact</h3>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <div className="text-sm font-medium">Name</div>
                                <div>{client.emergencyContactName}</div>
                            </div>
                            <div>
                                <div className="text-sm font-medium">Relationship</div>
                                <div>{client.emergencyContactRelationship || "Not specified"}</div>
                            </div>
                            <div>
                                <div className="text-sm font-medium">Phone</div>
                                <div>{client.emergencyContactPhone || "Not provided"}</div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">System Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="text-sm font-medium">Client ID</div>
                            <div className="text-xs">{client.id}</div>
                        </div>
                        <div>
                            <div className="text-sm font-medium">Registered On</div>
                            <div>{client.xata ? formatDate(client.xata.createdAt) : "Unknown"}</div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}