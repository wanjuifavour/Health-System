'use server';

import { programsRepository, enrollmentsRepository, xataClient } from "@/lib/repositories";
import { authOptions } from "@/auth"
import { getServerSession } from "next-auth/next"

export type DashboardStats = {
    totalClients: number;
    activePrograms: number;
    newEnrollments: number;
    monthlyVisits: number;
};

export type MonthlyRegistration = {
    name: string;
    total: number;
};

export type ProgramDistribution = {
    name: string;
    value: number;
    color: string;
};

export type RecentClient = {
    id: string;
    name: string;
    email: string | null;
    programs: { name: string; id: string }[];
    status: string;
    lastUpdated: string;
};

const PROGRAM_COLORS = [
    "#0ea5e9", // Blue
    "#22c55e", // Green
    "#f59e0b", // Amber
    "#8b5cf6", // Purple
    "#ec4899", // Pink
    "#f43f5e", // Rose
    "#06b6d4", // Cyan
    "#14b8a6", // Teal
];

export async function getDashboardStats(): Promise<DashboardStats> {
    const session = await getServerSession(authOptions)

    if (!session) {
        throw new Error("Unauthorized");
    }

    try {
        // Get total clients count
        const clients = await xataClient.db.Client.getAll();
        const totalClients = clients.length;

        // Get active programs count
        const activePrograms = await xataClient.db.HealthProgram.filter({ active: true }).getAll();
        const totalActivePrograms = activePrograms.length;

        // Get new enrollments in the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentEnrollments = await xataClient.db.ProgramEnrollment
            .filter({ enrollmentDate: { $gt: thirtyDaysAgo } })
            .getAll();
        const totalNewEnrollments = recentEnrollments.length;

        const monthlyVisits = 325; // Placeholder

        return {
            totalClients,
            activePrograms: totalActivePrograms,
            newEnrollments: totalNewEnrollments,
            monthlyVisits
        };
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        // Return default values if there's an error
        return {
            totalClients: 0,
            activePrograms: 0,
            newEnrollments: 0,
            monthlyVisits: 0
        };
    }
}

export async function getMonthlyRegistrations(): Promise<MonthlyRegistration[]> {
    const session = await getServerSession(authOptions);

    if (!session) {
        throw new Error("Unauthorized");
    }

    try {
        // Get current date info
        const now = new Date();
        const currentYear = now.getFullYear();

        // Define months
        const months = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        const monthlyData: MonthlyRegistration[] = [];
        const allClients = await xataClient.db.Client.getAll();

        // For each of the last 6 months
        for (let i = 5; i >= 0; i--) {
            const month = (now.getMonth() - i + 12) % 12; // Handle wrapping around to previous year
            const year = currentYear - (now.getMonth() < i ? 1 : 0);

            // Start and end dates for the month
            const startDate = new Date(year, month, 1);
            const endDate = new Date(year, month + 1, 0);

            // Count clients created in this month
            const clientsInMonth = allClients.filter(client => {
                const createdAt = new Date(client.xata.createdAt);
                return createdAt >= startDate && createdAt <= endDate;
            });

            monthlyData.push({
                name: months[month],
                total: clientsInMonth.length
            });
        }

        return monthlyData;
    } catch (error) {
        console.error("Error fetching monthly registrations:", error);
        // Return empty array if there's an error
        return [];
    }
}

export async function getProgramDistribution(): Promise<ProgramDistribution[]> {
    const session = await getServerSession(authOptions);

    if (!session) {
        throw new Error("Unauthorized");
    }

    try {
        // Get all active programs
        const programs = await programsRepository.getActivePrograms();
        const allEnrollments = await xataClient.db.ProgramEnrollment.getAll();

        const distribution: ProgramDistribution[] = [];

        // For each program, count enrollments
        for (let i = 0; i < programs.length; i++) {
            const program = programs[i];

            const programEnrollments = allEnrollments.filter(enrollment =>
                enrollment.programId?.id === program.id &&
                enrollment.status === "active"
            );

            distribution.push({
                name: program.name,
                value: programEnrollments.length,
                color: PROGRAM_COLORS[i % PROGRAM_COLORS.length]
            });
        }

        return distribution;
    } catch (error) {
        console.error("Error fetching program distribution:", error);
        // Return empty array if there's an error
        return [];
    }
}

export async function getRecentClients(limit = 5): Promise<RecentClient[]> {
    const session = await getServerSession(authOptions);

    if (!session) {
        throw new Error("Unauthorized");
    }

    try {
        // Get recent clients
        const recentClientsData = await xataClient.db.Client
            .sort("xata.updatedAt", "desc")
            .getPaginated({
                pagination: {
                    size: limit
                }
            });

        const recentClients: RecentClient[] = [];

        // For each client, get their enrollments
        for (const client of recentClientsData.records) {
            const enrollments = await enrollmentsRepository.getClientEnrollments(client.id);

            // Extract program info
            const programs = enrollments.map(enrollment => {
                const programId = enrollment.programId && typeof enrollment.programId === 'object' ? enrollment.programId.id : '';
                const programName = enrollment.programId && typeof enrollment.programId === 'object' ? (enrollment.programId.name || '') : '';
                return { id: programId, name: programName };
            }).filter(p => p.name); // Filter out any with empty names

            recentClients.push({
                id: client.id,
                name: `${client.firstName} ${client.lastName}`,
                email: client.email || null,
                programs,
                status: "Active", // Assuming all clients are active
                lastUpdated: client.xata.updatedAt.toISOString()
            });
        }

        return recentClients;
    } catch (error) {
        console.error("Error fetching recent clients:", error);
        // Return empty array if there's an error
        return [];
    }
} 