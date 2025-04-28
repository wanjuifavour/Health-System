import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/auth';
import { clientsRepository } from '@/lib/repositories';
import { validateApiKey } from '@/lib/api-keys';

// GET /api/clients
export async function GET(request: NextRequest) {
    try {
        // Check API key or authentication
        const apiKey = request.headers.get('x-api-key');
        const session = await getServerSession(authOptions);

        // Validate either API key or session
        if (!apiKey && !session) {
            return NextResponse.json(
                { error: 'Unauthorized', message: 'API key or authentication required' },
                { status: 401 }
            );
        }

        // If API key is provided, validate it
        if (apiKey) {
            const isValidKey = await validateApiKey(apiKey);
            if (!isValidKey) {
                return NextResponse.json(
                    { error: 'Unauthorized', message: 'Invalid API key' },
                    { status: 401 }
                );
            }
        }

        // Get query parameters
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1', 10);
        const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);
        const search = searchParams.get('search') || undefined;

        // Fetch clients with pagination
        let result;

        if (search) {
            result = await clientsRepository.searchClients(search, page, pageSize);
        } else {
            result = await clientsRepository.getClients(page, pageSize);
        }

        // Format the response
        const clients = result.records.map(client => ({
            id: client.id,
            firstName: client.firstName,
            lastName: client.lastName,
            dateOfBirth: client.dateOfBirth,
            gender: client.gender,
            nationalId: client.nationalId || null,
            phone: client.phone || null,
            email: client.email || null
        }));

        return NextResponse.json({
            clients,
            pagination: {
                page,
                pageSize,
                hasNextPage: clients.length === pageSize,
                totalRecords: clients.length,
            }
        });
    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', message: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
} 