'use client'

import { Tabs } from 'radix-ui'
import { Award, BadgeCheck } from 'lucide-react'
import { psychologist } from '@/data/content'
import { cn } from '@/lib/utils'

const tabs = [
  ...psychologist.sections.map((section) => ({ id: section.id, title: section.title, icon: section.icon })),
  { id: 'credentials', title: 'Training & credentials', icon: BadgeCheck },
]

export function PsychologistTabs({ className }: { className?: string }) {
  return (
    <Tabs.Root defaultValue={tabs[0].id} className={cn('grid gap-6', className)}>
      <Tabs.List aria-label="About the psychologist" className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <Tabs.Trigger
              key={tab.id}
              value={tab.id}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-coffee/20 px-4 py-2 text-[0.88rem] font-medium text-shadow/80 transition-[background-color,color,border-color,box-shadow] duration-500 ease-(--ease-paper) hover:border-burgundy/50 hover:text-burgundy data-[state=active]:border-burgundy data-[state=active]:bg-burgundy data-[state=active]:text-paper data-[state=active]:shadow-[0_10px_20px_-12px_rgb(106_31_38/0.9)]"
            >
              <Icon className="size-4" aria-hidden="true" />
              {tab.title}
            </Tabs.Trigger>
          )
        })}
      </Tabs.List>

      {psychologist.sections.map((section) => (
        <Tabs.Content
          key={section.id}
          value={section.id}
          className="grid gap-4 text-[1.02rem] leading-[1.8] text-shadow/85 outline-none data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-bottom-2 data-[state=active]:duration-500"
        >
          <h3 className="type-h3">{section.title}</h3>
          {section.body.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
          {section.id === 'research' ? (
            <p className="inline-flex w-fit items-center gap-2 rounded-full bg-gold/25 px-4 py-1.5 text-sm font-semibold text-coffee-deep">
              <Award className="size-4 text-burgundy" aria-hidden="true" />
              Best Paper Awards at conference presentations
            </p>
          ) : null}
        </Tabs.Content>
      ))}

      <Tabs.Content
        value="credentials"
        className="grid gap-6 outline-none data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-bottom-2 data-[state=active]:duration-500 sm:grid-cols-2"
      >
        <div className="grid content-start gap-3">
          <h3 className="type-h3">Training & certifications</h3>
          <p className="text-[0.98rem] text-shadow/75">Additional training in therapeutic approaches.</p>
          <ul className="grid gap-2">
            {psychologist.training.map((item) => (
              <li key={item} className="flex items-center gap-3 text-[0.98rem] text-shadow/90">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-burgundy" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="grid content-start gap-3">
          <h3 className="type-h3">Registration & credentials</h3>
          <ul className="grid gap-3">
            {psychologist.registrations.map((item) => (
              <li key={item.region} className="rounded-[0.6rem] border border-coffee/15 bg-paper/50 px-4 py-3">
                <p className="type-eyebrow text-[0.65rem] text-coffee">{item.region}</p>
                <p className="mt-1 font-serif text-xl text-shadow">{item.credential}</p>
              </li>
            ))}
          </ul>
        </div>
      </Tabs.Content>
    </Tabs.Root>
  )
}
