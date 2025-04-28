import crypto from 'crypto';
import { getXataClient } from './xata';

const API_MASTER_KEY = process.env.API_KEY || 'dev-master-api-key-for-testing';

export async function generateApiKey(owner: string, expiresInDays?: number): Promise<string> {
    const xata = getXataClient();
    const apiKey = `his_${crypto.randomBytes(24).toString('hex')}`;

    await xata.db.ApiKey.create({
        key: apiKey,
        owner,
        expiresAt: expiresInDays ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000) : null,
        isRevoked: false
    });

    return apiKey;
}

export async function validateApiKey(apiKey: string): Promise<boolean> {
    if (apiKey === API_MASTER_KEY) {
        return true;
    }

    try {
        const xata = getXataClient();

        const keyRecord = await xata.db.ApiKey.filter({
            key: apiKey,
            isRevoked: false
        }).getFirst();

        if (!keyRecord) {
            return false;
        }

        if (keyRecord.expiresAt && new Date(keyRecord.expiresAt) < new Date()) {
            return false;
        }

        await xata.db.ApiKey.update(keyRecord.id, {
            lastUsed: new Date()
        });

        return true;
    } catch (error) {
        console.error('Error validating API key:', error);
        return false;
    }
}

export async function revokeApiKey(apiKey: string): Promise<boolean> {
    try {
        const xata = getXataClient();

        const keyRecord = await xata.db.ApiKey.filter({
            key: apiKey,
            isRevoked: false
        }).getFirst();

        if (!keyRecord) {
            return false;
        }

        await xata.db.ApiKey.update(keyRecord.id, {
            isRevoked: true
        });

        return true;
    } catch (error) {
        console.error('Error revoking API key:', error);
        return false;
    }
}

export async function listApiKeys(): Promise<Array<{
    id: string;
    key: string;
    owner: string;
    createdAt: Date;
    lastUsed?: Date;
    expiresAt?: Date;
    isRevoked: boolean;
}>> {
    try {
        const xata = getXataClient();

        const keys = await xata.db.ApiKey.filter({
            isRevoked: false
        }).getAll();

        return keys.map(key => ({
            id: key.id,
            key: key.key,
            owner: key.owner || "",
            createdAt: key.xata.createdAt,
            lastUsed: key.lastUsed || undefined,
            expiresAt: key.expiresAt || undefined,
            isRevoked: key.isRevoked || false
        }));
    } catch (error) {
        console.error('Error listing API keys:', error);
        return [];
    }
}

export async function getApiKeyInfo(apiKey: string) {
    try {
        const xata = getXataClient();

        return await xata.db.ApiKey.filter({
            key: apiKey
        }).getFirst();
    } catch (error) {
        console.error('Error getting API key info:', error);
        return null;
    }
} 