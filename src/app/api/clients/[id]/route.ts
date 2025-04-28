import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/auth';
import { clientsRepository, enrollmentsRepository } from '@/lib/repositories';
import { validateApiKey } from '@/lib/api-keys';

// GET /api/clients/[id]
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Await params before accessing them
        const resolvedParams = await params
        
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

        // Fetch client data
        const clientId = resolvedParams.id;
        const client = await clientsRepository.getClientById(clientId);

        if (!client) {
            return NextResponse.json(
                { error: 'Not Found', message: 'Client not found' },
                { status: 404 }
            );
        }

        // Get client's program enrollments using the enrollmentsRepository
        const enrollments = await enrollmentsRepository.getClientEnrollments(clientId);

        // Format the response
        const responseData = {
            client: {
                id: client.id,
                firstName: client.firstName,
                lastName: client.lastName,
                dateOfBirth: client.dateOfBirth,
                gender: client.gender,
                nationalId: client.nationalId || null,
                phone: client.phone || null,
                email: client.email || null,
                address: client.address || null,
                emergencyContact: {
                    name: client.emergencyContactName || null,
                    relationship: client.emergencyContactRelationship || null,
                    phone: client.emergencyContactPhone || null,
                },
                createdAt: client.xata?.createdAt,
                updatedAt: client.xata?.updatedAt,
            },
            enrollments: enrollments.map((enrollment) => ({
                id: enrollment.id,
                programId: enrollment.programId?.id || "",
                programName: enrollment.programId?.name || "",
                enrollmentDate: enrollment.enrollmentDate,
                status: enrollment.status || "",
                programSpecificData: enrollment.programSpecificData || {},
                notes: enrollment.notes || null,
            })),
        };

        return NextResponse.json(responseData);
    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', message: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}