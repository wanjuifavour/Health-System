"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export function ClientSearch() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "")

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()

        const params = new URLSearchParams(searchParams)
        if (searchQuery) {
            params.set("search", searchQuery)
        } else {
            params.delete("search")
        }

        router.push(`/clients?${params.toString()}`)
    }

    return (
        <form onSubmit={handleSearch} className="flex w-full items-center space-x-2 flex-wrap gap-2 sm:flex-nowrap">
            <div className="relative flex-1 w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search by name, ID, or contact info..."
                    className="pl-8 w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <Button type="submit" className="w-full sm:w-auto">Search</Button>
        </form>
    )
}