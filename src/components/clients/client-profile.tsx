import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, IdCardIcon, MailIcon, PhoneIcon, HomeIcon, Users } from "lucide-react"

interface ClientProfileProps {
    client: any
}

function formatDate(dateString: string | Date): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
}

export function ClientProfile({ client }: ClientProfileProps) {
    return (
        <Card className="overflow-hidden border-blue-100 dark:border-blue-950/50 shadow-sm hover:shadow transition-shadow">
            <CardHeader className="pb-4 bg-gradient-to-r from-blue-50/70 to-white dark:from-blue-950/20 dark:to-transparent">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <Avatar className="h-16 w-16 sm:h-20 sm:w-20 border-2 border-blue-100 dark:border-blue-800 shadow-sm">
                        <AvatarFallback className="text-lg bg-gradient-to-br from-blue-600 to-blue-800 text-white font-semibold">
                            {client.firstName.charAt(0)}
                            {client.lastName.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="text-xl sm:text-2xl font-bold text-blue-950 dark:text-blue-100">
                            {client.firstName} {client.lastName}
                        </CardTitle>
                        <div className="flex flex-wrap gap-2 mt-2">
                            <Badge variant="outline" className="capitalize font-medium px-2 py-0.5 bg-white dark:bg-blue-950/30">
                                {client.gender.charAt(0).toUpperCase() + client.gender.slice(1)}
                            </Badge>
                            {client.nationalId && (
                                <Badge variant="outline" className="px-2 py-0.5 bg-white dark:bg-blue-950/30">
                                    ID: {client.nationalId}
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
                <section className="space-y-3">
                    <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                        <Users className="h-4 w-4" />
                        Personal Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-950/20 p-3 rounded-md">
                        <div className="space-y-1">
                            <div className="text-sm font-medium flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                                <CalendarIcon className="h-3.5 w-3.5" />
                                Date of Birth
                            </div>
                            <div className="font-medium">{formatDate(client.dateOfBirth)}</div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-sm font-medium flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                                <IdCardIcon className="h-3.5 w-3.5" />
                                National ID
                            </div>
                            <div className="font-medium">{client.nationalId || "Not provided"}</div>
                        </div>
                    </div>
                </section>

                <section className="space-y-3">
                    <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                        <MailIcon className="h-4 w-4" />
                        Contact Information
                    </h3>
                    <div className="bg-gray-50 dark:bg-gray-950/20 p-3 rounded-md space-y-3">
                        <div className="space-y-1">
                            <div className="text-sm font-medium flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                                <PhoneIcon className="h-3.5 w-3.5" />
                                Phone
                            </div>
                            <div className="font-medium">{client.phone || "Not provided"}</div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-sm font-medium flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                                <MailIcon className="h-3.5 w-3.5" />
                                Email
                            </div>
                            <div className="font-medium">{client.email || "Not provided"}</div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-sm font-medium flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                                <HomeIcon className="h-3.5 w-3.5" />
                                Address
                            </div>
                            <div className="font-medium">{client.address || "Not provided"}</div>
                        </div>
                    </div>
                </section>

                {client.emergencyContactName && (
                    <section className="space-y-3">
                        <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                            <PhoneIcon className="h-4 w-4" />
                            Emergency Contact
                        </h3>
                        <div className="bg-gray-50 dark:bg-gray-950/20 p-3 rounded-md space-y-3">
                            <div className="space-y-1">
                                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</div>
                                <div className="font-medium">{client.emergencyContactName}</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Relationship</div>
                                <div className="font-medium">{client.emergencyContactRelationship || "Not specified"}</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</div>
                                <div className="font-medium">{client.emergencyContactPhone || "Not provided"}</div>
                            </div>
                        </div>
                    </section>
                )}

                <section className="space-y-3">
                    <h3 className="text-sm font-medium text-muted-foreground flex items-center">System Information</h3>
                    <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-950/20 p-3 rounded-md">
                        <div className="space-y-1">
                            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Client ID</div>
                            <div className="text-xs font-mono bg-gray-100 dark:bg-gray-800 p-1 rounded overflow-hidden overflow-ellipsis">{client.id}</div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Registered On</div>
                            <div className="font-medium">{client.xata ? formatDate(client.xata.createdAt) : "Unknown"}</div>
                        </div>
                    </div>
                </section>
            </CardContent>
        </Card>
    )
}