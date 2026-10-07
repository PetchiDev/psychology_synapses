import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Languages } from 'lucide-react'
import type { Doctor } from '@/data/doctors'
import { cn } from '@/lib/utils'

interface DoctorCardProps {
  doctor: Doctor
  headingLevel?: 'h2' | 'h3'
  className?: string
}

export function DoctorCard({ doctor, headingLevel: Heading = 'h3', className }: DoctorCardProps) {
  return (
    <article
      data-hover-lift
      className={cn(
        'group paper-surface relative isolate flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-coffee/15',
        className,
      )}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-latte">
        <Image
          data-hover-media
          src={doctor.image.src}
          alt={doctor.image.alt}
          fill
          sizes="(min-width: 1280px) 26rem, (min-width: 640px) 45vw, 92vw"
          className="object-cover"
        />
        <span className="absolute top-4 left-4 rounded-full bg-paper/90 px-3 py-1 text-xs font-semibold text-shadow backdrop-blur-sm">
          {doctor.yearsOfExperience} years’ experience
        </span>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-shadow/90 via-shadow/55 to-transparent px-6 pt-20 pb-6">
          <Heading className="type-h3 text-paper">{doctor.name}</Heading>
          <p className="mt-1.5 text-sm font-medium text-paper/80">{doctor.title}</p>
          <p aria-hidden="true" className="hover-hint mt-4 items-center gap-1.5 text-xs font-semibold tracking-[0.14em] text-latte uppercase">
            Hover for details
            <ArrowUpRight className="size-3.5" />
          </p>
        </div>
      </div>

      <div className="hover-panel flex flex-1 flex-col gap-3 p-6 sm:p-7 doctor-panel">
        <p className="type-eyebrow text-[0.68rem] leading-snug text-burgundy">{doctor.specialization}</p>
        <p aria-hidden="true" className="hover-panel-only font-serif text-[1.35rem] leading-tight text-shadow">
          {doctor.name}
        </p>
        <p className="text-[0.95rem] leading-relaxed text-shadow/80">{doctor.intro}</p>
        <p className="flex items-center gap-2 text-sm text-coffee-deep">
          <Languages className="size-4 shrink-0 text-burgundy" aria-hidden="true" />
          <span className="sr-only">Languages:</span>
          {doctor.languages.join(' · ')}
        </p>
        <p aria-hidden="true" className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-semibold text-burgundy">
          View profile
          <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </p>
      </div>

      <Link
        href={`/specialists/${doctor.slug}`}
        aria-label={`View profile of ${doctor.name}, ${doctor.title}`}
        className="absolute inset-0 z-20 rounded-[1.75rem] outline-none focus-visible:ring-[3px] focus-visible:ring-burgundy/50 focus-visible:ring-inset"
      />
    </article>
  )
}
