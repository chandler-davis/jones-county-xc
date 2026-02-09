import { useQuery } from '@tanstack/react-query'

function AthleteList() {
  const { data: athletes, isLoading, error } = useQuery({
    queryKey: ['athletes'],
    queryFn: async () => {
      const res = await fetch('/api/athletes')
      if (!res.ok) throw new Error('Failed to fetch athletes')
      return res.json()
    }
  })

  if (isLoading) return <p>Loading athletes...</p>
  if (error) return <p>Error: {error.message}</p>

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Athletes</h2>
      <ul className="space-y-2">
        {athletes.map((athlete) => (
          <li key={athlete.id} className="p-4 bg-white rounded shadow">
            <span className="font-semibold">{athlete.name}</span>
            <span className="ml-2 text-gray-600">Grade {athlete.grade}</span>
            <span className="ml-2 text-blue-600">PR: {athlete.personalRecord}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default AthleteList
