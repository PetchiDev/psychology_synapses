'use client'

import { Plus, X } from 'lucide-react'
import type { Settings } from '@/lib/cms/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type Breaks = Settings['breaks']

const DAYS: { weekday: number; label: string }[] = [
  { weekday: 1, label: 'Monday' },
  { weekday: 2, label: 'Tuesday' },
  { weekday: 3, label: 'Wednesday' },
  { weekday: 4, label: 'Thursday' },
  { weekday: 5, label: 'Friday' },
  { weekday: 6, label: 'Saturday' },
  { weekday: 0, label: 'Sunday' },
]

/** Daily breaks (e.g. lunch): times inside a break are never offered for booking. */
export function BreaksEditor({ value, onChange, disabled }: { value: Breaks; onChange: (next: Breaks) => void; disabled?: boolean }) {
  const set = (weekday: number, ranges: [string, string][]) => {
    const next = { ...value }
    if (ranges.length) next[weekday] = ranges
    else delete next[weekday]
    onChange(next)
  }

  return (
    <ul className="grid divide-y divide-coffee/10 rounded-[0.8rem] border border-coffee/15">
      {DAYS.map(({ weekday, label }) => {
        const ranges = value[weekday] ?? []
        return (
          <li key={weekday} className="grid gap-2 px-4 py-3 sm:grid-cols-[7rem_1fr] sm:items-start">
            <span className="pt-2 text-sm font-medium text-shadow">{label}</span>
            <div className="grid gap-2">
              {ranges.map(([start, end], i) => (
                <div key={i} className="flex flex-wrap items-center gap-2">
                  <Input
                    type="time"
                    aria-label={`${label} break ${i + 1} start`}
                    className="w-32"
                    value={start}
                    disabled={disabled}
                    onChange={(e) => set(weekday, ranges.map((r, j) => (j === i ? [e.target.value, r[1]] : r)))}
                  />
                  <span className="text-coffee">to</span>
                  <Input
                    type="time"
                    aria-label={`${label} break ${i + 1} end`}
                    className="w-32"
                    value={end}
                    disabled={disabled}
                    onChange={(e) => set(weekday, ranges.map((r, j) => (j === i ? [r[0], e.target.value] : r)))}
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    aria-label={`Remove ${label} break ${i + 1}`}
                    disabled={disabled}
                    onClick={() => set(weekday, ranges.filter((_, j) => j !== i))}
                  >
                    <X className="size-4" aria-hidden="true" />
                  </Button>
                  {!start || !end ? (
                    <span className="text-sm text-burgundy">Enter both times.</span>
                  ) : start >= end ? (
                    <span className="text-sm text-burgundy">End must be after start.</span>
                  ) : null}
                </div>
              ))}
              <div className="flex flex-wrap items-center gap-3">
                {ranges.length ? null : <span className="pt-0.5 text-sm text-coffee">No break</span>}
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={disabled}
                  onClick={() => set(weekday, [...ranges, ['13:00', '14:00']])}
                >
                  <Plus aria-hidden="true" />
                  Add break
                </Button>
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

const TIME = /^\d{2}:\d{2}(:\d{2})?$/

/** True when every break has both times and starts before it ends. */
export const breaksAreValid = (breaks: Breaks) =>
  Object.values(breaks).every((ranges) => ranges.every(([start, end]) => TIME.test(start) && TIME.test(end) && start < end))
