export type SlotPeriod = 'Morning' | 'Afternoon' | 'Evening'

export interface TimeSlot {
  value: string
  label: string
  period: SlotPeriod
}

const WEEKDAY_SLOTS = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00']
const SATURDAY_SLOTS = ['09:00', '10:00', '11:00', '12:00', '13:00']

export const SLOT_PERIODS: SlotPeriod[] = ['Morning', 'Afternoon', 'Evening']

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

const toSlot = (value: string): TimeSlot => {
  const hours = Number(value.slice(0, 2))
  return {
    value,
    label: formatSlot(value),
    period: hours < 12 ? 'Morning' : hours < 17 ? 'Afternoon' : 'Evening',
  }
}

export const slotsFor = (date: Date) => (date.getDay() === 6 ? SATURDAY_SLOTS : WEEKDAY_SLOTS).map(toSlot)

export const isSlotAvailable = (date: Date, value: string, now: Date) => {
  const sameDay =
    date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && date.getDate() === now.getDate()
  if (!sameDay) return true
  return toMinutes(value) > now.getHours() * 60 + now.getMinutes() + 60
}
