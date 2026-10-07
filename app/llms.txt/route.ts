import { concerns, faqs, services } from '@/data/content'
import { doctors } from '@/data/doctors'
import { absoluteUrl, fullAddress, siteConfig } from '@/lib/site'

export function GET() {
  const body = [
    `# ${siteConfig.name}`,
    '',
    `> ${siteConfig.description}`,
    '',
    '## Organisation',
    `- Type: Psychology and mental health hospital (outpatient psychological care)`,
    `- Address: ${fullAddress()}`,
    `- Phone: ${siteConfig.phone}`,
    `- Email: ${siteConfig.email}`,
    `- Hours: ${siteConfig.hoursLabel}`,
    `- Languages: ${siteConfig.languages.join(', ')}`,
    `- Not an emergency service. Emergencies: ${siteConfig.crisis.emergency}. 24x7 helpline: Tele-MANAS ${siteConfig.crisis.number}.`,
    '',
    '## Booking',
    `- Book online: ${absoluteUrl('/#book')} — choose a preferred date (Mon–Sat, up to 90 days ahead), then enter name, address, concern, phone and optional email, review, and select "Contact Us". The team confirms a time within one working day.`,
    '',
    '## Services',
    ...services.map((service) => `- ${service.title}: ${service.summary} (For: ${service.forWhom})`),
    '',
    '## Areas of psychological support',
    ...concerns.map((concern) => `- ${concern.title}: ${concern.summary}`),
    '',
    '## Specialists',
    ...doctors.map(
      (doctor) =>
        `- [${doctor.name}](${absoluteUrl(`/specialists/${doctor.slug}`)}): ${doctor.title}. ${doctor.yearsOfExperience} years' experience. Languages: ${doctor.languages.join(', ')}.`,
    ),
    '',
    '## FAQ',
    ...faqs.flatMap((faq) => [`### ${faq.question}`, faq.answer, '']),
  ].join('\n')

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  })
}
