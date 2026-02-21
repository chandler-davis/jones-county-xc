import { useAthletes, useMeets, useTopTimes } from '@/hooks/useApi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Users, Calendar, Trophy, Clock } from 'lucide-react'

function StatCard({ icon: IconComponent, label, value, description, loading }) {
  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-16 mb-1" />
          <Skeleton className="h-3 w-32" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        <IconComponent className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

function TopTimesTable({ times, loading }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-4 w-32 mb-1" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-6 w-16" />
          </div>
        ))}
      </div>
    )
  }

  if (!times || times.length === 0) {
    return <p className="text-muted-foreground text-sm">No times recorded yet.</p>
  }

  return (
    <div className="space-y-4">
      {times.slice(0, 5).map((time, index) => (
        <div key={time.id} className="flex items-center gap-4">
          <div className={`
            flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold
            ${index === 0 ? 'bg-yellow-100 text-yellow-700' : ''}
            ${index === 1 ? 'bg-gray-100 text-gray-700' : ''}
            ${index === 2 ? 'bg-orange-100 text-orange-700' : ''}
            ${index > 2 ? 'bg-muted text-muted-foreground' : ''}
          `}>
            {index + 1}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{time.athleteName}</p>
            <p className="text-xs text-muted-foreground truncate">{time.meetName}</p>
          </div>
          <Badge variant="secondary" className="font-mono">
            {time.time}
          </Badge>
        </div>
      ))}
    </div>
  )
}

function UpcomingMeetsList({ meets, loading }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-start gap-4 p-3 rounded-lg border">
            <Skeleton className="h-12 w-12 rounded" />
            <div className="flex-1">
              <Skeleton className="h-4 w-40 mb-2" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  const upcomingMeets = meets
    ?.filter(meet => new Date(meet.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3)

  if (!upcomingMeets || upcomingMeets.length === 0) {
    return <p className="text-muted-foreground text-sm">No upcoming meets scheduled.</p>
  }

  return (
    <div className="space-y-3">
      {upcomingMeets.map((meet) => {
        const meetDate = new Date(meet.date)
        const month = meetDate.toLocaleDateString('en-US', { month: 'short' })
        const day = meetDate.getDate()

        return (
          <div key={meet.id} className="flex items-start gap-4 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
            <div className="flex flex-col items-center justify-center w-12 h-12 rounded bg-green-100 text-green-700">
              <span className="text-xs font-medium uppercase">{month}</span>
              <span className="text-lg font-bold leading-none">{day}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{meet.name}</p>
              <p className="text-sm text-muted-foreground truncate">{meet.location}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function HomePage() {
  const { data: athletes, isLoading: athletesLoading } = useAthletes()
  const { data: meets, isLoading: meetsLoading } = useMeets()
  const { data: topTimes, isLoading: topTimesLoading } = useTopTimes()

  const upcomingMeetsCount = meets?.filter(m => new Date(m.date) >= new Date()).length || 0
  const bestTime = topTimes?.[0]?.time || '--:--'

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-green-600 via-green-700 to-gray-900 text-white py-20 px-8 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 opacity-10" aria-hidden="true">
          <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-400 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        </div>

        <div className="relative text-center max-w-3xl mx-auto">
          <p className="text-green-300 text-sm font-bold uppercase tracking-widest mb-4">Welcome to</p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-none">
            Jones County
            <span className="block text-yellow-400 mt-2">Cross Country</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-green-100 font-medium">
            Building Champions On and Off the Course
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="#athletes"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-green-700 font-semibold rounded-lg hover:bg-green-50 transition-colors"
            >
              <Users className="h-5 w-5" />
              Meet the Team
            </a>
            <a
              href="#schedule"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-500/20 text-white font-semibold rounded-lg border border-white/30 hover:bg-green-500/30 transition-colors"
            >
              <Calendar className="h-5 w-5" />
              View Schedule
            </a>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Team Overview</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={Users}
            label="Total Athletes"
            value={athletes?.length || 0}
            description="Active team members"
            loading={athletesLoading}
          />
          <StatCard
            icon={Calendar}
            label="Upcoming Meets"
            value={upcomingMeetsCount}
            description="Scheduled events"
            loading={meetsLoading}
          />
          <StatCard
            icon={Trophy}
            label="Total Meets"
            value={meets?.length || 0}
            description="This season"
            loading={meetsLoading}
          />
          <StatCard
            icon={Clock}
            label="Best Time"
            value={bestTime}
            description="Season record"
            loading={topTimesLoading}
          />
        </div>
      </section>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Times */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Top Times
            </CardTitle>
            <CardDescription>Fastest performances this season</CardDescription>
          </CardHeader>
          <CardContent>
            <TopTimesTable times={topTimes} loading={topTimesLoading} />
          </CardContent>
        </Card>

        {/* Upcoming Meets */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-500" />
              Upcoming Meets
            </CardTitle>
            <CardDescription>Next events on the schedule</CardDescription>
          </CardHeader>
          <CardContent>
            <UpcomingMeetsList meets={meets} loading={meetsLoading} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
