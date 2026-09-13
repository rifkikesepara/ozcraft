import { DEFAULT_AVATAR, DEFAULT_SECTION_ORDER } from './constants.js';

export { DEFAULT_AVATAR };

/**
 * Default resume initial state.
 * @type {import('../schemas/resume.schema').Resume}
 */
export const INITIAL_RESUME_DATA = {
  templateId: 'modern',
  themeColor: '#1e293b',
  fontFamily: 'Plus Jakarta Sans',
  personalInfo: {
    fullName: 'Alex Morgan',
    jobTitle: 'Senior Full-Stack Engineer & Architect',
    email: 'alex.morgan@example.com',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA',
    website: 'https://alexmorgan.dev',
    linkedin: 'linkedin.com/in/alexmorgan',
    github: 'github.com/alexmorgan',
    avatar: DEFAULT_AVATAR,
    showPhoto: true,
    avatarShape: 'circle',
  },
  summary:
    'Innovative Senior Full-Stack Engineer with 7+ years of experience engineering high-throughput distributed systems and intuitive web applications. Adept in modern cloud architecture, React ecosystem, and microservices. Proven record of mentoring cross-functional teams and accelerating release velocity by 40%.',
  experience: [
    {
      id: 'exp-1',
      company: 'Apex Cloud Systems',
      position: 'Staff Frontend Architect',
      location: 'San Francisco, CA',
      startDate: '2022-03',
      endDate: '',
      current: true,
      highlights: [
        'Spearheaded architectural migration of core enterprise dashboard to Vite and React 18, cutting bundle size by 45% and slashing Time-to-Interactive to under 1.2s.',
        'Engineered real-time telemetry streaming system handling 120,000 events/sec with WebSockets and Redis, increasing system availability to 99.99%.',
        'Mentored 12 mid-level and junior software engineers, leading weekly tech reviews and establishing modern CI/CD linting and automated E2E testing pipelines.',
      ],
    },
    {
      id: 'exp-2',
      company: 'Vanguard Software Labs',
      position: 'Senior Software Engineer',
      location: 'Seattle, WA',
      startDate: '2019-06',
      endDate: '2022-02',
      current: false,
      highlights: [
        'Designed and deployed customer billing microservice in Node.js and PostgreSQL processing $35M+ in annual recurring revenue with zero transactional discrepancies.',
        'Collaborated with UX design team to implement an accessible component design system adopted by 14 distinct internal product squads.',
        'Reduced database query latencies by 60% through aggressive caching layers, query optimization, and composite indexing.',
      ],
    },
    {
      id: 'exp-3',
      company: 'Horizon Interactive',
      position: 'Frontend Developer',
      location: 'San Jose, CA',
      startDate: '2017-08',
      endDate: '2019-05',
      current: false,
      highlights: [
        'Developed dynamic, mobile-responsive single-page web applications for Fortune 500 clients utilizing React, Redux, and RESTful APIs.',
        'Partnered with product managers to deliver sprint objectives on time across 18 consecutive agile cycles.',
      ],
    },
  ],
  education: [
    {
      id: 'edu-1',
      institution: 'University of California, Berkeley',
      degree: 'Bachelor of Science in Computer Science',
      field: 'Software Engineering & Distributed Systems',
      location: 'Berkeley, CA',
      startDate: '2013-09',
      endDate: '2017-05',
      gpa: '3.85 / 4.0',
      highlights: [
        'Dean’s Honors List across all semesters',
        'Head Teaching Assistant for Data Structures & Algorithms',
      ],
    },
  ],
  skills: [
    {
      id: 'skill-1',
      category: 'Languages & Core',
      items: ['TypeScript', 'JavaScript (ESNext)', 'Python', 'Go', 'SQL', 'HTML5/CSS3'],
    },
    {
      id: 'skill-2',
      category: 'Frameworks & Frontend',
      items: [
        'React 18',
        'Next.js',
        'Vite',
        'Material UI (MUI)',
        'Tailwind CSS',
        'Redux Toolkit',
        'GraphQL',
      ],
    },
    {
      id: 'skill-3',
      category: 'Backend & Cloud',
      items: [
        'Node.js',
        'Express',
        'PostgreSQL',
        'Redis',
        'Docker',
        'AWS (ECS, S3, Lambda)',
        'Kafka',
      ],
    },
    {
      id: 'skill-4',
      category: 'Tools & DevOps',
      items: ['Git', 'GitHub Actions', 'Jest', 'Playwright', 'Vercel', 'Terraform'],
    },
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'OmniStream Analytics',
      description: 'High-performance real-time metrics visualizer for distributed cloud services.',
      link: 'https://github.com/alexmorgan/omnistream',
      technologies: ['React', 'D3.js', 'WebSockets', 'Go', 'Docker'],
      highlights: [
        'Achieved 60fps graph rendering with canvas virtualization for datasets exceeding 200,000 data points.',
        'Acquired 1,200+ GitHub stars within the first 6 months of open-source release.',
      ],
    },
    {
      id: 'proj-2',
      name: 'OzCraft AI Core',
      description:
        'Intelligent prompt pipeline integrating local and cloud LLMs for resume optimization.',
      link: 'https://github.com/alexmorgan/ozcraft-core',
      technologies: ['Node.js', 'Ollama API', 'Vite', 'TypeScript'],
      highlights: [
        'Implemented contextual prompt compression yielding 2.5x faster LLM inference on bullet point rewrites.',
      ],
    },
  ],
  certifications: [
    {
      id: 'cert-1',
      name: 'AWS Certified Solutions Architect - Associate',
      issuer: 'Amazon Web Services',
      date: '2023-08',
      url: 'https://aws.amazon.com/certification',
    },
    {
      id: 'cert-2',
      name: 'CKAD: Certified Kubernetes Application Developer',
      issuer: 'Cloud Native Computing Foundation',
      date: '2022-11',
      url: 'https://cncf.io',
    },
  ],
  languages: [
    {
      id: 'lang-1',
      language: 'English',
      proficiency: 'Native / Bilingual',
    },
    {
      id: 'lang-2',
      language: 'Spanish',
      proficiency: 'Professional Working',
    },
  ],
  references: [
    {
      id: 'ref-1',
      fullName: 'Sarah Jenkins',
      company: 'TechFlow Systems',
      position: 'VP of Engineering',
      email: 'sarah.jenkins@techflow.io',
      phone: '+1 (555) 345-6789',
    },
    {
      id: 'ref-2',
      fullName: 'David Martinez',
      company: 'OmniStream Open Source',
      position: 'Principal Architect',
      email: 'david.m@omnistream.org',
      phone: '+1 (555) 987-6543',
    },
  ],
  customSections: [],
  sectionOrder: DEFAULT_SECTION_ORDER,
  disabledSections: [],
};
