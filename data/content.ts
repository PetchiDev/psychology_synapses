import type { LucideIcon } from 'lucide-react'
import {
  BookOpen,
  BookOpenText,
  Building2,
  Compass,
  Feather,
  FlaskConical,
  GraduationCap,
  Lightbulb,
  Megaphone,
  MessageCircle,
  NotebookPen,
  ScrollText,
  Sparkles,
  Users,
  Wrench,
} from 'lucide-react'
import { siteConfig } from '@/lib/site'

export interface Feature {
  title: string
  description: string
  icon: LucideIcon
}

export const features: Feature[] = [
  {
    title: 'People and their experiences',
    description: 'Psychology applied to the questions, difficulties and experiences people bring from everyday life.',
    icon: Users,
  },
  {
    title: 'People in their environments',
    description: 'Work with organisations, workplaces, schools and colleges to address their particular needs.',
    icon: Building2,
  },
  {
    title: 'Psychology made accessible',
    description: 'Talks, articles, learning resources and programmes that make psychological ideas easier to understand and use.',
    icon: Lightbulb,
  },
  {
    title: 'Research and collaboration',
    description: 'Opportunities to work together on research papers, publications, conferences and related academic projects.',
    icon: FlaskConical,
  },
]

export type EnquiryType = 'individual' | 'organisation' | 'talk' | 'research' | 'other'

export const enquiryTypes: { value: EnquiryType; label: string; hint: string; icon: LucideIcon }[] = [
  { value: 'individual', label: 'Individual counselling', hint: 'Personal support at your own pace', icon: MessageCircle },
  { value: 'organisation', label: 'Organisation or institution programme', hint: 'Workplaces, schools and colleges', icon: Building2 },
  { value: 'talk', label: 'Psychoeducation, talk or workshop', hint: 'Events, lectures and sessions', icon: Megaphone },
  { value: 'research', label: 'Research, publication or conference collaboration', hint: 'Papers, projects and academic work', icon: FlaskConical },
  { value: 'other', label: 'Other enquiry', hint: 'Not sure where it fits? Start here', icon: Compass },
]

export const enquiryLabel = (value?: string) => enquiryTypes.find((type) => type.value === value)?.label ?? ''

export interface WorkArea {
  slug: string
  number: string
  title: string
  summary: string
  cta: string
  enquiry: EnquiryType
  forWhom: string
  caption: string
  icon: LucideIcon
  image: { src: string; alt: string }
  detail: {
    intro: string
    involves: string[]
    suits: string
    enquire: string
  }
}

export const workAreas: WorkArea[] = [
  {
    slug: 'individual-counselling',
    number: '01',
    title: 'Individual Counselling',
    summary:
      'A space to talk through personal experiences, concerns and questions at your own pace. Learn how counselling works, who it may suit and how to enquire.',
    cta: 'Explore Individual Counselling',
    enquiry: 'individual',
    forWhom: 'Adults, online',
    caption: 'an open page, and time to think it through',
    icon: MessageCircle,
    image: { src: '/images/work/individual-counselling.jpg', alt: 'An open leather journal and fountain pen beside two cups of tea in soft morning light' },
    detail: {
      intro:
        'Counselling offers time and space to talk through what is on your mind, with someone who listens carefully and works with you at a pace that feels manageable.',
      involves: [
        'An initial online briefing call to understand what you are looking for',
        'A conversation about whether my current areas of expertise are a suitable fit',
        'Regular online sessions, planned around your availability',
        'Guidance towards a more suitable professional if your concerns fall outside my scope',
      ],
      suits:
        'Adults who would like to talk through personal experiences, everyday difficulties, questions about themselves or a situation they are finding hard to make sense of.',
      enquire:
        'Choose “Individual counselling” in the booking calendar, select a slot and share a few lines about what you have in mind. Individual counselling is currently offered at no cost, and I take on a limited number of clients at a time.',
    },
  },
  {
    slug: 'organisations',
    number: '02',
    title: 'Organisations, Schools & Colleges',
    summary:
      'Psychology-based consulting, workshops, group sessions, training and custom mental-health modules designed around the needs of a workplace or educational institution.',
    cta: 'Discuss a Programme',
    enquiry: 'organisation',
    forWhom: 'Workplaces, schools & colleges',
    caption: 'programmes shaped around your people',
    icon: Building2,
    image: { src: '/images/work/organisations.jpg', alt: 'A workshop table set with notebooks and coffee in front of a whiteboard of planning notes' },
    detail: {
      intro:
        'Every organisation has its own people, pressures and goals. Programmes are shaped around those needs rather than taken off a shelf.',
      involves: [
        'Psychology-based consulting for workplaces and institutions',
        'Workshops, group sessions and training',
        'Custom mental-health modules and programme development',
        'Wellbeing and learning initiatives for staff or students',
      ],
      suits: 'HR and people teams, school and college leadership, student wellbeing teams and organisations planning wellbeing or learning initiatives.',
      enquire:
        'Share your organisation’s goals, audience and requirements. We can then discuss the format, topics, scope, timelines and fees of a suitable programme.',
    },
  },
  {
    slug: 'talks',
    number: '03',
    title: 'Psychoeducation, Talks & Workshops',
    summary:
      'Talks and learning sessions for universities, schools, organisations, conferences and other audiences. Topics and formats can be discussed according to the event and its audience.',
    cta: 'Invite Me to Speak',
    enquiry: 'talk',
    forWhom: 'Universities, events & conferences',
    caption: 'psychological ideas, made easier to use',
    icon: Megaphone,
    image: { src: '/images/work/talks.jpg', alt: 'A wooden lectern with a microphone and open notes facing an audience in a lit auditorium' },
    detail: {
      intro: 'Psychological ideas are most useful when people can understand them and see where they fit in their own lives.',
      involves: [
        'Talks and guest lectures',
        'Seminars and interactive workshops',
        'Psychoeducation sessions on mental health topics',
        'Formats adapted to the audience, event and time available',
      ],
      suits: 'Universities, schools, colleges, organisations, conferences and community groups.',
      enquire: 'Include the event details, intended audience, area of interest and proposed date in your enquiry.',
    },
  },
  {
    slug: 'research',
    number: '04',
    title: 'Research, Publications & Collaborations',
    summary:
      'For researchers, students and professionals interested in discussing research projects, paper collaborations, publications, conference contributions or other academic work.',
    cta: 'Discuss a Collaboration',
    enquiry: 'research',
    forWhom: 'Researchers, students & professionals',
    caption: 'bringing research and practice closer together',
    icon: FlaskConical,
    image: { src: '/images/work/research.jpg', alt: 'An open book, handwritten notes and fountain pens on a wooden desk beside a stack of bound volumes' },
    detail: {
      intro: 'Research has been an important part of my academic journey, and I remain interested in work that brings research and practice closer together.',
      involves: [
        'Research projects and paper collaborations',
        'Publications and academic writing',
        'Conference contributions',
        'Other academic projects in psychology',
      ],
      suits: 'Researchers, students and professionals working on psychological questions.',
      enquire: 'Share the research area, the current stage of the project and the kind of collaboration you have in mind.',
    },
  },
]

export const libraryCard = {
  title: 'The Library',
  summary:
    'A growing collection of articles, stories, psychology explainers, reflections, awareness content and practical tools readers can explore at their own pace.',
  cta: 'Enter the Library',
  image: { src: '/images/work/library.jpg', alt: 'A candle burning beside an open book on a desk in front of shelves of old leather-bound books' },
}

export interface LibraryChapter {
  slug: string
  title: string
  summary: string
  contents: string[]
  icon: LucideIcon
}

export const libraryChapters: LibraryChapter[] = [
  {
    slug: 'articles',
    title: 'Articles',
    summary: 'Longer reads on psychological ideas, everyday questions and what research has to say about them.',
    contents: ['Psychology in everyday life', 'Work, learning and wellbeing', 'Notes from research'],
    icon: BookOpenText,
  },
  {
    slug: 'stories',
    title: 'Stories',
    summary: 'Short stories about people, minds and the small moments that shape how we think, feel and behave.',
    contents: ['Short fiction', 'Character studies', 'Stories with a question at their heart'],
    icon: Feather,
  },
  {
    slug: 'explainers',
    title: 'Psychology Explainers',
    summary: 'Clear explanations of concepts, terms and theories, written for curious readers rather than textbooks.',
    contents: ['Key ideas, simply put', 'Common terms explained', 'Myths and what we actually know'],
    icon: GraduationCap,
  },
  {
    slug: 'reflections',
    title: 'Reflections',
    summary: 'Personal reflections on learning psychology, working with people and staying curious about the mind.',
    contents: ['Lessons from study and practice', 'Questions worth sitting with', 'Thoughts on curiosity'],
    icon: NotebookPen,
  },
  {
    slug: 'awareness',
    title: 'Awareness',
    summary: 'Awareness content on mental health topics, so that understanding comes a little earlier and a little easier.',
    contents: ['Mental health topics explained', 'Recognising common experiences', 'Where to find support'],
    icon: Sparkles,
  },
  {
    slug: 'tools',
    title: 'Practical Tools',
    summary: 'Simple exercises and resources you can try in your own time, such as the breathing exercise on this site.',
    contents: ['Breathing and grounding exercises', 'Reflective prompts', 'Printable worksheets'],
    icon: Wrench,
  },
]

export const psychologist = {
  intro: [
    'Paper Skin & Synapses is built around different areas of psychology, from clinical settings and individual counselling to organisational consulting, psychoeducation and research. My expertise has taken me through organisational psychology and business, and clinical psychology, giving me opportunities to explore how psychological knowledge can be understood and applied in different contexts.',
    'Paper Skin & Synapses grew from that interest. It brings these directions together through individual work, organisational programmes, psychoeducation, talks, research collaborations and a library of resources for curious readers.',
  ],
  portrait: {
    src: '/images/portrait/psychologist.jpg',
    alt: `${siteConfig.psychologist.name}, ${siteConfig.psychologist.role.toLowerCase()} at ${siteConfig.name}, smiling and seated at a table`,
  },
  sections: [
    {
      id: 'foundation',
      title: 'The foundation',
      icon: GraduationCap,
      body: [
        'My credibility has been built through different areas of psychology, from understanding human behaviour to exploring its application in clinical and organisational settings. I hold a BSc in Psychology from India, an MSc in Organisational Psychology and Business from the University of Leeds, UK, and postgraduate study in Clinical Psychology in India.',
        'Together, these experiences have shaped my interest in how people think, feel and behave, and how psychological knowledge can be applied across different parts of life.',
      ],
    },
    {
      id: 'work',
      title: 'The work behind the interest',
      icon: BookOpen,
      body: [
        'My experience spans HR and organisational settings, clinical environments, mental health programme development, workshops, individual counselling and research. I have worked with psychological ideas in different contexts, from workplace wellbeing and learning initiatives to individual concerns and clinical practice.',
        'These experiences continue to inform my approach to developing relevant mental health programmes, communicating psychological concepts and contributing to work that brings research and practice closer together.',
      ],
    },
    {
      id: 'research',
      title: 'Research & recognition',
      icon: ScrollText,
      body: [
        'Research has been an important part of my academic journey. I have contributed to research papers and presented at national and international conferences, including work recognised with Best Paper Awards. I remain interested in research, academic writing and collaborations that create opportunities to explore psychological questions more deeply.',
      ],
    },
  ],
  degrees: [
    { award: 'BSc Psychology', place: 'India' },
    { award: 'MSc Organisational Psychology and Business', place: 'University of Leeds, UK' },
    { award: 'Postgraduate study, Clinical Psychology', place: 'India' },
  ],
  training: ['Cognitive Behavioural Therapy (CBT)', 'Gestalt therapy', 'Dialectical Behaviour Therapy (DBT)'],
  registrations: [
    { region: 'India', credential: 'NCAHP registered' },
    { region: 'Dubai, UAE', credential: 'DHA licensed' },
  ],
  story: [
    'Psychology wasn’t something I had planned my life around. When I first encountered it in high school, it was simply one subject among several, unfamiliar and something I was still figuring out. I had no idea then that it would eventually become such a significant part of my life.',
    'Somewhere along the way, an unexpected source of inspiration came along: Patrick Jane from The Mentalist. The way he observed people, picked up on little details and tried to understand what lay beneath their behaviour sparked a curiosity in me. I began to look at people a little differently, wondering what shaped their thoughts, actions and the ways they experienced the world.',
    'That curiosity took me into an undergraduate degree in Psychology, followed by a postgraduate degree in Organisational Psychology and Business, and then another postgraduate journey in Clinical Psychology. With every step, I discovered another side of a subject I had once barely known. I explored people in workplaces and organisations, individual experiences and psychological disorders, research, and the many ways knowledge about the mind could be shared and applied.',
    'The more I learnt, the less I wanted to confine myself to just one area. Psychology kept opening new doors, and I wanted to keep walking through them.',
    'Paper Skin & Synapses grew out of that journey. It brings together my interests in individual counselling, clinical work within my scope of practice, organisational consulting, workshops, talks, research collaborations and a library of stories, reflections and practical resources. Each represents a different way of engaging with psychology, and each has a place here.',
    'What began as an unfamiliar school subject gradually became my field of study, my work and a purpose I continue to discover. I am still learning, still asking questions and still finding new reasons to be curious about people. Paper Skin & Synapses is where I bring those parts of my journey together.',
  ],
}

export interface ProcessStep {
  title: string
  description: string
}

export const processSteps: ProcessStep[] = [
  {
    title: 'Tell me what you have in mind',
    description: 'Choose the type of work you’re enquiring about and share a brief description of what you need.',
  },
  { title: 'Choose a convenient slot', description: 'Select an available date and time from the calendar.' },
  {
    title: 'Meet online to discuss the details',
    description:
      'We’ll use an initial online conversation to understand your requirements, answer questions and discuss whether the proposed work is a suitable fit.',
  },
  {
    title: 'Agree on the way forward',
    description: 'Depending on the enquiry, we can discuss next steps, the proposed scope of work, timelines and any applicable fees.',
  },
]

export interface Faq {
  question: string
  answer: string[]
}

export const faqs: Faq[] = [
  {
    question: 'What can I contact Paper Skin & Synapses about?',
    answer: [
      'You can enquire about individual counselling, organisational consulting, mental-health programmes for schools and workplaces, talks, workshops, psychoeducation, research collaborations and related projects. The best starting point is to choose the category closest to what you need.',
    ],
  },
  {
    question: 'Can an organisation book a customised programme?',
    answer: [
      'Yes. You can share your organisation’s goals, audience and requirements. We can then discuss the format, topics, scope and feasibility of a suitable programme.',
    ],
  },
  {
    question: 'Can I invite you to speak at a university, conference or event?',
    answer: [
      'Yes. You can enquire about talks, guest lectures, seminars and psychoeducation sessions. Include the event details, intended audience, area of interest and proposed date in your enquiry.',
    ],
  },
  {
    question: 'Can we collaborate on a research paper or publication?',
    answer: [
      'You can enquire about research projects, papers, publications, conference contributions and other academic collaborations. Share the research area, current stage of the project and the kind of collaboration you have in mind.',
    ],
  },
  {
    question: 'How do I book or enquire about your work?',
    answer: [
      'Use the booking calendar, select the relevant enquiry type, choose a suitable slot and share your contact details. You will receive follow-up about the enquiry and the next steps. Alternatively, you can contact me with the details by email or give me a quick call.',
    ],
  },
  {
    question: 'Is the practice online or do you have a physical location?',
    answer: ['The practice is currently online. Information about in-person options will be added when a physical setup becomes available.'],
  },
  {
    question: 'How much do your services cost?',
    answer: [
      'Fees depend on the type and scope of work. Individual counselling is currently offered at no cost. Other work, including organisational programmes, talks and research-related projects, is paid and can be discussed during the enquiry process.',
    ],
  },
  {
    question: 'What can I find in the Library?',
    answer: [
      'The Library brings together psychology articles, stories, reflections, awareness content and practical tools. Some resources are intended for everyday use, and the collection will continue to grow over time.',
    ],
  },
  {
    question: 'What happens after I book an enquiry?',
    answer: [
      'Your first session will be a briefing call where we discuss what you are looking for, your concerns or ideas, and how we might proceed.',
      'For individual counselling, we’ll use this conversation to understand your needs, discuss whether my current areas of expertise are a suitable fit, and explore availability and the possibility of future sessions. I currently take on a limited number of counselling clients so that I can be mindful of the time and attention each person requires.',
      'If your concerns fall outside my current scope of expertise, I’ll let you know and, where possible, guide you towards a more suitable professional. This helps ensure that you receive support that is appropriate for your needs.',
      'For organisational consulting, workshops, talks, psychoeducation, or research and publication collaborations, the briefing call will focus on understanding your requirements, discussing the scope of the work, and agreeing on the next steps.',
      'The aim is to make the process clear from the beginning, so we can decide together how best to move forward.',
    ],
  },
]

export interface CrisisLine {
  label: string
  number: string
  href?: string
  note?: string
}

export interface CrisisRegion {
  id: string
  name: string
  lines: CrisisLine[]
  note?: string
}

export const crisisRegions: CrisisRegion[] = [
  {
    id: 'in',
    name: 'India',
    lines: [
      { label: 'Emergency', number: '112', href: 'tel:112', note: 'General emergency response' },
      { label: 'Tele-MANAS', number: '14416', href: 'tel:14416', note: 'Mental-health support, free and available 24/7' },
    ],
  },
  {
    id: 'uk',
    name: 'United Kingdom',
    lines: [
      { label: 'NHS 111', number: '111', href: 'tel:111', note: 'Urgent mental-health help in England: select the mental-health option' },
      { label: 'Emergency', number: '999', href: 'tel:999', note: 'Or go to A&E' },
      { label: 'Samaritans', number: '116 123', href: 'tel:116123', note: 'Emotional support' },
    ],
  },
  {
    id: 'us',
    name: 'United States',
    lines: [
      { label: '988 Suicide & Crisis Lifeline', number: '988', href: 'tel:988', note: 'Call or text' },
      { label: 'Emergency', number: '911', href: 'tel:911', note: 'For immediate physical danger' },
    ],
  },
  {
    id: 'other',
    name: 'Other countries',
    lines: [],
    note: 'Use your country’s local emergency number or a verified local crisis-support service.',
  },
]
