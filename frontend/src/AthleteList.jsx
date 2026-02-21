import { useQuery } from '@tanstack/react-query'
import AthleteCard from './AthleteCard'

// Mock category assignment based on athlete ID (until API provides real categories)
const assignCategory = (athlete, index) => {
  const categories = ['varsity-boys', 'varsity-girls', 'jv-boys', 'jv-girls']
  return categories[index % categories.length]
}

function AthleteList({ category }) {
  const { data: athletes, isLoading, error, refetch } = useQuery({
    queryKey: ['athletes'],
    queryFn: async () => {
      const res = await fetch('/api/athletes')
      if (!res.ok) throw new Error('Failed to fetch athletes')
      return res.json()
    },
    refetchOnWindowFocus: true,
  })

  if (isLoading) {
    return (
      <section aria-labelledby="athletes-heading-loading">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-green-600 rounded-full" aria-hidden="true"></div>
          <h2 id="athletes-heading-loading" className="text-3xl font-extrabold text-gray-900 tracking-tight">Our Athletes</h2>
        </div>
        <p className="sr-only" role="status">Loading athletes...</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" aria-hidden="true">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="p-5 bg-white rounded-xl border border-gray-100 shadow-sm animate-pulse">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="h-6 w-32 bg-gray-200 rounded"></div>
                  <div className="h-4 w-20 bg-gray-200 rounded"></div>
                </div>
                <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
              </div>
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="h-3 w-24 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 w-20 bg-gray-200 rounded"></div>
              </div>
              <div className="mt-4 h-10 w-full bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <div role="alert" className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p className="text-lg font-semibold text-gray-900">Failed to load athletes</p>
        <p className="mt-1 text-gray-500">{error.message}</p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 transition-colors"
        >
          Try again
        </button>
      </div>
    )
  }

  // Filter athletes by category (if selected)
  const filteredAthletes = category
    ? athletes.filter((athlete, index) => assignCategory(athlete, index) === category)
    : athletes

  return (
    <section id="athletes" aria-labelledby="athletes-heading">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-8 bg-green-600 rounded-full" aria-hidden="true"></div>
        <h2 id="athletes-heading" className="text-3xl font-extrabold text-gray-900 tracking-tight">Our Athletes</h2>
      </div>

      {/* Announce filter results to screen readers */}
      <div className="sr-only" role="status" aria-live="polite">
        {category
          ? `Showing ${filteredAthletes.length} athletes in ${category.replace('-', ' ')}`
          : `Showing all ${athletes.length} athletes`
        }
      </div>

      {filteredAthletes.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No athletes found in this category.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
          {filteredAthletes.map((athlete, index) => (
            <li key={athlete.id}>
              <AthleteCard
                name={athlete.name}
                grade={athlete.grade}
                personalRecord={athlete.personalRecord}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default AthleteList
