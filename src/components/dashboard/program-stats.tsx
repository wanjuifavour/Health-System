"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts"

const data = [
    { name: "TB", value: 540, color: "#0ea5e9" },
    { name: "Malaria", value: 620, color: "#22c55e" },
    { name: "HIV", value: 210, color: "#f59e0b" },
    { name: "Diabetes", value: 180, color: "#8b5cf6" },
    { name: "Hypertension", value: 310, color: "#ec4899" },
]

export function ProgramStats() {
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