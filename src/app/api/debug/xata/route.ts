import { NextResponse } from 'next/server'
import { getXataClient } from '@/lib/xata'

export async function GET() {
    const xata = getXataClient()

    try {
        // Get client count
        const clients = await xata.db.Client.getAll()
        const clientCount = clients.length

        // Get first client
        const firstClient = await xata.db.Client.getFirst()

        // Try to get client with pagination (to test the fix)
        const paginatedResult = await xata.db.Client.sort("xata.createdAt", "desc").getPaginated({
            pagination: { size: 10, offset: 0 }
        })

        return NextResponse.json({
            status: 'success',
            message: 'Xata database connection successful',
            clientCount,
            firstClient: firstClient ? {
                id: firstClient.id,
                firstName: firstClient.firstName,
                lastName: firstClient.lastName,
                metadata: firstClient.xata
            } : null,
            paginatedClients: {
                count: paginatedResult.records.length,
                sample: paginatedResult.records.slice(0, 1).map(c => ({
                    id: c.id,
                    name: `${c.firstName} ${c.lastName}`
                }))
            }
        })
    } catch (error) {
        console.error('Error connecting to Xata:', error)

        return NextResponse.json({
            status: 'error',
            message: 'Error connecting to Xata database',
            error: error instanceof Error ? error.message : String(error)
        }, { status: 500 })
    }
} 