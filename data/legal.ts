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
    summary: 'What happens to the information you share when you book or get in touch, and the choices you have.',
    sections: [
      {
        heading: 'Who looks after your information',
        body: [
          `${siteConfig.name} is run by ${siteConfig.psychologist.name}, who decides how the information on this website is used and is responsible for it. You can reach her at ${siteConfig.email}.`,
        ],
      },
      {
        heading: 'What is collected',
        body: [
          'When you book, the form collects the details you choose to share: your name, email address, optional phone number and organisation, the type of enquiry, the date and time you pick, and your message. If you later move or cancel a booking, the new time or the reason you give is recorded too.',
          'Your message may include personal or sensitive details. Share only what you are comfortable with; a sentence or two is enough, and you can say more when we speak.',
          'The website does not ask for health records, identity documents or payment details.',
        ],
      },
      {
        heading: 'How it is used',
        body: [
          'Your details are used only to arrange and manage your booking and to respond to you: to hold the slot you choose, to let me confirm or decline it, to send you a private link where you can view, move or cancel it, and to follow up on the next steps you agree to.',
          'Your information is never sold, rented or shared for marketing.',
        ],
      },
      {
        heading: 'Where it is stored and who can see it',
        body: [
          'Bookings are saved in the practice’s own booking system, which runs on a secure server provided by Hostinger. Information travels to it over an encrypted (HTTPS) connection.',
          'The booking system sends the emails about your booking: one to me so I can confirm or decline it, and one to you with your private link. Your booking details are used by me alone. The people who maintain the website’s systems can access them only when needed to keep the booking system working. They are not shared with anyone else unless the law requires it.',
          'Your private booking link works like a key, so please do not share it.',
        ],
      },
      {
        heading: 'How long it is kept',
        body: [
          'Booking details are kept only for as long as they are needed to arrange and manage your booking, and to keep the records that professional practice and the law require. After that they are deleted.',
        ],
      },
      {
        heading: 'Cookies and tracking',
        body: [
          'This website does not use cookies, analytics or advertising trackers. Nothing you type into the booking form is saved in your browser.',
        ],
      },
      {
        heading: 'Your rights',
        body: [
          'Depending on where you live, laws such as India’s Digital Personal Data Protection Act, 2023 and the UAE’s Personal Data Protection Law (Federal Decree-Law No. 45 of 2021) give you rights over your personal information. You can ask to see the information held about you, to correct it, or to have it deleted, and you can withdraw your consent at any time.',
          `To use any of these rights, or to raise a concern, email ${siteConfig.email}. Withdrawing consent does not affect anything done before you withdrew it, and some records may need to be kept where the law requires.`,
        ],
      },
      {
        heading: 'Young people',
        body: [
          'The booking form is meant for adults. If you are enquiring on behalf of someone under 18, a parent or guardian should get in touch.',
        ],
      },
      {
        heading: 'Changes to this policy',
        body: ['If this policy changes, the new version will be posted on this page. Last updated: 28 October 2026.', contact],
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
