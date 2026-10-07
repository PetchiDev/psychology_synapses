export interface Education {
  degree: string
  institution: string
  year: string
}

export interface ExperienceEntry {
  role: string
  organisation: string
  period: string
}

export interface Consultation {
  days: string
  hours: string
  modes: string[]
  duration: string
  note: string
}

export interface Doctor {
  slug: string
  name: string
  title: string
  specialization: string
  intro: string
  yearsOfExperience: number
  image: { src: string; alt: string }
  bio: string[]
  education: Education[]
  qualifications: string[]
  specializations: string[]
  expertise: string[]
  experience: ExperienceEntry[]
  languages: string[]
  approach: string
  consultation: Consultation
}

export const doctors: Doctor[] = [
  {
    slug: 'dr-meera-raghavan',
    name: 'Dr. Meera Raghavan',
    title: 'Senior Clinical Psychologist & Clinical Director',
    specialization: 'Anxiety, depression and adult psychotherapy',
    intro:
      'Meera helps adults make sense of anxiety, low mood and life transitions through warm, structured conversations grounded in evidence-based therapy.',
    yearsOfExperience: 18,
    image: { src: '/images/specialists/meera-raghavan.svg', alt: 'Portrait of Dr. Meera Raghavan, Senior Clinical Psychologist' },
    bio: [
      'Dr. Meera Raghavan leads the clinical team at  Paper ,Skin & Synapses. Over eighteen years she has worked with adults facing anxiety, depression, burnout and difficult life changes, in hospital, community and private settings.',
      'She is known for making therapy feel less intimidating. Sessions with Meera are collaborative: together you set goals that matter to you, and she explains each step in plain language.',
    ],
    education: [
      { degree: 'Ph.D. in Clinical Psychology', institution: 'University of Madras', year: '2011' },
      { degree: 'M.Phil. in Clinical Psychology', institution: 'National Institute of Mental Health and Neurosciences (NIMHANS)', year: '2006' },
      { degree: 'M.A. in Psychology', institution: 'Stella Maris College, Chennai', year: '2004' },
    ],
    qualifications: [
      'Licensed Clinical Psychologist, Rehabilitation Council of India',
      'Certified Cognitive Behavioural Therapy (CBT) practitioner',
      'Advanced training in Acceptance and Commitment Therapy (ACT)',
    ],
    specializations: ['Anxiety disorders', 'Depression', 'Adult psychotherapy'],
    expertise: ['Generalised anxiety', 'Panic attacks', 'Low mood and depression', 'Burnout', 'Life transitions', 'Perfectionism'],
    experience: [
      { role: 'Clinical Director', organisation: ' Paper ,Skin & Synapses', period: '2016 – present' },
      { role: 'Consultant Clinical Psychologist', organisation: 'City Multispeciality Hospital, Chennai', period: '2010 – 2016' },
      { role: 'Clinical Psychologist', organisation: 'Community Mental Health Programme, Bengaluru', period: '2006 – 2010' },
    ],
    languages: ['English', 'Tamil', 'Hindi'],
    approach:
      'I believe people already hold much of what they need to feel better. My role is to offer a calm, structured space where we can understand what is keeping you stuck and practise small, realistic changes together.',
    consultation: {
      days: 'Monday, Wednesday, Friday',
      hours: '10:00 – 17:00',
      modes: ['In person', 'Video consultation'],
      duration: '50 minutes',
      note: 'First consultations include a gentle conversation about your goals and what you would like from therapy.',
    },
  },
  {
    slug: 'dr-arjun-nair',
    name: 'Dr. Arjun Nair',
    title: 'Child & Adolescent Psychologist',
    specialization: 'Children, teenagers and family support',
    intro:
      'Arjun works with children, teenagers and their parents on emotional, behavioural and learning-related concerns, using play, conversation and family sessions.',
    yearsOfExperience: 12,
    image: { src: '/images/specialists/arjun-nair.svg', alt: 'Portrait of Dr. Arjun Nair, Child and Adolescent Psychologist' },
    bio: [
      'Dr. Arjun Nair has spent more than a decade supporting young people and their families. He works with children as young as four, as well as teenagers navigating school pressure, friendships, identity and mood.',
      'Arjun involves parents and caregivers thoughtfully, so that the strategies practised in sessions carry over into everyday life at home and school.',
    ],
    education: [
      { degree: 'Psy.D. in Child and Adolescent Psychology', institution: 'Christ University, Bengaluru', year: '2015' },
      { degree: 'M.Sc. in Applied Psychology', institution: 'University of Kerala', year: '2011' },
    ],
    qualifications: [
      'Licensed Clinical Psychologist, Rehabilitation Council of India',
      'Certified in Parent–Child Interaction Therapy (PCIT)',
      'Trained in developmental and psycho-educational assessment',
    ],
    specializations: ['Child psychology', 'Adolescent mental health', 'Parent guidance'],
    expertise: ['School-related anxiety', 'Attention and behaviour concerns', 'Emotional regulation', 'Exam stress', 'Screen-time and sleep routines', 'Learning difficulties assessment'],
    experience: [
      { role: 'Lead, Child & Adolescent Service', organisation: ' Paper ,Skin & Synapses', period: '2018 – present' },
      { role: 'Child Psychologist', organisation: 'Paediatric Development Centre, Kochi', period: '2013 – 2018' },
    ],
    languages: ['English', 'Malayalam', 'Tamil'],
    approach:
      'Children communicate through play, behaviour and stories as much as words. I try to meet each child where they are, and to give parents practical, kind tools rather than blame.',
    consultation: {
      days: 'Tuesday, Thursday, Saturday',
      hours: '09:30 – 16:30',
      modes: ['In person', 'Parent sessions by video'],
      duration: '45 – 60 minutes',
      note: 'For children under 16, the first session usually begins with parents or caregivers.',
    },
  },
  {
    slug: 'dr-farah-siddiqui',
    name: 'Dr. Farah Siddiqui',
    title: 'Counselling Psychologist, Couples & Relationships',
    specialization: 'Couples, relationships and family dynamics',
    intro:
      'Farah supports couples and individuals working through conflict, communication difficulties, separation and other relationship challenges.',
    yearsOfExperience: 14,
    image: { src: '/images/specialists/farah-siddiqui.svg', alt: 'Portrait of Dr. Farah Siddiqui, Counselling Psychologist for couples and relationships' },
    bio: [
      'Dr. Farah Siddiqui helps people understand the patterns that shape their closest relationships. She works with couples at every stage — from early commitment to long marriages — as well as individuals reflecting on their relationships.',
      'Her sessions are balanced and non-judgemental, giving each person space to be heard while working towards clearer, kinder communication.',
    ],
    education: [
      { degree: 'Ph.D. in Counselling Psychology', institution: 'Jamia Millia Islamia, New Delhi', year: '2013' },
      { degree: 'M.A. in Counselling Psychology', institution: 'University of Hyderabad', year: '2009' },
    ],
    qualifications: [
      'Registered Counselling Psychologist',
      'Gottman Method Couples Therapy, Level 2',
      'Emotionally Focused Therapy (EFT) externship',
    ],
    specializations: ['Couples counselling', 'Relationship difficulties', 'Family therapy'],
    expertise: ['Communication and conflict', 'Trust and infidelity', 'Pre-marital counselling', 'Separation and co-parenting', 'Family adjustment', 'Intercultural relationships'],
    experience: [
      { role: 'Senior Counselling Psychologist', organisation: ' Paper ,Skin & Synapses', period: '2017 – present' },
      { role: 'Family Therapist', organisation: 'Family Wellbeing Centre, Hyderabad', period: '2010 – 2017' },
    ],
    languages: ['English', 'Hindi', 'Urdu', 'Telugu'],
    approach:
      'In relationships, nobody is the problem — the pattern is. I help couples slow down, listen differently and find their way back to each other, or to part with dignity when that is right.',
    consultation: {
      days: 'Monday, Tuesday, Thursday',
      hours: '12:00 – 19:00',
      modes: ['In person', 'Video consultation'],
      duration: '60 – 75 minutes for couples',
      note: 'Couples can attend together or begin with individual sessions.',
    },
  },
  {
    slug: 'dr-vikram-iyer',
    name: 'Dr. Vikram Iyer',
    title: 'Clinical Psychologist, Trauma & Stress',
    specialization: 'Trauma, grief and stress-related difficulties',
    intro:
      'Vikram offers steady, trauma-informed support for people living with the effects of distressing experiences, loss or long-term stress.',
    yearsOfExperience: 15,
    image: { src: '/images/specialists/vikram-iyer.svg', alt: 'Portrait of Dr. Vikram Iyer, Clinical Psychologist specialising in trauma' },
    bio: [
      'Dr. Vikram Iyer specialises in trauma-informed care. He has worked with survivors of accidents, violence, disasters and medical trauma, and with people experiencing complicated grief.',
      'Vikram moves at a pace that feels safe for each person, focusing first on stability and coping before gently working through difficult memories.',
    ],
    education: [
      { degree: 'Ph.D. in Psychology (Trauma Studies)', institution: 'Tata Institute of Social Sciences, Mumbai', year: '2012' },
      { degree: 'M.Phil. in Clinical Psychology', institution: 'Central Institute of Psychiatry, Ranchi', year: '2008' },
    ],
    qualifications: [
      'Licensed Clinical Psychologist, Rehabilitation Council of India',
      'EMDR Practitioner (EMDRIA-approved training)',
      'Trauma-Focused CBT certification',
    ],
    specializations: ['Trauma support', 'Grief and loss', 'Stress management'],
    expertise: ['Post-traumatic stress', 'Complicated grief', 'Workplace stress', 'Sleep difficulties linked to stress', 'Medical and accident trauma', 'Emotional numbness'],
    experience: [
      { role: 'Clinical Psychologist, Trauma Service', organisation: ' Paper ,Skin & Synapses', period: '2019 – present' },
      { role: 'Psychologist, Disaster Mental Health Response', organisation: 'State Disaster Management Programme', period: '2012 – 2019' },
      { role: 'Clinical Psychologist', organisation: 'General Hospital, Pune', period: '2008 – 2012' },
    ],
    languages: ['English', 'Tamil', 'Marathi'],
    approach:
      'Healing after trauma is not about forgetting. It is about the past losing its grip on the present. We start with safety and build from there, one manageable step at a time.',
    consultation: {
      days: 'Wednesday, Thursday, Saturday',
      hours: '10:00 – 18:00',
      modes: ['In person', 'Video consultation'],
      duration: '50 – 80 minutes',
      note: 'Longer sessions are sometimes recommended for specific trauma-focused therapies.',
    },
  },
  {
    slug: 'dr-ananya-krishnan',
    name: 'Dr. Ananya Krishnan',
    title: 'Psychologist, Assessment & Behavioural Therapy',
    specialization: 'Psychological assessment and behavioural therapy',
    intro:
      'Ananya conducts thorough psychological assessments and offers behavioural therapy for habits, compulsions and addiction-related concerns.',
    yearsOfExperience: 10,
    image: { src: '/images/specialists/ananya-krishnan.svg', alt: 'Portrait of Dr. Ananya Krishnan, Psychologist for assessment and behavioural therapy' },
    bio: [
      'Dr. Ananya Krishnan brings clarity to complex questions. Her psychological assessments help individuals, families and referring doctors understand cognitive strengths, emotional patterns and support needs.',
      'She also offers behavioural therapy for unhelpful habits, obsessive-compulsive patterns and the psychological side of addiction recovery.',
    ],
    education: [
      { degree: 'Ph.D. in Psychology', institution: 'Banaras Hindu University', year: '2017' },
      { degree: 'M.Phil. in Clinical Psychology', institution: 'Institute of Mental Health, Chennai', year: '2014' },
    ],
    qualifications: [
      'Licensed Clinical Psychologist, Rehabilitation Council of India',
      'Exposure and Response Prevention (ERP) training',
      'Certified in Motivational Interviewing',
    ],
    specializations: ['Psychological assessment', 'Behavioural therapy', 'Addiction-related psychological support'],
    expertise: ['Cognitive and personality assessment', 'Obsessive-compulsive patterns', 'Habit change', 'Addiction recovery support', 'Self-esteem', 'Adult attention concerns'],
    experience: [
      { role: 'Psychologist, Assessment Unit', organisation: ' Paper ,Skin & Synapses', period: '2020 – present' },
      { role: 'Clinical Psychologist', organisation: 'De-addiction & Recovery Centre, Coimbatore', period: '2016 – 2020' },
    ],
    languages: ['English', 'Tamil', 'Hindi'],
    approach:
      'Good assessment is a conversation, not a test you pass or fail. I aim to leave every person with a clearer picture of themselves and practical next steps.',
    consultation: {
      days: 'Monday, Tuesday, Friday',
      hours: '09:00 – 16:00',
      modes: ['In person'],
      duration: '50 minutes; assessments over 2 – 3 sessions',
      note: 'Assessment reports are shared and explained in a dedicated feedback session.',
    },
  },
  {
    slug: 'dr-rohan-mehta',
    name: 'Dr. Rohan Mehta',
    title: 'Counselling Psychologist, Workplace & Wellbeing',
    specialization: 'Workplace stress, sleep and wellness programmes',
    intro:
      'Rohan helps working adults manage stress, sleep problems and burnout, and designs mental wellness programmes for teams and organisations.',
    yearsOfExperience: 9,
    image: { src: '/images/specialists/rohan-mehta.svg', alt: 'Portrait of Dr. Rohan Mehta, Counselling Psychologist for workplace wellbeing' },
    bio: [
      'Dr. Rohan Mehta works at the meeting point of work, rest and mental health. He supports professionals experiencing stress, poor sleep, overwhelm and burnout.',
      'Rohan also leads our Mental Wellness Programmes, running practical workshops on stress, sleep and resilience for schools, colleges and workplaces.',
    ],
    education: [
      { degree: 'Ph.D. in Organisational Psychology', institution: 'Indian Institute of Technology Madras', year: '2018' },
      { degree: 'M.A. in Counselling Psychology', institution: 'Christ University, Bengaluru', year: '2014' },
    ],
    qualifications: [
      'Registered Counselling Psychologist',
      'CBT for Insomnia (CBT-I) training',
      'Certified Mindfulness-Based Stress Reduction (MBSR) teacher',
    ],
    specializations: ['Stress management', 'Sleep problems', 'Mental wellness programmes'],
    expertise: ['Burnout', 'Work–life balance', 'Insomnia and sleep routines', 'Performance pressure', 'Mindfulness skills', 'Team wellbeing workshops'],
    experience: [
      { role: 'Lead, Mental Wellness Programmes', organisation: ' Paper ,Skin & Synapses', period: '2021 – present' },
      { role: 'Employee Wellbeing Consultant', organisation: 'Corporate Wellbeing Network, Mumbai', period: '2016 – 2021' },
    ],
    languages: ['English', 'Hindi', 'Gujarati'],
    approach:
      'Stress is information, not weakness. Together we look at what your mind and body are telling you, then build routines that are realistic for the life you actually live.',
    consultation: {
      days: 'Tuesday, Wednesday, Saturday',
      hours: '08:00 – 14:00 and evenings by request',
      modes: ['In person', 'Video consultation'],
      duration: '50 minutes',
      note: 'Early-morning and evening slots are available for working professionals.',
    },
  },
]

export const getDoctor = (slug: string) => doctors.find((doctor) => doctor.slug === slug)
