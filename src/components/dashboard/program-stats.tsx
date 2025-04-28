"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts"
import type { ProgramDistribution } from "@/app/actions/dashboard/dashboardActions"

interface ProgramStatsProps {
    data: ProgramDistribution[];
}

export function ProgramStats({ data }: ProgramStatsProps) {
    // Show a message if there's no data
    if (!data || data.length === 0) {
        return <div className="flex h-full w-full items-center justify-center text-muted-foreground">No data available</div>
    }

    return (
        <ResponsiveContainer width="100%" height={350}>
            <PieChart>
                <Pie data={data} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value">
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    )
}