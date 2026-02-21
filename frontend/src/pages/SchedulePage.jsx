import { useMeets } from '@/hooks/useApi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Calendar, MapPin, Clock, ChevronRight } from 'lucide-react'

function MeetCard({ meet, isPast }) {
  const meetDate = new Date(meet.date)
  const month = meetDate.toLocaleDateString('en-US', { month: 'short' })
  const day = meetDate.getDate()
  const weekday = meetDate.toLocaleDateString('en-US', { weekday: 'long' })
  const year = meetDate.getFullYear()

  return (
    <Card className={`hover:shadow-md transition-shadow ${isPast ? 'opacity-75' : ''}`}>
      <CardContent className="p-0">
        <div className="flex">
          {/* Date Block */}
          <div className={`
            flex flex-col items-center justify-center w-24 p-4
            ${isPast ? 'bg-gray-100 text-gray-600' : 'bg-green-600 text-white'}
          `}>
            <span className="text-xs font-medium uppercase">{month}</span>
            <span className="text-3xl font-bold leading-none">{day}</span>
            <span className="text-xs mt-1">{year}</span>
          </div>

          {/* Content */}
          <div className="flex-1 p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg">{meet.name}</h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {meet.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {weekday}
                  </span>
                </div>
                {meet.description && (
                  <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                    {meet.description}
                  </p>
                )}
              </div>

              {isPast ? (
                <a
                  href={`#results?meet=${meet.id}`}
                  className="flex items-center gap-1 text-sm font-medium text-green-600 hover:text-green-700 shrink-0"
                >
                  View Results
                  <ChevronRight className="h-4 w-4" />
                </a>
              ) : (
                <Badge variant="secondary" className="bg-green-100 text-green-700 shrink-0">
                  Upcoming
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function MeetCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="flex">
          <Skeleton className="w-24 h-28" />
          <div className="flex-1 p-4">
            <Skeleton className="h-6 w-48 mb-3" />
            <div className="flex gap-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function MeetsList({ meets, isPast, loading }) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <MeetCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (!meets || meets.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            {isPast ? 'No past meets recorded' : 'No upcoming meets scheduled'}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {meets.map((meet) => (
        <MeetCard key={meet.id} meet={meet} isPast={isPast} />
      ))}
    </div>
  )
}

export default function SchedulePage() {
  const { data: meets, isLoading, error } = useMeets()

  const now = new Date()
  now.setHours(0, 0, 0, 0)

  const upcomingMeets = meets
    ?.filter(meet => new Date(meet.date) >= now)
    .sort((a, b) => new Date(a.date) - new Date(b.date)) || []

  const pastMeets = meets
    ?.filter(meet => new Date(meet.date) < now)
    .sort((a, b) => new Date(b.date) - new Date(a.date)) || []

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="rounded-full bg-destructive/10 p-4 mb-4">
          <Calendar className="h-8 w-8 text-destructive" />
        </div>
        <p className="text-destructive font-medium mb-2">Failed to load schedule</p>
        <p className="text-muted-foreground text-sm mb-4">Please try again later</p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Calendar className="h-8 w-8 text-green-600" />
          Meet Schedule
        </h1>
        <p className="text-muted-foreground mt-1">
          View upcoming competitions and past meet results
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Upcoming Meets</CardDescription>
            <CardTitle className="text-3xl text-green-600">{upcomingMeets.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Completed Meets</CardDescription>
            <CardTitle className="text-3xl">{pastMeets.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Season Meets</CardDescription>
            <CardTitle className="text-3xl">{meets?.length || 0}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Meets Tabs */}
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-grid">
          <TabsTrigger value="upcoming" className="gap-2">
            <Clock className="h-4 w-4" />
            Upcoming ({upcomingMeets.length})
          </TabsTrigger>
          <TabsTrigger value="past" className="gap-2">
            <Calendar className="h-4 w-4" />
            Past ({pastMeets.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6">
          <MeetsList meets={upcomingMeets} isPast={false} loading={isLoading} />
        </TabsContent>

        <TabsContent value="past" className="mt-6">
          <MeetsList meets={pastMeets} isPast={true} loading={isLoading} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
