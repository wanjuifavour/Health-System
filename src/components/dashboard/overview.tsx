"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const data = [
    {
        name: "Jan",
        total: 45,
    },
    {
        name: "Feb",
        total: 62,
    },
    {
        name: "Mar",
        total: 78,
    },
    {
        name: "Apr",
        total: 56,
    },
    {
        name: "May",
        total: 69,
    },
    {
        name: "Jun",
        total: 85,
    },
]

export function Overview() {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <Tooltip />
                <Bar dataKey="total" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    )
}