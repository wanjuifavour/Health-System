import { getXataClient } from "./xata"
import type { UserRecord } from "./xata"

const xata = getXataClient()

export const usersRepository = {
    async getUserById(id: string): Promise<UserRecord | null> {
        return xata.db.User.read(id) as Promise<UserRecord | null>
    },

    async getUserByEmail(email: string): Promise<UserRecord | null> {
        const users = await xata.db.User.filter({ email }).getAll()
        return users.length > 0 ? users[0] as UserRecord : null
    },

    async createUser(user: Partial<UserRecord>): Promise<UserRecord> {
        return xata.db.User.create(user) as Promise<UserRecord>
    },

    async updateUser(id: string, userData: Partial<UserRecord>): Promise<UserRecord | null> {
        return xata.db.User.update(id, userData) as Promise<UserRecord | null>
    },
}

export const xataClient = xata