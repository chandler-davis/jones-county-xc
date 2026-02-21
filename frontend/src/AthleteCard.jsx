import { useState } from 'react'
import { Button } from '@/components/ui/button'

function AthleteCard({ name, grade, personalRecord }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <article className="p-5 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg focus-within:ring-2 focus-within:ring-green-600 transition-all">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{name}</h3>
          <p className="mt-1 text-sm text-gray-500 font-medium">Grade {grade}</p>
        </div>
        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold uppercase">
          Varsity
        </span>
      </div>
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide">Personal Record</p>
        <p className="mt-1 text-2xl font-extrabold text-green-600 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{personalRecord}</span>
        </p>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide">Season Best</p>
            <p className="text-lg font-bold text-gray-900">18:42</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide">Events</p>
            <p className="text-sm text-gray-700">5K, 3200m, 1600m</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide">Coach's Notes</p>
            <p className="text-sm text-gray-700">Strong finisher, excellent race strategy.</p>
          </div>
        </div>
      )}

      <Button
        variant="outline"
        className="mt-4 w-full font-semibold"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        {isExpanded ? 'Hide Details' : 'View Details'}
      </Button>
    </article>
  )
}

export default AthleteCard
