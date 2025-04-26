import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/auth"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/dashboard/overview"
import { ProgramStats } from "@/components/dashboard/program-stats"
import { RecentClients } from "@/components/dashboard/recent-clients"
import { Button } from "@/components/ui/button"
import { Activity, Users, FileText, BarChart4, Plus } from "lucide-react"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="w-full max-w-screen-2xl mx-auto px-4 py-8">
      <div className="flex flex-col space-y-8">
        {/* Dashboard Header */}
        <DashboardHeader
          heading="Dashboard"
          text="Welcome to your healthcare information system dashboard."
          className="animate-fade-in"
        >
          <a href="/clients/new">
            <Button className="gap-2 bg-gradient-blue hover:bg-blue-700 transition-all shadow-md hover:shadow-lg">
              <Plus className="h-4 w-4" />
              Register New Client
            </Button>
          </a>
        </DashboardHeader>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover-card-effect border-0 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-blue opacity-10 rounded-xl"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold">1,245</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <span className="text-emerald-500 font-medium">+12%</span> from last month
              </p>
            </CardContent>
          </Card>
          <Card className="hover-card-effect border-0 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-green opacity-10 rounded-xl"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium">Active Programs</CardTitle>
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <FileText className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold">5</div>
              <p className="text-xs text-muted-foreground mt-1">TB, Malaria, HIV, Diabetes, Hypertension</p>
            </CardContent>
          </Card>
          <Card className="hover-card-effect border-0 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-amber opacity-10 rounded-xl"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium">New Enrollments</CardTitle>
              <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                <Activity className="h-5 w-5 text-amber-600" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold">42</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <span className="text-emerald-500 font-medium">+18%</span> from last month
              </p>
            </CardContent>
          </Card>
          <Card className="hover-card-effect border-0 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-purple opacity-10 rounded-xl"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium">Visits This Month</CardTitle>
              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                <BarChart4 className="h-5 w-5 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold">325</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <span className="text-emerald-500 font-medium">+5%</span> from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover-card-effect border border-gray-100 dark:border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Monthly Client Registrations</CardTitle>
              <CardDescription>Number of new clients registered per month</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 min-h-[350px] flex items-center justify-center">
              <Overview />
            </CardContent>
          </Card>
          <Card className="hover-card-effect border border-gray-100 dark:border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Program Distribution</CardTitle>
              <CardDescription>Client distribution across health programs</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 min-h-[350px] flex items-center justify-center">
              <ProgramStats />
            </CardContent>
          </Card>
        </div>

        {/* Recent Clients */}
        <Card className="hover-card-effect border border-gray-100 dark:border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-lg font-semibold">
              <span>Recent Clients</span>
              <Button variant="outline" size="sm" className="text-xs hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                View All
              </Button>
            </CardTitle>
            <CardDescription>Recently registered or updated client records</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <RecentClients />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}