import Link from "next/link"
import { Activity } from "lucide-react"

export function SiteFooter() {
    return (
        <footer className="border-t py-6 md:py-0 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
                <div className="flex items-center gap-2">
                    <div className="bg-gradient-blue text-white p-1 rounded-md">
                        <Activity className="h-4 w-4" />
                    </div>
                    <p className="text-sm leading-loose text-center md:text-left">
                        &copy; {new Date().getFullYear()} <span className="font-semibold">HealthIS</span>. All rights reserved.
                    </p>
                </div>
                <div className="flex items-center gap-6 text-sm">
                    <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                        Privacy
                    </Link>
                    <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                        Terms
                    </Link>
                    <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                        Contact
                    </Link>
                </div>
            </div>
        </footer>
    )
}