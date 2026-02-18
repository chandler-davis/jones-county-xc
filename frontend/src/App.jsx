import AthleteList from './AthleteList'

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-green-700 text-white text-center py-4 text-xl font-semibold">
        Welcome to Jones County Cross Country
      </div>
      <div className="p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          Jones County XC
        </h1>
        <AthleteList />
      </div>
    </div>
  )
}

export default App
