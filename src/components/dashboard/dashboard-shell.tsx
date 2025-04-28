import type React from "react"
import { cn } from "@/lib/utils"

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface DashboardShellProps extends React.HTMLAttributes<HTMLDivElement> { }

export function DashboardShell({ children, className, ...props }: DashboardShellProps) {
    return (
        <div className={cn("grid items-start gap-4 sm:gap-8 px-2 sm:px-4 py-4 max-w-[1600px] mx-auto w-full", className)} {...props}>
            {children}
        </div>
    )
}