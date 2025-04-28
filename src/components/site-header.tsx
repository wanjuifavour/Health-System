"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ModeToggle } from "@/components/mode-toggle"
import { Activity, LayoutDashboard, Users, FileText, Settings, LogOut, Menu } from "lucide-react"
import { useState } from "react"

export function SiteHeader() {
    const pathname = usePathname()
    const { data: session, status } = useSession()
    const isLoading = status === "loading"
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const isActive = (path: string) => {
        return pathname === path || pathname?.startsWith(`${path}/`)
    }

    const navItems = [
        { path: "/", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
        { path: "/clients", label: "Clients", icon: <Users className="h-4 w-4" /> },
        { path: "/programs", label: "Programs", icon: <FileText className="h-4 w-4" /> },
    ]

    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
            <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-6 md:gap-10">
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-1.5 rounded-md shadow-sm">
                            <Activity className="h-5 w-5" />
                        </div>
                        <span className="inline-block font-bold text-xl bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent tracking-tight">HealthIS</span>
                    </Link>

                    {session && (
                        <nav className="hidden md:flex items-center space-x-10 text-sm font-medium">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    className={cn(
                                        "transition-colors hover:text-foreground/80 flex items-center gap-1.5 py-5",
                                        isActive(item.path)
                                            ? "text-foreground font-semibold relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600 after:rounded-full"
                                            : "text-foreground/60 hover:text-foreground hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:right-0 hover:after:h-0.5 hover:after:bg-blue-600/20 hover:after:rounded-full",
                                    )}
                                >
                                    {item.icon && <span className="mr-1.5">{item.icon}</span>}
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    )}
                </div>

                <div className="flex items-center space-x-4">
                    <nav className="flex items-center space-x-3">
                        {session && (
                            <div className="md:hidden">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="relative"
                                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                >
                                    <Menu className="h-5 w-5" />
                                    {isActive("/clients") || isActive("/programs") || isActive("/settings") ? (
                                        <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-blue-600"></span>
                                    ) : null}
                                </Button>
                                {mobileMenuOpen && (
                                    <div className="absolute top-16 left-0 right-0 bg-background border-b shadow-lg animate-fade-in z-50">
                                        <div className="container py-4">
                                            {navItems.map((item) => (
                                                <Link
                                                    key={item.path}
                                                    href={item.path}
                                                    className={cn(
                                                        "flex items-center gap-3 py-3 px-4 hover:bg-muted rounded-md transition-colors",
                                                        isActive(item.path) ? "text-foreground font-semibold bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400" : "text-foreground/70"
                                                    )}
                                                    onClick={() => setMobileMenuOpen(false)}
                                                >
                                                    {item.icon}
                                                    {item.label}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <ModeToggle />

                        {isLoading ? (
                            <Button variant="ghost" size="icon" disabled>
                                <span className="h-8 w-8 rounded-full bg-muted animate-pulse" />
                            </Button>
                        ) : session ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="relative h-9 w-9 rounded-full ring-2 ring-offset-2 ring-offset-background transition-all hover:ring-blue-600 focus:ring-blue-600"
                                    >
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
                                            <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-800 text-primary-foreground">
                                                {session.user?.name?.charAt(0) || "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56 mt-1" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">{session.user?.name}</p>
                                            <p className="text-xs leading-none text-muted-foreground">{session.user?.email}</p>
                                            {session.user?.role && (
                                                <p className="text-xs mt-1.5">
                                                    <span className="bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 px-1.5 py-0.5 rounded-full text-[10px] uppercase font-semibold tracking-wide">
                                                        {session.user.role}
                                                    </span>
                                                </p>
                                            )}
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {navItems.map((item) => (
                                        <DropdownMenuItem key={item.path} asChild className={isActive(item.path) ? "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 font-medium" : ""}>
                                            <Link href={item.path} className="flex items-center cursor-pointer w-full">
                                                <span className="mr-2">{item.icon}</span>
                                                <span>{item.label}</span>
                                            </Link>
                                        </DropdownMenuItem>
                                    ))}
                                    <DropdownMenuItem asChild>
                                        <Link href="/settings" className="flex items-center cursor-pointer">
                                            <Settings className="mr-2 h-4 w-4" />
                                            Settings
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        className="cursor-pointer text-red-500 focus:text-red-500 dark:text-red-400 dark:focus:text-red-400"
                                        onClick={() => signOut({ callbackUrl: "/login" })}
                                    >
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Log out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="flex gap-2">
                                <Button asChild size="sm" variant="ghost" className="hover:bg-gray-100 dark:hover:bg-gray-800 h-9">
                                    <Link href="/login">Login</Link>
                                </Button>
                                <Button
                                    asChild
                                    size="sm"
                                    className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white transition-all shadow-sm hover:shadow h-9"
                                >
                                    <Link href="/register">Register</Link>
                                </Button>
                            </div>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    )
}