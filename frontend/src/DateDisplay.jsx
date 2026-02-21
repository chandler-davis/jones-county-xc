function DateDisplay() {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <p className="mt-8 text-green-200/80 text-sm font-medium tracking-wide">
      <span className="sr-only">Today's date: </span>
      <time dateTime={new Date().toISOString().split('T')[0]}>{today}</time>
    </p>
  )
}

export default DateDisplay
