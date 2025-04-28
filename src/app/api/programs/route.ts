import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/auth';
import { programsRepository } from '@/lib/repositories';
import { validateApiKey } from '@/lib/api-keys';

export async function GET(request: NextRequest) {
    try {
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

        const programs = await programsRepository.getActivePrograms();

        const formattedPrograms = programs.map((program: any) => ({
            id: program.id,
            name: program.name || "",
            code: program.code || "",
            description: program.description || "",
            active: program.active || false,
            requiredFields: program.requiredFields || [],
            createdAt: program.xata?.createdAt,
            updatedAt: program.xata?.updatedAt,
        }));

        return NextResponse.json({ programs: formattedPrograms });
    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', message: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
} 