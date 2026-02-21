import { useAthletes, useMeets, useTopTimes } from '@/hooks/useApi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Users,
  Calendar,
  Trophy,
  Plus,
  BarChart3,
} from 'lucide-react'

function StatCard({ icon: IconComponent, label, value, loading, href }) {
  const content = (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        <IconComponent className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-16" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
      </CardContent>
    </Card>
  )

  if (href) {
    return <a href={href}>{content}</a>
  }

  return content
}

function QuickAction({ icon: IconComponent, label, href }) {
  return (
    <a
      href={href}
      className="flex items-center gap-3 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
    >
      <div className="p-2 rounded-lg bg-green-100 text-green-600">
        <IconComponent className="h-5 w-5" />
      </div>
      <span className="font-medium">{label}</span>
    </a>
  )
}

export default function AdminDashboard() {
  const { data: athletes, isLoading: athletesLoading } = useAthletes()
  const { data: meets, isLoading: meetsLoading } = useMeets()
  const { data: topTimes, isLoading: topTimesLoading } = useTopTimes()

  const upcomingMeetsCount = meets?.filter(m => new Date(m.date) >= new Date()).length || 0

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Welcome back, Coach!</h2>
        <p className="text-muted-foreground mt-1">
          Manage your team, schedule meets, and track results.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Users}
          label="Total Athletes"
          value={athletes?.length || 0}
          loading={athletesLoading}
          href="#admin-athletes"
        />
        <StatCard
          icon={Calendar}
          label="Upcoming Meets"
          value={upcomingMeetsCount}
          loading={meetsLoading}
          href="#admin-meets"
        />
        <StatCard
          icon={Calendar}
          label="Total Meets"
          value={meets?.length || 0}
          loading={meetsLoading}
          href="#admin-meets"
        />
        <StatCard
          icon={Trophy}
          label="Results Recorded"
          value={topTimes?.length || 0}
          loading={topTimesLoading}
          href="#admin-results"
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks for managing your team</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <QuickAction
              icon={Plus}
              label="Add Athlete"
              href="#admin-athletes"
            />
            <QuickAction
              icon={Calendar}
              label="Schedule Meet"
              href="#admin-meets"
            />
            <QuickAction
              icon={Trophy}
              label="Enter Results"
              href="#admin-results"
            />
            <QuickAction
              icon={BarChart3}
              label="View Reports"
              href="#admin-reports"
            />
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Athletes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Recent Athletes</CardTitle>
              <CardDescription>Latest additions to the team</CardDescription>
            </div>
            <a
              href="#admin-athletes"
              className="text-sm text-green-600 hover:text-green-700 font-medium"
            >
              View All
            </a>
          </CardHeader>
          <CardContent>
            {athletesLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-32 mb-1" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            ) : athletes?.length === 0 ? (
              <p className="text-muted-foreground text-sm">No athletes yet</p>
            ) : (
              <div className="space-y-3">
                {athletes?.slice(0, 5).map((athlete) => (
                  <div key={athlete.id} className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-medium">
                      {athlete.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{athlete.name}</p>
                      <p className="text-sm text-muted-foreground">Grade {athlete.grade}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Meets */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Upcoming Meets</CardTitle>
              <CardDescription>Next events on the schedule</CardDescription>
            </div>
            <a
              href="#admin-meets"
              className="text-sm text-green-600 hover:text-green-700 font-medium"
            >
              View All
            </a>
          </CardHeader>
          <CardContent>
            {meetsLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-12 w-12 rounded" />
                    <div>
                      <Skeleton className="h-4 w-40 mb-1" />
                      <Skeleton className="h-3 w-28" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              (() => {
                const upcoming = meets
                  ?.filter(m => new Date(m.date) >= new Date())
                  .sort((a, b) => new Date(a.date) - new Date(b.date))
                  .slice(0, 5)

                if (!upcoming || upcoming.length === 0) {
                  return <p className="text-muted-foreground text-sm">No upcoming meets</p>
                }

                return (
                  <div className="space-y-3">
                    {upcoming.map((meet) => {
                      const date = new Date(meet.date)
                      return (
                        <div key={meet.id} className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded bg-green-100 text-green-700 flex flex-col items-center justify-center">
                            <span className="text-xs font-medium uppercase">
                              {date.toLocaleDateString('en-US', { month: 'short' })}
                            </span>
                            <span className="text-lg font-bold leading-none">
                              {date.getDate()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{meet.name}</p>
                            <p className="text-sm text-muted-foreground">{meet.location}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )
              })()
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
