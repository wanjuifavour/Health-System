import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/auth';
import { programsRepository } from '@/lib/repositories';
import { validateApiKey } from '@/lib/api-keys';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Await params before accessing them
        const resolvedParams = await params
        
        const apiKey = request.headers.get('x-api-key');
        const session = await getServerSession(authOptions);

        if (!apiKey && !session) {
            return NextResponse.json(
                { error: 'Unauthorized', message: 'API key or authentication required' },
                { status: 401 }
            );
        }

        if (apiKey) {
            const isValidKey = await validateApiKey(apiKey);
            if (!isValidKey) {
                return NextResponse.json(
                    { error: 'Unauthorized', message: 'Invalid API key' },
                    { status: 401 }
                );
            }
        }

        const programId = resolvedParams.id;
        const program = await programsRepository.getProgramById(programId);

        if (!program) {
            return NextResponse.json(
                { error: 'Not Found', message: 'Program not found' },
                { status: 404 }
            );
        }

        const responseData = {
            id: program.id,
            name: program.name,
            code: program.code,
            description: program.description,
            active: program.active,
            requiredFields: program.requiredFields,
            createdAt: program.xata?.createdAt,
            updatedAt: program.xata?.updatedAt,
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