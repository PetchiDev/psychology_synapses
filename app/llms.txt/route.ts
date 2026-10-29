import { faqs, libraryChapters, psychologist, workAreas } from '@/data/content'
import { absoluteUrl, siteConfig } from '@/lib/site'

export const dynamic = 'force-static'

export function GET() {
  const body = [
    `# ${siteConfig.name}`,
    '',
    `> ${siteConfig.description}`,
    '',
    '## Practice',
    `- Psychologist: ${siteConfig.psychologist.name}`,
    `- Qualifications: ${psychologist.degrees.map((degree) => `${degree.award} (${degree.place})`).join('; ')}`,
    `- Registration: ${psychologist.registrations.map((item) => `${item.credential}, ${item.region}`).join('; ')}`,
    `- Areas: ${siteConfig.disciplines.join(', ')}`,
    `- Psychology since ${siteConfig.foundingYear}`,
    `- ${siteConfig.modeNote}`,
    `- Availability: ${siteConfig.hoursLabel}`,
    `- Email: ${siteConfig.email}`,
    `- Phone: ${siteConfig.phone}`,
    '- Not an emergency service. In India call 112 for emergencies or Tele-MANAS on 14416 for 24/7 mental-health support.',
    '',
    '## Booking',
    `- Book online: ${absoluteUrl('/contact#book')}. Choose an enquiry type, select a date and time (Monday to Friday), share a short description and contact details, then review and send.`,
    '',
    '## Ways to work with me',
    ...workAreas.map((area) => `- [${area.title}](${absoluteUrl(`/work-with-me#${area.slug}`)}): ${area.summary}`),
    '',
    '## Library',
    ...libraryChapters.map((chapter) => `- ${chapter.title}: ${chapter.summary}`),
    '',
    '## FAQ',
    ...faqs.flatMap((faq) => [`### ${faq.question}`, ...faq.answer, '']),
  ].join('\n')

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  })
}
