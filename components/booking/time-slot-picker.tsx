'use client'

import { Clock } from 'lucide-react'
import { isSlotAvailable, SLOT_PERIODS, slotsFor } from '@/lib/booking/slots'
import { cn } from '@/lib/utils'

interface TimeSlotPickerProps {
  date?: Date
  value?: string
  now: Date | null
  error?: string
  onChange: (value: string) => void
}

export function TimeSlotPicker({ date, value, now, error, onChange }: TimeSlotPickerProps) {
  const slots = date ? slotsFor(date) : []

  return (
    <fieldset
      aria-describedby={error ? 'appointment-time-error' : undefined}
      className={cn(
        'flex h-full min-w-0 flex-col gap-5 rounded-[1.5rem] border bg-[#fffaf1]/70 p-5',
        error ? 'border-destructive/50' : 'border-coffee/15',
      )}
    >
      <legend className="sr-only">Choose a time slot</legend>
      <div className="flex items-center gap-2 font-serif text-[1.35rem] text-shadow" aria-hidden="true">
        <Clock className="size-5 text-burgundy" />
        Available times
      </div>

      {!date ? (
        <p className="grid flex-1 place-items-center rounded-2xl border border-dashed border-coffee/30 px-4 py-10 text-center text-[0.95rem] leading-relaxed text-coffee">
          Choose a weekday on the calendar to see available time slots.
        </p>
      ) : (
        SLOT_PERIODS.map((period) => {
          const periodSlots = slots.filter((slot) => slot.period === period)
          if (!periodSlots.length) return null
          return (
            <div key={period} role="group" aria-label={`${period} slots`} className="grid gap-2.5">
              <p className="type-eyebrow text-[0.68rem] text-coffee">{period}</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {periodSlots.map((slot) => {
                  const available = now ? isSlotAvailable(date, slot.value, now) : true
                  return (
                    <label key={slot.value} className="relative">
                      <input
                        type="radio"
                        name="appointment-time"
                        value={slot.value}
                        checked={value === slot.value}
                        disabled={!available}
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
                      </span>
                    </label>
                  )
                })}
              </div>
            </div>
          )
        })
      )}
    </fieldset>
  )
}
