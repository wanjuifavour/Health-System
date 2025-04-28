import { Activity, Mail, Github } from "lucide-react"

export function SiteFooter() {
    return (
        <footer className="border-t py-6 px-8 md:py-0 bg-gradient-to-r from-blue-50/40 to-white dark:from-blue-950/20 dark:to-gray-950">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
                <div className="flex items-center gap-2">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-1.5 rounded-md shadow-sm">
                        <Activity className="h-4 w-4" />
                    </div>
                    <p className="text-sm leading-loose text-center md:text-left text-gray-600 dark:text-gray-400">
                        &copy; {new Date().getFullYear()} <span className="font-semibold text-blue-700 dark:text-blue-400">HealthIS</span>. All rights reserved.
                    </p>
                </div>
                <div className="flex items-center gap-6 text-sm">
                    <a
                        href="https://github.com/wanjuifavour"
                        target="_blank"
                        rel="noreferrer"
                        className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5"
                    >
                        <Github className="h-4 w-4" />
                        <span>GitHub</span>
                    </a>
                    <a
                        href="mailto:wanjui.dev@gmail.com"
                        className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5"
                    >
                        <Mail className="h-4 w-4" />
                        <span>Contact</span>
                    </a>
                </div>
            </div>
        </footer>
    )
}