export type SlotPeriod = 'Morning' | 'Afternoon'

export interface TimeSlot {
  value: string
  label: string
  period: SlotPeriod
}

const WEEKDAY_SLOTS = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00']

export const SLOT_PERIODS: SlotPeriod[] = ['Morning', 'Afternoon']

const toMinutes = (value: string) => {
  const [hours, minutes] = value.split(':').map(Number)
  return hours * 60 + minutes
}

export const formatSlot = (value: string) => {
  const [hours, minutes] = value.split(':').map(Number)
  const suffix = hours >= 12 ? 'PM' : 'AM'
  const hour12 = hours % 12 || 12
  return `${hour12}:${String(minutes).padStart(2, '0')} ${suffix}`
}

const toSlot = (value: string): TimeSlot => ({
  value,
  label: formatSlot(value),
  period: Number(value.slice(0, 2)) < 12 ? 'Morning' : 'Afternoon',
})

export const slotsFor = (date: Date) => (date.getDay() === 0 || date.getDay() === 6 ? [] : WEEKDAY_SLOTS.map(toSlot))

/** Slots as the booking API reports them for a day: every start time, with `available` set by live bookings. */
export const slotsFromApi = (slots: ReadonlyArray<{ time: string; available: boolean }>) =>
  slots.map((slot) => ({ ...toSlot(slot.time), available: slot.available }))

export const formatAppointmentDate = (date: Date) =>
  date.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

export const isSlotAvailable = (date: Date, value: string, now: Date) => {
  const sameDay =
    date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && date.getDate() === now.getDate()
  if (!sameDay) return true
  return toMinutes(value) > now.getHours() * 60 + now.getMinutes() + 60
}
