import { siteConfig } from '@/lib/site'

export interface LegalPage {
  slug: string
  title: string
  summary: string
  sections: { heading: string; body: string[] }[]
}

const contact = `If you have a question about this page, email ${siteConfig.email}.`

export const legalPages: LegalPage[] = [
  {
    slug: 'privacy',
    title: 'Privacy policy',
    summary: 'How information shared through this website is collected, used and protected.',
    sections: [
      {
        heading: 'What is collected',
        body: [
          'When you send an enquiry, the form collects the details you choose to share: your name, email address, optional phone number and organisation, the type of enquiry, your preferred date and time, and your message.',
          'The website does not ask for health records, identity documents or payment details.',
        ],
      },
      {
        heading: 'How it is used',
        body: [
          'Your details are used only to respond to your enquiry, arrange an online conversation and follow up on the next steps you agree to.',
          'Your information is never sold, rented or shared for marketing.',
        ],
      },
      {
        heading: 'How it is sent and stored',
        body: [
          'Enquiries are delivered by email through a third-party email service (EmailJS). Nothing you type into the form is saved in your browser, and the form is cleared once it is sent.',
          'Emails are kept only for as long as they are needed to respond to you and to keep reasonable records of professional work.',
        ],
      },
      {
        heading: 'Your choices',
        body: [
          'You can ask to see, correct or delete the information you have shared at any time by writing to the email address below.',
          contact,
        ],
      },
    ],
  },
  {
    slug: 'terms',
    title: 'Terms of use',
    summary: 'The terms that apply when you use this website and its resources.',
    sections: [
      {
        heading: 'Using this website',
        body: [
          `By using this website you agree to these terms. The content is provided by ${siteConfig.name} for general information and education.`,
        ],
      },
      {
        heading: 'Library content',
        body: [
          'Articles, stories, explainers and tools in the Library may be read and shared for personal, non-commercial use with credit to the source. Please ask before republishing or adapting them.',
        ],
      },
      {
        heading: 'Enquiries and bookings',
        body: [
          'Sending an enquiry or selecting a slot is a request, not a confirmed appointment. A time is confirmed only once you receive a reply by email.',
          'The scope, timelines and any fees for paid work are agreed separately before the work begins.',
        ],
      },
      {
        heading: 'Changes',
        body: ['These terms may be updated from time to time. The current version is always available on this page.', contact],
      },
    ],
  },
  {
    slug: 'disclaimer',
    title: 'Website disclaimer',
    summary: 'What the information on this website is, and what it is not.',
    sections: [
      {
        heading: 'General information only',
        body: [
          'The content on this website, including the Library, is for general information and education. It is not a diagnosis, treatment or a substitute for individual professional advice.',
        ],
      },
      {
        heading: 'Not an emergency service',
        body: [
          'This website and its booking form are not monitored for emergencies and are not designed for crisis response. If you or someone else is in immediate danger, contact your local emergency service. In India, call 112, or Tele-MANAS on 14416 for mental-health support at any hour.',
        ],
      },
      {
        heading: 'Exercises and tools',
        body: [
          'Breathing exercises and other practical tools are offered as something you can choose to try. They are not a treatment and may not suit everyone. Stop if anything feels uncomfortable.',
        ],
      },
      {
        heading: 'External links',
        body: ['Links to other websites are provided for convenience. Their content and privacy practices are their own.', contact],
      },
    ],
  },
  {
    slug: 'disclosures',
    title: 'Professional disclosures',
    summary: 'Registration, scope of practice and how work is carried out.',
    sections: [
      {
        heading: 'Registration and licensing',
        body: ['India: registered with the National Commission for Allied and Healthcare Professions (NCAHP).', 'Dubai, UAE: licensed by the Dubai Health Authority (DHA).'],
      },
      {
        heading: 'Scope of practice',
        body: [
          'Individual counselling and clinical work are offered within my scope of practice and current areas of expertise. If your concerns fall outside that scope, I will let you know and, where possible, guide you towards a more suitable professional.',
        ],
      },
      {
        heading: 'Format and availability',
        body: [
          `${siteConfig.modeNote} Availability is ${siteConfig.hoursLabel}. I take on a limited number of counselling clients at a time.`,
        ],
      },
      {
        heading: 'Fees',
        body: [
          'Individual counselling is currently offered at no cost. Organisational programmes, talks and research-related work are paid, and fees are agreed during the enquiry process.',
          contact,
        ],
      },
    ],
  },
]

export const getLegalPage = (slug: string) => legalPages.find((page) => page.slug === slug)
