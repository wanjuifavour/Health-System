import { getXataClient } from "./xata"
import type { UserRecord, ClientRecord, HealthProgramRecord, ProgramEnrollmentRecord } from "./xata"

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

export const clientsRepository = {

    async getClients(page = 1, pageSize = 10) {
        try {
            const offset = (page - 1) * pageSize
            const result = await xata.db.Client.sort("xata.createdAt", "desc").getPaginated({
                pagination: {
                    size: pageSize,
                    offset,
                },
            })

            // Ensure we're returning plain objects by serializing them
            const serializedResult = {
                ...result,
                records: result.records.map(record => {
                    return {
                        ...record,
                        xata: {
                            createdAt: record.xata.createdAt.toISOString(),
                            updatedAt: record.xata.updatedAt.toISOString(),
                            version: record.xata.version
                        }
                    };
                })
            };

            // console.log("Repository getClients result:", JSON.stringify(serializedResult))
            return serializedResult
        } catch (error) {
            console.error("Repository error in getClients:", error)
            throw error
        }
    },

    async searchClients(query: string, page = 1, pageSize = 10) {
        try {
            const offset = (page - 1) * pageSize

            // If query is all digits, try direct matches for phone numbers or national ID
            if (/^\d+$/.test(query.trim())) {
                // Try both phone and nationalId fields
                const directMatches = await xata.db.Client.filter({
                    $any: [
                        { phone: query.trim() },
                        { nationalId: query.trim() }
                    ]
                }).getPaginated({
                    pagination: {
                        size: pageSize,
                        offset,
                    },
                });

                if (directMatches.records.length > 0) {
                    console.log("Found direct matches:", directMatches.records.length);

                    // Ensure we're returning plain objects
                    const serializedResult = {
                        ...directMatches,
                        records: directMatches.records.map(record => {
                            return {
                                ...record,
                                xata: {
                                    createdAt: record.xata.createdAt.toISOString(),
                                    updatedAt: record.xata.updatedAt.toISOString(),
                                    version: record.xata.version
                                }
                            };
                        })
                    };

                    return serializedResult;
                }
            }

            // For name searches, we might want to split and search first/last name separately
            const parts = query.trim().split(/\s+/);
            if (parts.length > 1) {
                // Try to match firstName and lastName separately
                const nameMatches = await xata.db.Client.filter({
                    $any: [
                        // Try both combinations (first last) or (last first)
                        {
                            $all: [
                                { firstName: { $contains: parts[0] } },
                                { lastName: { $contains: parts[1] } }
                            ]
                        },
                        {
                            $all: [
                                { firstName: { $contains: parts[1] } },
                                { lastName: { $contains: parts[0] } }
                            ]
                        }
                    ]
                }).getPaginated({
                    pagination: {
                        size: pageSize,
                        offset,
                    },
                });

                if (nameMatches.records.length > 0) {
                    console.log("Found name matches:", nameMatches.records.length);

                    // Ensure we're returning plain objects
                    const serializedResult = {
                        ...nameMatches,
                        records: nameMatches.records.map(record => {
                            return {
                                ...record,
                                xata: {
                                    createdAt: record.xata.createdAt.toISOString(),
                                    updatedAt: record.xata.updatedAt.toISOString(),
                                    version: record.xata.version
                                }
                            };
                        })
                    };

                    return serializedResult;
                }
            }

            // Fall back to a contains search on multiple fields
            const containsMatches = await xata.db.Client.filter({
                $any: [
                    { firstName: { $contains: query } },
                    { lastName: { $contains: query } },
                    { nationalId: { $contains: query } },
                    { phone: { $contains: query } },
                    { email: { $contains: query } },
                    { address: { $contains: query } }
                ]
            }).getPaginated({
                pagination: {
                    size: pageSize,
                    offset,
                },
            });

            if (containsMatches.records.length > 0) {
                console.log("Found contains matches:", containsMatches.records.length);

                // Ensure we're returning plain objects
                const serializedResult = {
                    ...containsMatches,
                    records: containsMatches.records.map(record => {
                        return {
                            ...record,
                            xata: {
                                createdAt: record.xata.createdAt.toISOString(),
                                updatedAt: record.xata.updatedAt.toISOString(),
                                version: record.xata.version
                            }
                        };
                    })
                };

                return serializedResult;
            }

            // Last resort: Try the built-in search function with lower fuzziness
            console.log("Trying fuzzy search as last resort");
            const result = await xata.db.Client.search(query, {
                fuzziness: 1,
                prefix: "phrase",
                target: ["firstName", "lastName", "nationalId", "phone", "email", "address"],
                page: {
                    size: pageSize,
                    offset,
                },
            });

            console.log("Repository searchClients result:", JSON.stringify(result));

            // Apply the same transformation to any other results before returning
            const serializedResult = {
                ...result,
                records: result.records.map(record => {
                    return {
                        ...record,
                        xata: {
                            createdAt: record.xata.createdAt.toISOString(),
                            updatedAt: record.xata.updatedAt.toISOString(),
                            version: record.xata.version
                        }
                    };
                })
            };

            return serializedResult;
        } catch (error) {
            console.error("Repository error in searchClients:", error);
            throw error;
        }
    },

    async getClientById(id: string): Promise<ClientRecord | null> {
        return xata.db.Client.read(id) as Promise<ClientRecord | null>
    },

    async createClient(client: Partial<ClientRecord>): Promise<ClientRecord> {
        return xata.db.Client.create(client) as Promise<ClientRecord>
    },

    async updateClient(id: string, clientData: Partial<ClientRecord>): Promise<ClientRecord | null> {
        return xata.db.Client.update(id, clientData) as Promise<ClientRecord | null>
    },

    async deleteClient(id: string): Promise<void> {
        await xata.db.Client.delete(id)
    }
}

export const programsRepository = {
    async getActivePrograms(): Promise<HealthProgramRecord[]> {
        return xata.db.HealthProgram.filter({ active: true }).getAll()
    },

    async getProgramById(id: string): Promise<HealthProgramRecord | null> {
        return xata.db.HealthProgram.read(id)
    },

    async createProgram(program: Partial<HealthProgramRecord>): Promise<HealthProgramRecord> {
        return xata.db.HealthProgram.create(program)
    },

    async updateProgram(id: string, program: Partial<HealthProgramRecord>): Promise<HealthProgramRecord | null> {
        return xata.db.HealthProgram.update(id, program)
    },
}

export const enrollmentsRepository = {
    async getClientEnrollments(clientId: string): Promise<ProgramEnrollmentRecord[]> {
        const enrollments = await xata.db.ProgramEnrollment.filter({
            "clientId.id": clientId
        })
            .select(["*", "programId.*"])
            .getAll();

        // Convert Date objects to strings for serialization
        return enrollments.map(enrollment => ({
            ...enrollment,
            enrollmentDate: enrollment.enrollmentDate ? enrollment.enrollmentDate.toISOString() : undefined,
            xata: {
                createdAt: enrollment.xata.createdAt.toISOString(),
                updatedAt: enrollment.xata.updatedAt.toISOString(),
                version: enrollment.xata.version
            }
        })) as unknown as ProgramEnrollmentRecord[];
    },

    async getProgramEnrollments(programId: string, page = 1, pageSize = 10) {
        const offset = (page - 1) * pageSize;
        const result = await xata.db.ProgramEnrollment.filter({
            "programId.id": programId
        })
            .select(["*", "clientId.*"])
            .getPaginated({
                pagination: {
                    size: pageSize,
                    offset,
                },
            });

        // Convert Date objects to strings for serialization
        const serializedResult = {
            ...result,
            records: result.records.map(record => ({
                ...record,
                enrollmentDate: record.enrollmentDate ? record.enrollmentDate.toISOString() : undefined,
                xata: {
                    createdAt: record.xata.createdAt.toISOString(),
                    updatedAt: record.xata.updatedAt.toISOString(),
                    version: record.xata.version
                }
            }))
        };

        return serializedResult;
    },

    async createEnrollment(enrollment: any): Promise<ProgramEnrollmentRecord> {
        const data = {
            ...enrollment,
            clientId: typeof enrollment.clientId === 'string' ? { id: enrollment.clientId } : enrollment.clientId,
            programId: typeof enrollment.programId === 'string' ? { id: enrollment.programId } : enrollment.programId,
            createdBy: typeof enrollment.createdBy === 'string' ? { id: enrollment.createdBy } : enrollment.createdBy
        };

        return xata.db.ProgramEnrollment.create(data) as Promise<ProgramEnrollmentRecord>;
    },

    async updateEnrollment(id: string, enrollmentData: Partial<ProgramEnrollmentRecord>): Promise<ProgramEnrollmentRecord | null> {
        return xata.db.ProgramEnrollment.update(id, enrollmentData) as Promise<ProgramEnrollmentRecord | null>;
    },

    async deleteEnrollment(id: string): Promise<void> {
        await xata.db.ProgramEnrollment.delete(id);
    }
}

export const xataClient = xata