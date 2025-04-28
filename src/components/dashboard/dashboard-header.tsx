import type React from "react"
import { cn } from "@/lib/utils"

interface DashboardHeaderProps {
    heading: string
    text?: string
    children?: React.ReactNode
    className?: string
}

export function DashboardHeader({ heading, text, children, className }: DashboardHeaderProps) {
    return (
        <div className={cn("flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", className)}>
            <div className="grid gap-1">
                <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">{heading}</h1>
                {text && <p className="text-base sm:text-lg text-muted-foreground">{text}</p>}
            </div>
            {children && <div className="flex justify-start sm:justify-end">{children}</div>}
        </div>
    )
}