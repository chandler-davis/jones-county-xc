import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'

function AddAthleteForm() {
  const [name, setName] = useState('')
  const [grade, setGrade] = useState('')
  const [personalRecord, setPersonalRecord] = useState('')
  const [errors, setErrors] = useState({})

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (newAthlete) => {
      const res = await fetch('/api/athletes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAthlete),
      })
      if (!res.ok) throw new Error('Failed to save athlete')
      return res.json()
    },
    onSuccess: () => {
      // Refresh the athletes list
      queryClient.invalidateQueries({ queryKey: ['athletes'] })
      // Reset form
      setName('')
      setGrade('')
      setPersonalRecord('')
      setErrors({})
    },
  })

  const validate = () => {
    const newErrors = {}
    if (!name.trim()) newErrors.name = 'Name is required'
    if (!grade) {
      newErrors.grade = 'Grade is required'
    } else if (isNaN(grade) || grade < 9 || grade > 12) {
      newErrors.grade = 'Grade must be 9-12'
    }
    if (!personalRecord.trim()) {
      newErrors.personalRecord = 'Personal record is required'
    } else if (!/^\d{1,2}:\d{2}$/.test(personalRecord)) {
      newErrors.personalRecord = 'Format: MM:SS (e.g., 18:45)'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
      mutation.mutate({
        name: name.trim(),
        grade: parseInt(grade),
        personalRecord: personalRecord.trim(),
      })
    }
  }

  return (
    <section className="mt-12" aria-labelledby="add-athlete-heading">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-8 bg-green-600 rounded-full" aria-hidden="true"></div>
        <h2 id="add-athlete-heading" className="text-3xl font-extrabold text-gray-900 tracking-tight">Add Athlete</h2>
      </div>

      <form onSubmit={handleSubmit} className="max-w-md p-6 bg-white rounded-xl shadow-sm border border-gray-100">
        {mutation.isError && (
          <div role="alert" className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {mutation.error.message}
          </div>
        )}

        {mutation.isSuccess && (
          <div role="status" className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            Athlete added successfully!
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="athlete-name" className="block text-sm font-semibold text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              id="athlete-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              aria-describedby={errors.name ? 'name-error' : undefined}
              aria-invalid={errors.name ? 'true' : 'false'}
            />
            {errors.name && (
              <p id="name-error" className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="athlete-grade" className="block text-sm font-semibold text-gray-700 mb-1">
              Grade
            </label>
            <select
              id="athlete-grade"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 ${
                errors.grade ? 'border-red-500' : 'border-gray-300'
              }`}
              aria-describedby={errors.grade ? 'grade-error' : undefined}
              aria-invalid={errors.grade ? 'true' : 'false'}
            >
              <option value="">Select grade</option>
              <option value="9">9th Grade</option>
              <option value="10">10th Grade</option>
              <option value="11">11th Grade</option>
              <option value="12">12th Grade</option>
            </select>
            {errors.grade && (
              <p id="grade-error" className="mt-1 text-sm text-red-600">{errors.grade}</p>
            )}
          </div>

          <div>
            <label htmlFor="athlete-pr" className="block text-sm font-semibold text-gray-700 mb-1">
              Personal Record (5K)
            </label>
            <input
              type="text"
              id="athlete-pr"
              value={personalRecord}
              onChange={(e) => setPersonalRecord(e.target.value)}
              placeholder="18:45"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 ${
                errors.personalRecord ? 'border-red-500' : 'border-gray-300'
              }`}
              aria-describedby={errors.personalRecord ? 'pr-error' : 'pr-hint'}
              aria-invalid={errors.personalRecord ? 'true' : 'false'}
            />
            <p id="pr-hint" className="mt-1 text-xs text-gray-500">Format: MM:SS</p>
            {errors.personalRecord && (
              <p id="pr-error" className="mt-1 text-sm text-red-600">{errors.personalRecord}</p>
            )}
          </div>
        </div>

        <Button
          type="submit"
          disabled={mutation.isPending}
          className="mt-6 w-full bg-green-600 hover:bg-green-700"
        >
          {mutation.isPending ? 'Saving...' : 'Add Athlete'}
        </Button>
      </form>
    </section>
  )
}

export default AddAthleteForm
