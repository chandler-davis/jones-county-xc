function AthleteCard({ name, grade, personalRecord }) {
  return (
    <div className="p-4 bg-white rounded shadow">
      <span className="font-semibold">{name}</span>
      <span className="ml-2 text-gray-600">Grade {grade}</span>
      <span className="ml-2 text-blue-600">PR: {personalRecord}</span>
    </div>
  )
}

export default AthleteCard
