const placeholderMeets = [
  { id: 1, name: 'Region 1-AAAAA Championship', date: 'Oct 26, 2024', location: 'Lake Oconee' },
  { id: 2, name: 'State Championship', date: 'Nov 2, 2024', location: 'Carrollton' },
  { id: 3, name: 'County Invitational', date: 'Nov 9, 2024', location: 'Jones County High' },
]

function UpcomingMeets() {
  return (
    <section id="meets" className="mt-12" aria-labelledby="meets-heading">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-8 bg-green-600 rounded-full" aria-hidden="true"></div>
        <h2 id="meets-heading" className="text-3xl font-extrabold text-gray-900 tracking-tight">Upcoming Meets</h2>
      </div>
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-4" role="list">
        {placeholderMeets.map((meet) => (
          <li key={meet.id}>
            <article className="p-5 bg-white rounded-xl border-l-4 border-green-600 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-bold text-gray-900">{meet.name}</h3>
              <p className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="sr-only">Date: </span>
                <time>{meet.date}</time>
              </p>
              <p className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="sr-only">Location: </span>
                {meet.location}
              </p>
            </article>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default UpcomingMeets
