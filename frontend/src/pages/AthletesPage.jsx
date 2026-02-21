import { useState } from 'react'
import { useAthletes } from '@/hooks/useApi'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Users, Search, GraduationCap } from 'lucide-react'

function AthleteCard({ athlete }) {
  const gradeLabels = {
    9: 'Freshman',
    10: 'Sophomore',
    11: 'Junior',
    12: 'Senior',
  }

  const gradeColors = {
    9: 'bg-blue-100 text-blue-700',
    10: 'bg-purple-100 text-purple-700',
    11: 'bg-orange-100 text-orange-700',
    12: 'bg-green-100 text-green-700',
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white font-bold text-lg">
            {athlete.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate">{athlete.name}</h3>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <Badge variant="secondary" className={gradeColors[athlete.grade]}>
                <GraduationCap className="h-3 w-3 mr-1" />
                {gradeLabels[athlete.grade] || `Grade ${athlete.grade}`}
              </Badge>
              {athlete.personalRecord && (
                <Badge variant="outline" className="font-mono">
                  PR: {athlete.personalRecord}
                </Badge>
              )}
            </div>
            {athlete.events && (
              <p className="text-sm text-muted-foreground mt-2">
                Events: {athlete.events}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function AthleteCardSkeleton() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <Skeleton className="w-12 h-12 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-5 w-32 mb-2" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-24" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function AthletesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const { data: athletes, isLoading, error } = useAthletes()

  const filteredAthletes = athletes?.filter(athlete => {
    return athlete.name.toLowerCase().includes(searchQuery.toLowerCase())
  }) || []

  const athletesByGrade = {
    all: filteredAthletes,
    seniors: filteredAthletes.filter(a => a.grade === 12),
    juniors: filteredAthletes.filter(a => a.grade === 11),
    sophomores: filteredAthletes.filter(a => a.grade === 10),
    freshmen: filteredAthletes.filter(a => a.grade === 9),
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="rounded-full bg-destructive/10 p-4 mb-4">
          <Users className="h-8 w-8 text-destructive" />
        </div>
        <p className="text-destructive font-medium mb-2">Failed to load athletes</p>
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Users className="h-8 w-8 text-green-600" />
            Our Athletes
          </h1>
          <p className="text-muted-foreground mt-1">
            Meet the dedicated runners of Jones County Cross Country
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{athletes?.length || 0} total athletes</span>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search athletes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tabs by Grade */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
          <TabsTrigger value="all">
            All ({athletesByGrade.all.length})
          </TabsTrigger>
          <TabsTrigger value="seniors">
            Seniors ({athletesByGrade.seniors.length})
          </TabsTrigger>
          <TabsTrigger value="juniors">
            Juniors ({athletesByGrade.juniors.length})
          </TabsTrigger>
          <TabsTrigger value="sophomores">
            Sophomores ({athletesByGrade.sophomores.length})
          </TabsTrigger>
          <TabsTrigger value="freshmen">
            Freshmen ({athletesByGrade.freshmen.length})
          </TabsTrigger>
        </TabsList>

        {Object.entries(athletesByGrade).map(([key, athleteList]) => (
          <TabsContent key={key} value={key} className="mt-6">
            {isLoading ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <AthleteCardSkeleton key={i} />
                ))}
              </div>
            ) : athleteList.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    {searchQuery ? 'No athletes match your search' : 'No athletes in this category'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {athleteList.map((athlete) => (
                  <AthleteCard key={athlete.id} athlete={athlete} />
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
