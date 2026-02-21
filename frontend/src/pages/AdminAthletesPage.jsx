import { useState } from 'react'
import { useAthletes, useCreateAthlete, useUpdateAthlete, useDeleteAthlete } from '@/hooks/useApi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Users,
  Plus,
  Pencil,
  Trash2,
  Check,
  Loader2,
  AlertCircle,
  ArrowLeft,
  Search,
} from 'lucide-react'

const gradeLabels = {
  9: 'Freshman',
  10: 'Sophomore',
  11: 'Junior',
  12: 'Senior',
}

const gradeColors = {
  9: 'bg-blue-100 text-blue-700 hover:bg-blue-100',
  10: 'bg-purple-100 text-purple-700 hover:bg-purple-100',
  11: 'bg-orange-100 text-orange-700 hover:bg-orange-100',
  12: 'bg-green-100 text-green-700 hover:bg-green-100',
}

// Athlete Form Component
function AthleteForm({ athlete, onSubmit, onCancel, isSubmitting }) {
  const [formData, setFormData] = useState({
    name: athlete?.name || '',
    grade: athlete?.grade?.toString() || '9',
    personalRecord: athlete?.personalRecord || '',
    events: athlete?.events || '',
  })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
      onSubmit({
        ...formData,
        grade: parseInt(formData.grade),
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">
          Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter athlete name"
          disabled={isSubmitting}
          className={errors.name ? 'border-destructive' : ''}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="grade">
          Grade <span className="text-destructive">*</span>
        </Label>
        <Select
          value={formData.grade}
          onValueChange={(value) => setFormData({ ...formData, grade: value })}
          disabled={isSubmitting}
        >
          <SelectTrigger id="grade">
            <SelectValue placeholder="Select grade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="9">9 - Freshman</SelectItem>
            <SelectItem value="10">10 - Sophomore</SelectItem>
            <SelectItem value="11">11 - Junior</SelectItem>
            <SelectItem value="12">12 - Senior</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="personalRecord">Personal Record</Label>
        <Input
          id="personalRecord"
          value={formData.personalRecord}
          onChange={(e) => setFormData({ ...formData, personalRecord: e.target.value })}
          placeholder="e.g., 16:42"
          disabled={isSubmitting}
        />
        <p className="text-sm text-muted-foreground">
          Best time for 5K race
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="events">Events</Label>
        <Input
          id="events"
          value={formData.events}
          onChange={(e) => setFormData({ ...formData, events: e.target.value })}
          placeholder="e.g., 5K, 3200m, 1600m"
          disabled={isSubmitting}
        />
        <p className="text-sm text-muted-foreground">
          Comma-separated list of events
        </p>
      </div>

      <DialogFooter className="gap-2 sm:gap-0">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-green-600 hover:bg-green-700"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Check className="h-4 w-4" />
              {athlete ? 'Save Changes' : 'Add Athlete'}
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  )
}

export default function AdminAthletesPage() {
  const { data: athletes, isLoading, error } = useAthletes()
  const createAthlete = useCreateAthlete()
  const updateAthlete = useUpdateAthlete()
  const deleteAthlete = useDeleteAthlete()

  const [searchQuery, setSearchQuery] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingAthlete, setEditingAthlete] = useState(null)
  const [deletingAthlete, setDeletingAthlete] = useState(null)
  const [notification, setNotification] = useState(null)

  const filteredAthletes = athletes?.filter(athlete =>
    athlete.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const handleAdd = async (data) => {
    try {
      await createAthlete.mutateAsync(data)
      setIsAddDialogOpen(false)
      showNotification('Athlete added successfully')
    } catch (err) {
      showNotification(err.message || 'Failed to add athlete', 'error')
    }
  }

  const handleEdit = async (data) => {
    try {
      await updateAthlete.mutateAsync({ id: editingAthlete.id, data })
      setEditingAthlete(null)
      showNotification('Athlete updated successfully')
    } catch (err) {
      showNotification(err.message || 'Failed to update athlete', 'error')
    }
  }

  const handleDelete = async () => {
    try {
      await deleteAthlete.mutateAsync(deletingAthlete.id)
      setDeletingAthlete(null)
      showNotification('Athlete deleted successfully')
    } catch (err) {
      showNotification(err.message || 'Failed to delete athlete', 'error')
    }
  }

  return (
    <div className="space-y-6">
      {/* Notification */}
      {notification && (
        <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-top-2">
          <Alert variant={notification.type === 'error' ? 'destructive' : 'default'} className={notification.type === 'error' ? '' : 'border-green-200 bg-green-50 text-green-800'}>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{notification.message}</AlertDescription>
          </Alert>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <a href="#admin">
              <ArrowLeft className="h-5 w-5" />
            </a>
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Users className="h-6 w-6 text-green-600" />
              Manage Athletes
            </h1>
            <p className="text-muted-foreground text-sm">
              Add, edit, and remove athletes from your team
            </p>
          </div>
        </div>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="h-4 w-4" />
          Add Athlete
        </Button>
      </div>

      {/* Search and Stats */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search athletes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          {filteredAthletes.length} of {athletes?.length || 0} athletes
        </p>
      </div>

      {/* Athletes Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>All Athletes</CardTitle>
          <CardDescription>
            A list of all athletes on the team with their details
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="h-12 w-12 text-destructive mb-4" />
              <p className="text-destructive font-medium mb-2">Failed to load athletes</p>
              <p className="text-muted-foreground text-sm mb-4">Please try again later</p>
              <Button onClick={() => window.location.reload()} variant="outline">
                Try Again
              </Button>
            </div>
          ) : isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 py-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-24 ml-auto" />
                </div>
              ))}
            </div>
          ) : filteredAthletes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="rounded-full bg-muted p-4 mb-4">
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="font-medium mb-1">
                {searchQuery ? 'No athletes found' : 'No athletes yet'}
              </p>
              <p className="text-muted-foreground text-sm mb-4">
                {searchQuery ? 'Try a different search term' : 'Get started by adding your first athlete'}
              </p>
              {!searchQuery && (
                <Button
                  onClick={() => setIsAddDialogOpen(true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="h-4 w-4" />
                  Add Your First Athlete
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Name</TableHead>
                    <TableHead className="font-semibold">Grade</TableHead>
                    <TableHead className="font-semibold">Personal Record</TableHead>
                    <TableHead className="font-semibold">Events</TableHead>
                    <TableHead className="text-right font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAthletes.map((athlete) => (
                    <TableRow key={athlete.id} className="group">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-medium text-sm shadow-sm">
                            {athlete.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium">{athlete.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={gradeColors[athlete.grade]}>
                          {gradeLabels[athlete.grade] || `Grade ${athlete.grade}`}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {athlete.personalRecord ? (
                          <code className="rounded bg-muted px-2 py-1 text-sm font-mono">
                            {athlete.personalRecord}
                          </code>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {athlete.events ? (
                          <span className="text-sm">{athlete.events}</span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingAthlete(athlete)}
                            className="h-8 w-8 p-0"
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeletingAthlete(athlete)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Athlete</DialogTitle>
            <DialogDescription>
              Enter the details for the new team member
            </DialogDescription>
          </DialogHeader>
          <AthleteForm
            onSubmit={handleAdd}
            onCancel={() => setIsAddDialogOpen(false)}
            isSubmitting={createAthlete.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingAthlete} onOpenChange={() => setEditingAthlete(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Athlete</DialogTitle>
            <DialogDescription>
              Update the athlete's information
            </DialogDescription>
          </DialogHeader>
          {editingAthlete && (
            <AthleteForm
              athlete={editingAthlete}
              onSubmit={handleEdit}
              onCancel={() => setEditingAthlete(null)}
              isSubmitting={updateAthlete.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingAthlete} onOpenChange={() => setDeletingAthlete(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Athlete</DialogTitle>
            <DialogDescription>
              This action cannot be undone
            </DialogDescription>
          </DialogHeader>
          {deletingAthlete && (
            <div className="space-y-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  This will permanently delete <strong>{deletingAthlete.name}</strong> and all their associated results.
                </AlertDescription>
              </Alert>

              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  variant="outline"
                  onClick={() => setDeletingAthlete(null)}
                  disabled={deleteAthlete.isPending}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleteAthlete.isPending}
                >
                  {deleteAthlete.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      Delete Athlete
                    </>
                  )}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
