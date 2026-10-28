'use client'

import { useId, useState } from 'react'
import { ChevronDown, LifeBuoy, Phone } from 'lucide-react'
import { crisisRegions } from '@/data/content'
import { cn } from '@/lib/utils'

export function CrisisSupport({ className }: { className?: string }) {
  const [regionId, setRegionId] = useState(crisisRegions[0].id)
  const selectId = useId()
  const region = crisisRegions.find((item) => item.id === regionId) ?? crisisRegions[0]

  return (
    <aside
      aria-labelledby={`${selectId}-title`}
      className={cn('relative overflow-hidden rounded-[1rem] border border-burgundy/25 bg-[#fbf1ec] p-6 sm:p-8', className)}
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:gap-10">
        <div className="grid content-start gap-3">
          <p className="flex items-center gap-3">
            <span className="inline-flex size-10 items-center justify-center rounded-full bg-burgundy text-paper">
              <LifeBuoy className="size-5" aria-hidden="true" />
            </span>
            <span id={`${selectId}-title`} className="font-serif text-2xl font-semibold text-shadow">
              Need urgent support?
            </span>
          </p>
          <p className="text-[0.98rem] leading-relaxed text-shadow/80">
            If you or someone else is in immediate danger, contact your local emergency service. This website and its booking form are not
            designed for crisis response.
          </p>
        </div>

        <div className="grid content-start gap-4">
          <label htmlFor={selectId} className="text-sm font-semibold text-shadow">
            Choose your country or region
          </label>
          <div className="relative">
            <select
              id={selectId}
              value={regionId}
              onChange={(event) => setRegionId(event.target.value)}
              className="h-12 w-full cursor-pointer appearance-none rounded-[0.6rem] border border-coffee/30 bg-[#fffaf1] pr-11 pl-4 text-[0.98rem] font-medium text-shadow transition-colors outline-none hover:border-burgundy/60 focus-visible:border-burgundy focus-visible:ring-[3px] focus-visible:ring-burgundy/25"
            >
              {crisisRegions.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-coffee" aria-hidden="true" />
          </div>

          <div key={region.id} aria-live="polite" className="grid animate-in gap-3 fade-in-0 slide-in-from-bottom-1 duration-500 sm:grid-cols-2">
            {region.lines.map((line) => (
              <a
                key={line.label}
                href={line.href}
                className="group grid gap-1 rounded-[0.7rem] border border-coffee/15 bg-[#fffaf1] p-4 transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-burgundy/50 hover:shadow-paper"
              >
                <span className="text-xs font-semibold tracking-[0.12em] text-coffee uppercase">{line.label}</span>
                <span className="flex items-center gap-2 font-serif text-3xl font-semibold text-burgundy">
                  <Phone className="size-4 transition-transform duration-300 group-hover:rotate-[-12deg]" aria-hidden="true" />
                  {line.number}
                </span>
                {line.note ? <span className="text-sm leading-snug text-shadow/75">{line.note}</span> : null}
              </a>
            ))}
            {region.note ? (
              <p className="rounded-[0.7rem] border border-dashed border-coffee/30 p-4 text-[0.95rem] leading-relaxed text-shadow/80 sm:col-span-2">
                {region.note}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </aside>
  )
}
