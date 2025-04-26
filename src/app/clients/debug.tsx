import { getServerSession } from "next-auth/next"
import { authOptions } from "@/auth"
import { getClients } from "@/app/actions/clients/clientActions"
import { getXataClient } from "@/lib/xata"

export async function DebugClientData() {
    const session = await getServerSession(authOptions)
    const xata = getXataClient()

    // Get client count directly from Xata
    let directClientCount = 0
    let firstClient = null
    try {
        const clients = await xata.db.Client.getAll()
        directClientCount = clients.length
        if (clients.length > 0) {
            // Serialize to avoid passing non-serializable objects
            firstClient = JSON.parse(JSON.stringify(clients[0]))
        }
    } catch (error) {
        console.error("Error getting direct client count:", error)
    }

    // Test the getClients function
    const result = await getClients(1, 10)

    // Serialize the result data
    const resultData = result.success && result.data
        ? JSON.parse(JSON.stringify(result.data))
        : []

    return (
        <div className="p-4 mt-8 border border-red-500 rounded-md">
            <h2 className="text-lg font-bold">Debug Information</h2>
            <div className="mt-2 space-y-2 text-sm">
                <div><strong>User logged in:</strong> {session ? "Yes" : "No"}</div>
                <div><strong>User role:</strong> {session?.user?.role || "N/A"}</div>
                <div><strong>Direct DB client count:</strong> {directClientCount}</div>
                <div><strong>getClients success:</strong> {result.success ? "Yes" : "No"}</div>
                {!result.success && (
                    <>
                        <div><strong>Error:</strong> {result.error}</div>
                        {result.details && <div><strong>Error details:</strong> {result.details}</div>}
                    </>
                )}
                <div><strong>Clients returned:</strong> {resultData.length || 0}</div>
                {firstClient && (
                    <div>
                        <strong>First client from direct DB:</strong>
                        <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-auto">
                            {JSON.stringify(firstClient, null, 2)}
                        </pre>
                    </div>
                )}
                {resultData.length > 0 && (
                    <div>
                        <strong>First client:</strong>
                        <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-auto">
                            {JSON.stringify(resultData[0], null, 2)}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    )
} 