import { useQuery } from '@tanstack/react-query'

function EventList() {
  const { data: events, isLoading, error, refetch } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const res = await fetch('/api/meets')
      if (!res.ok) throw new Error('Failed to fetch events')
      return res.json()
    },
    refetchOnWindowFocus: true,
  })

  if (isLoading) {
    return (
      <section aria-labelledby="events-heading-loading">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-green-600 rounded-full" aria-hidden="true"></div>
          <h2 id="events-heading-loading" className="text-3xl font-extrabold text-gray-900 tracking-tight">Events</h2>
        </div>
        <p className="sr-only" role="status">Loading events...</p>
        <ul className="space-y-4" aria-hidden="true">
          {[1, 2, 3].map((i) => (
            <li key={i} className="p-5 bg-white rounded-xl border border-gray-100 shadow-sm animate-pulse">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="h-6 w-48 bg-gray-200 rounded"></div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 bg-gray-200 rounded"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <div className="h-4 w-4 bg-gray-200 rounded"></div>
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
              </div>
              <div className="mt-3 h-4 w-full bg-gray-200 rounded"></div>
            </li>
          ))}
        </ul>
      </section>
    )
  }

  if (error) {
    return (
      <section aria-labelledby="events-heading-error">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-green-600 rounded-full" aria-hidden="true"></div>
          <h2 id="events-heading-error" className="text-3xl font-extrabold text-gray-900 tracking-tight">Events</h2>
        </div>
        <div role="alert" className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-xl border border-gray-100">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-lg font-semibold text-gray-900">Failed to load events</p>
          <p className="mt-1 text-gray-500">{error.message}</p>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 transition-colors"
          >
            Try again
          </button>
        </div>
      </section>
    )
  }

  return (
    <section id="events" aria-labelledby="events-heading">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-8 bg-green-600 rounded-full" aria-hidden="true"></div>
        <h2 id="events-heading" className="text-3xl font-extrabold text-gray-900 tracking-tight">Events</h2>
      </div>

      {events.length === 0 ? (
        <p className="text-gray-500 text-center py-8 bg-white rounded-xl border border-gray-100 animate-fade-in">
          No events scheduled.
        </p>
      ) : (
        <ul className="space-y-4" role="list">
          {events.map((event, index) => (
            <li
              key={event.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <article className="p-5 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{event.name}</h3>
                    <p className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="sr-only">Date: </span>
                      <time>{event.date}</time>
                    </p>
                  </div>
                  {event.type && (
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold uppercase">
                      {event.type}
                    </span>
                  )}
                </div>
                {event.location && (
                  <p className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="sr-only">Location: </span>
                    {event.location}
                  </p>
                )}
                {event.description && (
                  <p className="mt-3 text-gray-600">{event.description}</p>
                )}
              </article>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default EventList
