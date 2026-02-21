import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

function RaceCategorySelect({ id, value, onValueChange }) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger id={id} className="w-48">
        <SelectValue placeholder="Select category" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="varsity-boys">Varsity Boys</SelectItem>
        <SelectItem value="varsity-girls">Varsity Girls</SelectItem>
        <SelectItem value="jv-boys">JV Boys</SelectItem>
        <SelectItem value="jv-girls">JV Girls</SelectItem>
      </SelectContent>
    </Select>
  )
}

export default RaceCategorySelect
