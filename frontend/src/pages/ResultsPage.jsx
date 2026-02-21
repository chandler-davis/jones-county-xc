import { useState, useEffect } from 'react'
import { useMeets, useMeetResults, useTopTimes } from '@/hooks/useApi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Trophy, Medal, Calendar, MapPin, Clock } from 'lucide-react'

function PlaceBadge({ place }) {
  if (!place) return <span className="text-muted-foreground">-</span>

  const colors = {
    1: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    2: 'bg-gray-100 text-gray-700 border-gray-300',
    3: 'bg-orange-100 text-orange-700 border-orange-300',
  }

  if (place <= 3) {
    return (
      <Badge variant="outline" className={`font-bold ${colors[place]}`}>
        {place === 1 && <Trophy className="h-3 w-3 mr-1" />}
        {place === 2 && <Medal className="h-3 w-3 mr-1" />}
        {place === 3 && <Medal className="h-3 w-3 mr-1" />}
        {place}
      </Badge>
    )
  }

  return <Badge variant="secondary">{place}</Badge>
}

function ResultsTable({ results, loading }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-3">
            <Skeleton className="h-6 w-8" />
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-16 ml-auto" />
          </div>
        ))}
      </div>
    )
  }

  if (!results || results.length === 0) {
    return (
      <div className="py-12 text-center">
        <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No results recorded for this meet</p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-20">Place</TableHead>
          <TableHead>Athlete</TableHead>
          <TableHead className="text-right">Time</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {results.map((result) => (
          <TableRow key={result.id}>
            <TableCell>
              <PlaceBadge place={result.place} />
            </TableCell>
            <TableCell className="font-medium">{result.athleteName}</TableCell>
            <TableCell className="text-right font-mono">{result.time}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function TopTimesSection() {
  const { data: topTimes, isLoading } = useTopTimes()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Season Best Times
        </CardTitle>
        <CardDescription>Top 10 fastest times across all meets</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
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
        ) : !topTimes || topTimes.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No times recorded yet</p>
        ) : (
          <div className="space-y-3">
            {topTimes.map((time, index) => (
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
                  <p className="text-xs text-muted-foreground truncate">
                    {time.meetName} - {new Date(time.meetDate).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant="secondary" className="font-mono shrink-0">
                  {time.time}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function ResultsPage() {
  const [selectedMeetId, setSelectedMeetId] = useState(null)

  const { data: meets, isLoading: meetsLoading } = useMeets()
  const { data: results, isLoading: resultsLoading } = useMeetResults(selectedMeetId)

  // Get meet ID from URL hash on load
  useEffect(() => {
    const hash = window.location.hash
    const match = hash.match(/meet=(\d+)/)
    if (match) {
      setSelectedMeetId(match[1])
    }
  }, [])

  // Auto-select first past meet if none selected
  useEffect(() => {
    if (!selectedMeetId && meets && meets.length > 0) {
      const pastMeets = meets
        .filter(m => new Date(m.date) < new Date())
        .sort((a, b) => new Date(b.date) - new Date(a.date))
      if (pastMeets.length > 0) {
        setSelectedMeetId(String(pastMeets[0].id))
      }
    }
  }, [meets, selectedMeetId])

  const selectedMeet = meets?.find(m => String(m.id) === selectedMeetId)
  const sortedMeets = meets
    ?.slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date)) || []

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Trophy className="h-8 w-8 text-green-600" />
          Meet Results
        </h1>
        <p className="text-muted-foreground mt-1">
          View individual meet results and season best times
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Meet Results - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Meet Selector */}
          <Card>
            <CardHeader>
              <CardTitle>Select Meet</CardTitle>
              <CardDescription>Choose a meet to view results</CardDescription>
            </CardHeader>
            <CardContent>
              <Select
                value={selectedMeetId || ''}
                onValueChange={setSelectedMeetId}
                disabled={meetsLoading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a meet..." />
                </SelectTrigger>
                <SelectContent>
                  {sortedMeets.map((meet) => (
                    <SelectItem key={meet.id} value={String(meet.id)}>
                      {meet.name} - {new Date(meet.date).toLocaleDateString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Results Card */}
          {selectedMeet && (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{selectedMeet.name}</CardTitle>
                    <CardDescription className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(selectedMeet.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {selectedMeet.location}
                      </span>
                    </CardDescription>
                  </div>
                  {results && results.length > 0 && (
                    <Badge variant="secondary">
                      {results.length} {results.length === 1 ? 'result' : 'results'}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <ResultsTable results={results} loading={resultsLoading} />
              </CardContent>
            </Card>
          )}

          {!selectedMeet && !meetsLoading && (
            <Card>
              <CardContent className="py-12 text-center">
                <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Select a meet above to view results
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar - Top Times */}
        <div>
          <TopTimesSection />
        </div>
      </div>
    </div>
  )
}
