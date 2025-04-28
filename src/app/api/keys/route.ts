import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/auth';
import { generateApiKey, listApiKeys, revokeApiKey } from '@/lib/api-keys';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user?.role !== 'Admin') {
            return NextResponse.json(
                { error: 'Forbidden', message: 'Admin access required' },
                { status: 403 }
            );
        }

        const keys = await listApiKeys();

        return NextResponse.json({ keys });
    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', message: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user?.role !== 'Admin') {
            return NextResponse.json(
                { error: 'Forbidden', message: 'Admin access required' },
                { status: 403 }
            );
        }

        const body = await request.json();

        if (!body.owner) {
            return NextResponse.json(
                { error: 'Bad Request', message: 'Owner name is required' },
                { status: 400 }
            );
        }

        const apiKey = await generateApiKey(
            body.owner,
            body.expiresInDays ? parseInt(body.expiresInDays, 10) : undefined
        );

        return NextResponse.json({
            message: 'API key generated successfully',
            apiKey
        });
    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', message: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user?.role !== 'Admin') {
            return NextResponse.json(
                { error: 'Forbidden', message: 'Admin access required' },
                { status: 403 }
            );
        }

        const body = await request.json();

        if (!body.apiKey) {
            return NextResponse.json(
                { error: 'Bad Request', message: 'API key is required' },
                { status: 400 }
            );
        }

        const success = await revokeApiKey(body.apiKey);

        if (!success) {
            return NextResponse.json(
                { error: 'Not Found', message: 'API key not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: 'API key revoked successfully'
        });
    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', message: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
} 