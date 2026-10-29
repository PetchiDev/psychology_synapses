'use client'

import { Clock, Loader2 } from 'lucide-react'
import type { ApiSlot } from '@/lib/booking/api'
import { isSlotAvailable, SLOT_PERIODS, slotsFor, slotsFromApi } from '@/lib/booking/slots'
import { cn } from '@/lib/utils'

interface TimeSlotPickerProps {
  date?: Date
  value?: string
  now: Date | null
  error?: string
  /** Live slots from the booking API for `date`. While undefined, the standard times are shown as a fallback. */
  apiSlots?: ApiSlot[]
  loading?: boolean
  onChange: (value: string) => void
}

export function TimeSlotPicker({ date, value, now, error, apiSlots, loading, onChange }: TimeSlotPickerProps) {
  const slots = !date
    ? []
    : apiSlots
      ? slotsFromApi(apiSlots)
      : slotsFor(date).map((slot) => ({ ...slot, available: now ? isSlotAvailable(date, slot.value, now) : true }))
  const noneLeft = Boolean(date && apiSlots && !loading && !slots.some((slot) => slot.available))

  return (
    <fieldset
      aria-describedby={error ? 'appointment-time-error' : undefined}
      aria-busy={loading || undefined}
      className={cn(
        'flex h-full min-w-0 flex-col gap-5 rounded-[1.5rem] border bg-[#fffaf1]/70 p-5',
        error ? 'border-destructive/50' : 'border-coffee/15',
      )}
    >
      <legend className="sr-only">Choose a time slot</legend>
      <div className="flex items-center gap-2 font-serif text-[1.35rem] text-shadow" aria-hidden="true">
        <Clock className="size-5 text-burgundy" />
        Available times
        {loading ? <Loader2 className="ml-auto size-4 animate-spin text-coffee" /> : null}
      </div>

      {!date ? (
        <p className="grid flex-1 place-items-center rounded-2xl border border-dashed border-coffee/30 px-4 py-10 text-center text-[0.95rem] leading-relaxed text-coffee">
          Choose a day on the calendar to see available time slots.
        </p>
      ) : noneLeft ? (
        <p className="grid flex-1 place-items-center rounded-2xl border border-dashed border-coffee/30 px-4 py-10 text-center text-[0.95rem] leading-relaxed text-coffee">
          This day is fully booked. Please choose another day.
        </p>
      ) : (
        SLOT_PERIODS.map((period) => {
          const periodSlots = slots.filter((slot) => slot.period === period)
          if (!periodSlots.length) return null
          return (
            <div key={period} role="group" aria-label={`${period} slots`} className="grid gap-2.5">
              <p className="type-eyebrow text-[0.68rem] text-coffee">{period}</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {periodSlots.map((slot) => (
                  <label key={slot.value} className="relative">
                    <input
                      type="radio"
                      name="appointment-time"
                      value={slot.value}
                      checked={value === slot.value}
                      disabled={!slot.available || loading}
                      onChange={() => onChange(slot.value)}
                      className="peer sr-only"
                    />
                    <span
                      className={cn(
                        'flex h-11 cursor-pointer items-center justify-center rounded-full border border-coffee/25 text-sm font-semibold text-shadow tabular-nums transition-[background-color,color,border-color,transform,box-shadow] duration-300 ease-(--ease-paper)',
                        'hover:border-burgundy hover:text-burgundy',
                        'peer-checked:scale-[1.03] peer-checked:border-burgundy peer-checked:bg-burgundy peer-checked:text-paper peer-checked:shadow-[0_10px_20px_-12px_rgb(106_31_38/0.9)]',
                        'peer-focus-visible:ring-[3px] peer-focus-visible:ring-burgundy/35',
                        'peer-disabled:cursor-not-allowed peer-disabled:border-coffee/15 peer-disabled:text-coffee/40 peer-disabled:line-through peer-disabled:hover:text-coffee/40',
                      )}
                    >
                      {slot.label}
                      {!slot.available ? <span className="sr-only"> (taken)</span> : null}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )
        })
      )}
    </fieldset>
  )
}
