import type { LucideIcon } from 'lucide-react'

import {
  Backpack,
  Baby,
  BriefcaseBusiness,
  CloudRain,
  Drama,
  Feather,
  Gauge,
  HeartPulse,
  Link2Off,
  MoonStar,
  Repeat,
  ShieldHalf,
  Sun,
  Wind,
  BrainCircuit,
  ClipboardList,
  HandHeart,
  HeartHandshake,
  Leaf,
  MessageCircle,
  ShieldCheck,
  Sprout,
  Users,
  Waves,
  Stethoscope,
} from 'lucide-react'

export interface TrustPoint {
  title: string
  description: string
  icon: LucideIcon
  note: string
}

export const trustPoints: TrustPoint[] = [
  {
    title: 'Experienced psychology professionals',
    description: 'Licensed clinical and counselling psychologists with years of supervised practice across adults, children, couples and families.',
    icon: Stethoscope,
    note: '75+ years combined',
  },
  {
    title: 'Confidential, compassionate care',
    description: 'What you share stays between you and your clinician, within clear professional and legal limits we explain upfront.',
    icon: ShieldCheck,
    note: 'always private',
  },
  {
    title: 'Evidence-based support',
    description: 'We use approaches with a strong research base, such as CBT, ACT, EMDR and family therapy, adapted to you.',
    icon: BrainCircuit,
    note: 'grounded in research',
  },
  {
    title: 'A personalised approach',
    description: 'No scripts. Your goals, pace, culture and circumstances shape how we work together.',
    icon: Sprout,
    note: 'made for you',
  },
  {
    title: 'A safe, welcoming space',
    description: 'Quiet rooms, unhurried conversations and a team that treats every question with respect.',
    icon: Leaf,
    note: 'come as you are',
  },
]

export interface Concern {
  slug: string
  title: string
  summary: string
  detail: string
  icon: LucideIcon
}

export const concerns: Concern[] = [
  { slug: 'anxiety', icon: Wind, title: 'Anxiety', summary: 'Constant worry, restlessness or a sense that something is wrong.', detail: 'Support may include understanding anxious patterns, calming the body and gradually facing what feels difficult.' },
  { slug: 'depression', icon: CloudRain, title: 'Depression', summary: 'Low mood, loss of interest or feeling flat for weeks at a time.', detail: 'Therapy can help you reconnect with meaning, routine and the people and activities that matter to you.' },
  { slug: 'stress', icon: Gauge, title: 'Stress', summary: 'Feeling stretched thin by responsibilities, change or pressure.', detail: 'We look at sources of stress and build practical coping skills that fit your daily life.' },
  { slug: 'panic-attacks', icon: HeartPulse, title: 'Panic Attacks', summary: 'Sudden waves of fear with racing heart, breathlessness or dizziness.', detail: 'Learning what happens during panic can make it less frightening and help you regain confidence.' },
  { slug: 'relationship-problems', icon: HeartHandshake, title: 'Relationship Problems', summary: 'Recurring conflict, distance or difficulty communicating.', detail: 'Individual or couples sessions can help you understand patterns and communicate more clearly.' },
  { slug: 'sleep-problems', icon: MoonStar, title: 'Sleep Problems', summary: 'Trouble falling asleep, staying asleep or waking rested.', detail: 'Psychological approaches to sleep focus on routines, thoughts and habits that affect rest.' },
  { slug: 'workplace-stress', icon: BriefcaseBusiness, title: 'Workplace Stress', summary: 'Burnout, performance pressure or difficult work relationships.', detail: 'Support can help you set boundaries, manage workload stress and recover energy.' },
  { slug: 'trauma', icon: ShieldHalf, title: 'Trauma', summary: 'Distress that lingers after frightening or overwhelming experiences.', detail: 'Trauma-informed therapy begins with safety and moves at a pace that feels manageable.' },
  { slug: 'child-adolescent', icon: Backpack, title: 'Child & Adolescent Concerns', summary: 'Worries about a child or teenager’s mood, behaviour or development.', detail: 'Our child specialists work with young people and their families together.' },
  { slug: 'emotional-difficulties', icon: Drama, title: 'Emotional Difficulties', summary: 'Feeling overwhelmed, numb, irritable or unsure why you feel the way you do.', detail: 'A safe space to name feelings can be the first step towards understanding them.' },
  { slug: 'behavioural-concerns', icon: Repeat, title: 'Behavioural Concerns', summary: 'Habits or behaviours that feel hard to change or control.', detail: 'Behavioural therapy focuses on small, structured steps towards change.' },
  { slug: 'self-esteem', icon: Sun, title: 'Self-Esteem Issues', summary: 'Harsh self-criticism or a persistent sense of not being good enough.', detail: 'Therapy can help you notice the inner critic and build a kinder relationship with yourself.' },
  { slug: 'grief-loss', icon: Feather, title: 'Grief & Loss', summary: 'Coping with the death of someone close, or other significant losses.', detail: 'Grief has no timetable. Support offers room to remember, feel and adjust.' },
  { slug: 'addiction-support', icon: Link2Off, title: 'Addiction-related Support', summary: 'Psychological support alongside recovery from alcohol, substances or compulsive behaviours.', detail: 'We work with motivation, triggers and relapse prevention, and coordinate with medical care where needed.' },
]

export interface Service {
  slug: string
  title: string
  summary: string
  forWhom: string
  icon: LucideIcon
  /** A short storybook caption shown beneath the illustration. */
  caption: string
  image: { src: string; alt: string }
}

const serviceImage = (slug: string, alt: string) => ({ src: `/images/services/${slug}.jpg`, alt })

export const services: Service[] = [
  {
    slug: 'individual-counselling',
    title: 'Individual Counselling',
    summary: 'One-to-one sessions to talk through what you are facing and work towards change at your own pace.',
    forWhom: 'Adults and young adults',
    icon: MessageCircle,
    caption: 'two chairs, a warm cup, and all the time you need',
    image: serviceImage('individual-counselling', 'Engraved illustration of two armchairs facing each other beside a candle and a cup of tea in a quiet library'),
  },
  {
    slug: 'psychological-assessment',
    title: 'Psychological Assessment',
    summary: 'Structured assessments that clarify emotional, cognitive and behavioural patterns and guide next steps.',
    forWhom: 'Children, teens and adults',
    icon: ClipboardList,
    caption: 'careful notes, gentle questions, a clearer picture',
    image: serviceImage('psychological-assessment', 'Engraved illustration of an open notebook, fountain pen, magnifying glass and hourglass on a candlelit desk'),
  },
  {
    slug: 'child-psychology',
    title: 'Child Psychology',
    summary: 'Play-based and conversational support for children, with practical guidance for parents.',
    forWhom: 'Ages 4 – 17 and families',
    icon: Baby,
    caption: 'blocks, stories and a bear to hold on to',
    image: serviceImage('child-psychology', 'Engraved illustration of a young child hugging a teddy bear beside building blocks, a toy boat and a picture book'),
  },
  {
    slug: 'couples-counselling',
    title: 'Couples & Relationship Counselling',
    summary: 'Balanced, non-judgemental sessions to improve communication and work through conflict.',
    forWhom: 'Couples and individuals',
    icon: HeartHandshake,
    caption: 'two cups, one table, and room to listen',
    image: serviceImage('couples-counselling', 'Engraved illustration of two teacups with intertwining steam and a single rose on a small table'),
  },
  {
    slug: 'stress-management',
    title: 'Stress Management',
    summary: 'Practical, skills-based sessions to understand stress and build sustainable coping routines.',
    forWhom: 'Students and professionals',
    icon: Waves,
    caption: 'still water, slow breath, a quieter morning',
    image: serviceImage('stress-management', 'Engraved illustration of a calm lake at dawn with a rowing boat by a jetty under a willow tree'),
  },
  {
    slug: 'behavioural-therapy',
    title: 'Behavioural Therapy',
    summary: 'Evidence-based therapies such as CBT and ERP that focus on thoughts, habits and actions.',
    forWhom: 'Adolescents and adults',
    icon: BrainCircuit,
    caption: 'one stepping stone, then the next',
    image: serviceImage('behavioural-therapy', 'Engraved illustration of a stepping-stone garden path leading through seedlings to an open rose-covered gate'),
  },
  {
    slug: 'trauma-support',
    title: 'Trauma Support',
    summary: 'Trauma-informed therapy that prioritises safety, stability and gentle processing.',
    forWhom: 'Adults and adolescents',
    icon: HandHeart,
    caption: 'a steady light on a calm shore',
    image: serviceImage('trauma-support', 'Engraved illustration of a stone lighthouse casting a warm beam over a calm twilight sea'),
  },
  {
    slug: 'wellness-programmes',
    title: 'Mental Wellness Programmes',
    summary: 'Workshops and group programmes on stress, sleep and resilience for schools and workplaces.',
    forWhom: 'Groups and organisations',
    icon: Users,
    caption: 'many voices, gathered beneath one tree',
    image: serviceImage('wellness-programmes', 'Engraved illustration of people of different ages sitting in a circle beneath an oak tree hung with lanterns'),
  },
]

export interface ProcessStep {
  title: string
  description: string
}

export const processSteps: ProcessStep[] = [
  { title: 'Reach Out', description: 'Book online, call or write to us. A short message is enough — you do not need the right words.' },
  { title: 'Choose a Convenient Date', description: 'Pick a day that suits you. We confirm the time by phone or email within one working day.' },
  { title: 'Meet With a Specialist', description: 'Meet a psychologist matched to your concern, in person or by video.' },
  { title: 'Discuss Your Concerns', description: 'Talk openly at your own pace. Your clinician listens, asks gentle questions and explains options.' },
  { title: 'Receive Personalised Guidance', description: 'Leave with a clear, shared plan — whether that is ongoing therapy, an assessment or a few practical steps.' },
]

export interface Faq {
  question: string
  answer: string
}

export const faqs: Faq[] = [
  {
    question: 'When should I consult a psychologist?',
    answer:
      'Consider speaking with a psychologist when worry, low mood, stress or relationship difficulties last for more than a couple of weeks, or begin to affect your sleep, work, studies or relationships. You do not need to wait for things to feel severe — early support is often the most helpful.',
  },
  {
    question: 'What happens during the first consultation?',
    answer:
      'The first consultation is a relaxed conversation of about 50 minutes. Your psychologist will ask what brings you in, a little about your background and what you hope will change. Together you agree on next steps, which might be regular sessions, an assessment or a referral if another service would suit you better.',
  },
  {
    question: 'Do I need a referral?',
    answer:
      'No. You can book directly with us without a referral from a doctor. If you already have a referral letter or previous reports, you are welcome to bring them.',
  },
  {
    question: 'Are consultations confidential?',
    answer:
      'Yes. Everything you share is kept confidential. The only exceptions are rare situations where there is a serious risk to your safety or someone else’s, or where the law requires disclosure — your psychologist will explain these limits at the start.',
  },
  {
    question: 'How can I book an appointment?',
    answer: `Use the “Book a Consultation” form on this page: choose a preferred date, share your details and a brief description of your concern, then select “Contact Us”. Our team will call or email within one working day to confirm a time. You can also call us directly.`,
  },
  {
    question: 'What psychological concerns can you help with?',
    answer:
      'Our psychologists offer support for anxiety, depression, stress, panic attacks, relationship problems, sleep problems, workplace stress, trauma, grief and loss, self-esteem, behavioural concerns, emotional difficulties, child and adolescent concerns, and the psychological side of addiction recovery.',
  },
  {
    question: 'Can children and teenagers receive psychological support?',
    answer:
      'Yes. Our child and adolescent psychologists work with young people from around four years of age, alongside their parents or caregivers. Sessions use play, creative activities and conversation suited to the child’s age.',
  },
  {
    question: 'Can I choose a specific doctor?',
    answer:
      'Yes. You can browse our specialists and mention a preferred psychologist when booking. If you are unsure, our team will suggest a specialist whose experience matches your concern.',
  },
  {
    question: 'Is this service for emergencies?',
    answer:
      'No. If you or someone else is in immediate danger, call 112. For urgent emotional support at any hour, you can call the national Tele-MANAS helpline on 14416. Our booking form is for planned consultations only.',
  },
]

export const heroHighlights = [
  { label: 'Specialists', value: '6' },
  { label: 'Years of care', value: '14+' },
  { label: 'Languages', value: '5' },
]
