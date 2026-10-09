import { Suspense } from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, CalendarDays, Clock, GraduationCap, Languages, MonitorSmartphone, ShieldCheck } from 'lucide-react'
import { doctors, getDoctor } from '@/data/doctors'
import { JsonLd } from '@/lib/seo/json-ld'
import { pageMetadata } from '@/lib/seo/metadata'
import { graph, personSchema } from '@/lib/seo/schemas'
import { MotionController } from '@/components/animations/motion-controller'
import { DoctorCard } from '@/components/doctors/doctor-card'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export function generateStaticParams() {
  return doctors.map((doctor) => ({ slug: doctor.slug }))
}

export async function generateMetadata({ params }: PageProps<'/specialists/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const doctor = getDoctor(slug)
  if (!doctor) return { title: 'Specialist not found', robots: { index: false } }
  return pageMetadata({
    title: `${doctor.name}, ${doctor.title}`,
    description: `${doctor.name} is a ${doctor.title.toLowerCase()} at Paper, Skin & Synapses with ${doctor.yearsOfExperience} years of experience in ${doctor.specialization.toLowerCase()}. ${doctor.intro}`,
    path: `/specialists/${doctor.slug}`,
    type: 'profile',
  })
}

export default function SpecialistPage({ params }: PageProps<'/specialists/[slug]'>) {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <SpecialistProfile params={params} />
    </Suspense>
  )
}

function ProfileSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading specialist profile" className="container-editorial grid gap-10 pt-40 pb-12 lg:grid-cols-12">
      <div className="aspect-[4/5] animate-pulse rounded-[2rem] bg-latte/50 lg:col-span-5" />
      <div className="grid content-center gap-5 lg:col-span-7">
        <div className="h-4 w-48 animate-pulse rounded-full bg-latte/60" />
        <div className="h-16 w-3/4 animate-pulse rounded-2xl bg-latte/60" />
        <div className="h-24 w-full animate-pulse rounded-2xl bg-latte/40" />
      </div>
    </div>
  )
}

async function SpecialistProfile({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const doctor = getDoctor(slug)
  if (!doctor) notFound()

  const others = doctors.filter((d) => d.slug !== doctor.slug).slice(0, 3)
  const firstName = doctor.name.replace(/^Dr\.\s*/, '').split(' ')[0]

  const facts = [
    { icon: CalendarDays, label: 'Consultation days', value: doctor.consultation.days },
    { icon: Clock, label: 'Hours', value: doctor.consultation.hours },
    { icon: MonitorSmartphone, label: 'Consultation modes', value: doctor.consultation.modes.join(' · ') },
    { icon: ShieldCheck, label: 'Session length', value: doctor.consultation.duration },
    { icon: Languages, label: 'Languages spoken', value: doctor.languages.join(', ') },
  ]

  return (
    <>
      <article aria-labelledby="doctor-name" className="pt-32 pb-12 sm:pt-40">
        <div className="container-editorial">
          <Breadcrumbs
            items={[
              { name: 'Home', path: '/' },
              { name: 'Our Specialists', path: '/specialists' },
              { name: doctor.name, path: `/specialists/${doctor.slug}` },
            ]}
          />

          <header className="mt-8 grid gap-14 sm:mt-10 lg:grid-cols-12 lg:gap-12">
            <div className="relative mx-auto w-full max-w-[19rem] sm:max-w-sm lg:col-span-5 lg:max-w-none">
              <div aria-hidden="true" className="latte-surface organic-edge absolute inset-x-4 -top-3 bottom-4 rotate-2" />
              <div data-hero-item className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] border border-coffee/15 bg-latte shadow-lifted sm:rounded-[2rem]">
                <Image
                  src={doctor.image.src}
                  alt={doctor.image.alt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 34vw, 92vw"
                  className="object-cover"
                />
              </div>
              <p data-hero-item aria-hidden="true" className="type-hand absolute -bottom-9 left-4 z-10 -rotate-3 text-[1.7rem] text-burgundy sm:-bottom-7 sm:left-6 sm:text-3xl">
                hello, I’m {firstName}
              </p>
            </div>

            <div className="grid content-center gap-6 lg:col-span-7">
              <p data-hero-item className="type-eyebrow text-burgundy">{doctor.specialization}</p>
              <h1 id="doctor-name" data-hero-item className="type-display-sm">
                {doctor.name}
              </h1>
              <p data-hero-item className="font-serif text-xl text-coffee-deep sm:text-2xl">{doctor.title}</p>
              <p data-hero-item className="type-lead max-w-2xl text-shadow/85">{doctor.intro}</p>
              <dl data-hero-item className="flex flex-wrap gap-3">
                <div className="rounded-full border border-coffee/25 px-4 py-2 text-sm">
                  <dt className="sr-only">Experience</dt>
                  <dd className="font-semibold">{doctor.yearsOfExperience} years’ experience</dd>
                </div>
                {doctor.specializations.map((item) => (
                  <div key={item} className="rounded-full bg-latte/70 px-4 py-2 text-sm">
                    <dt className="sr-only">Specialisation</dt>
                    <dd>{item}</dd>
                  </div>
                ))}
              </dl>
              <div data-hero-item className="flex flex-col gap-3 pt-2 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/#book">
                    Book with {firstName}
                    <ArrowRight aria-hidden="true" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/specialists">
                    <ArrowLeft aria-hidden="true" />
                    All specialists
                  </Link>
                </Button>
              </div>
            </div>
          </header>

          <div className="mt-16 grid gap-14 sm:mt-24 lg:grid-cols-12 lg:gap-12">
            <div className="grid content-start gap-14 lg:col-span-7">
              <section data-reveal aria-labelledby="bio-title" className="grid gap-5">
                <h2 id="bio-title" className="type-h3 text-[2rem]">
                  Biography
                </h2>
                {doctor.bio.map((paragraph) => (
                  <p key={paragraph.slice(0, 24)} className="text-[1.05rem] leading-relaxed text-shadow/85">
                    {paragraph}
                  </p>
                ))}
              </section>

              <section data-reveal aria-labelledby="approach-title" className="latte-surface organic-edge relative p-8 sm:p-10">
                <h2 id="approach-title" className="type-eyebrow font-sans text-coffee-deep">
                  Approach to patient care
                </h2>
                <blockquote className="mt-5 font-serif text-[1.45rem] leading-snug text-shadow sm:text-[1.7rem]">
                  “{doctor.approach}”
                </blockquote>
                <p className="type-hand mt-5 text-2xl text-burgundy">— {doctor.name}</p>
              </section>

              <section data-reveal aria-labelledby="expertise-title" className="grid gap-5">
                <h2 id="expertise-title" className="type-h3 text-[2rem]">
                  Areas of expertise
                </h2>
                <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
                  {doctor.expertise.map((item) => (
                    <li key={item} className="flex items-start gap-3 border-b border-coffee/15 pb-3 text-[1.02rem]">
                      <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-burgundy" />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              <section data-reveal aria-labelledby="experience-title" className="grid gap-5">
                <h2 id="experience-title" className="type-h3 text-[2rem]">
                  Professional experience
                </h2>
                <ol className="grid gap-0 border-l border-coffee/25">
                  {doctor.experience.map((entry) => (
                    <li key={entry.role + entry.period} className="relative grid gap-1 pb-7 pl-7 last:pb-0">
                      <span aria-hidden="true" className="absolute top-1.5 -left-[5px] size-2.5 rounded-full bg-burgundy" />
                      <p className="text-sm font-semibold text-coffee tabular-nums">{entry.period}</p>
                      <h3 className="font-serif text-xl">{entry.role}</h3>
                      <p className="text-shadow/80">{entry.organisation}</p>
                    </li>
                  ))}
                </ol>
              </section>
            </div>

            <aside className="grid content-start gap-8 lg:sticky lg:top-28 lg:col-span-5 lg:self-start" aria-label={`${doctor.name} at a glance`}>
              <section data-reveal aria-labelledby="availability-title" className="paper-surface rounded-[1.75rem] border border-coffee/15 p-7 sm:p-8">
                <h2 id="availability-title" className="type-h3">
                  Consultation information
                </h2>
                <dl className="mt-6 grid gap-5">
                  {facts.map(({ icon: Icon, label, value }) => (
                    <div key={label} className="grid grid-cols-[2.25rem_1fr] gap-3">
                      <Icon className="mt-0.5 size-5 text-burgundy" aria-hidden="true" />
                      <div>
                        <dt className="text-xs font-semibold tracking-wide text-coffee uppercase">{label}</dt>
                        <dd className="mt-1 text-[0.98rem] text-shadow">{value}</dd>
                      </div>
                    </div>
                  ))}
                </dl>
                <Separator className="my-6 bg-coffee/15" />
                <p className="text-sm leading-relaxed text-shadow/80">{doctor.consultation.note}</p>
                <Button asChild className="mt-6 w-full" size="lg">
                  <Link href="/#book">Request a consultation</Link>
                </Button>
              </section>

              <section data-reveal aria-labelledby="education-title" className="grid gap-5">
                <h2 id="education-title" className="flex items-center gap-3 type-h3">
                  <GraduationCap className="size-6 text-burgundy" aria-hidden="true" />
                  Education
                </h2>
                <ul className="grid gap-4">
                  {doctor.education.map((entry) => (
                    <li key={entry.degree} className="grid gap-0.5">
                      <p className="font-semibold">{entry.degree}</p>
                      <p className="text-sm text-coffee-deep">
                        {entry.institution} · {entry.year}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>

              <section data-reveal aria-labelledby="qualifications-title" className="grid gap-5">
                <h2 id="qualifications-title" className="type-h3">
                  Qualifications
                </h2>
                <ul className="grid gap-3">
                  {doctor.qualifications.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[0.98rem]">
                      <ShieldCheck className="mt-0.5 size-4 shrink-0 text-burgundy" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            </aside>
          </div>
        </div>
      </article>

      <section aria-labelledby="others-title" className="py-20">
        <div className="container-editorial">
          <h2 id="others-title" data-reveal className="type-h2">
            Other specialists
          </h2>
          <ul data-reveal-group className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {others.map((other) => (
              <li key={other.slug} data-reveal-item>
                <DoctorCard doctor={other} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <JsonLd data={graph(personSchema(doctor))} />
      <MotionController />
    </>
  )
}
