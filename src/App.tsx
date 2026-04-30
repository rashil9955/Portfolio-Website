import type { CSSProperties, KeyboardEvent, RefObject } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Bot,
  BriefcaseBusiness,
  Code2,
  Cpu,
  ExternalLink,
  FileText,
  FolderOpen,
  GraduationCap,
  Hammer,
  LayoutGrid,
  List,
  Minus,
  Palette,
  Plane,
  ShieldCheck,
  Square,
  Users,
  Wrench,
  X,
} from 'lucide-react';
import bb8Image from '../bb8.jpg';
import droneImage from '../drone.jpg';
import thaimunImage from '../thaimun.jpg';

type SectionKey =
  | 'HOME'
  | 'ABOUT'
  | 'EXPERIENCE'
  | 'PROJECTS'
  | 'PORTFOLIO'
  | 'CONTACT'
  | 'RESUME';

type HistoryLine = {
  kind: 'command' | 'system' | 'error';
  text: string;
};

const menuItems: Array<{ label: string; section: SectionKey }> = [
  { label: 'Home', section: 'HOME' },
  { label: 'About', section: 'ABOUT' },
  { label: 'Experience', section: 'EXPERIENCE' },
  { label: 'Projects', section: 'PROJECTS' },
  { label: 'Portfolio', section: 'PORTFOLIO' },
  { label: 'Contact', section: 'CONTACT' },
  { label: 'Resume', section: 'RESUME' },
];

const commands = [
  'CLS',
  'OPEN HOME',
  'OPEN ABOUT',
  'OPEN EXPERIENCE',
  'OPEN PROJECTS',
  'OPEN PORTFOLIO',
  'OPEN CONTACT',
  'OPEN RESUME',
  'PROJECTS',
  'GITHUB',
  'HELP',
];

const githubProfileUrl = 'https://github.com/rashil9955';

type SkillAxis = {
  label: string;
  rating: number;
};

type ExperienceItem = {
  id: string;
  year: string;
  month: string;
  title: string;
  organization?: string;
  location?: string;
  period: string;
  icon: typeof Code2;
  summary: string;
  details: string[];
  shape: 'code' | 'screen' | 'chip' | 'orbit' | 'tool' | 'community';
  image?: {
    src: string;
    alt: string;
    caption: string;
  };
};

type ProjectCategory = 'AI / Data' | 'Security' | 'Web Apps' | 'Systems' | 'Hardware' | 'Design';

type ProjectItem = {
  id: string;
  title: string;
  category: ProjectCategory;
  description: string;
  repo: string;
};

const skillAxes: SkillAxis[] = [
  { label: 'Software Development', rating: 82 },
  { label: 'Web & UI Design', rating: 80 },
  { label: 'Backend Systems', rating: 76 },
  { label: 'Data & Analytics', rating: 74 },
  { label: 'Cybersecurity', rating: 72 },
  { label: 'AI / Computer Vision', rating: 70 },
  { label: 'Hardware Prototyping', rating: 73 },
  { label: 'Product Thinking', rating: 81 },
  { label: 'Technical Writing', rating: 79 },
  { label: 'Problem Solving', rating: 84 },
];

const projectCategories: ProjectCategory[] = [
  'AI / Data',
  'Security',
  'Web Apps',
  'Systems',
  'Hardware',
  'Design',
];

const projects: ProjectItem[] = [
  {
    id: 'portfolio-website',
    title: 'QBASIC Portfolio Website',
    category: 'Web Apps',
    description:
      'A retro QBASIC-inspired portfolio built with React, TypeScript, Vite, and interactive sections.',
    repo: 'https://github.com/rashil9955/Portfolio-Website',
  },
  {
    id: 'fraud-detection',
    title: 'Fraud Detection System',
    category: 'AI / Data',
    description:
      'A machine learning project for identifying suspicious transaction patterns and explaining fraud risk.',
    repo: 'https://github.com/rashil9955/fraud-detection',
  },
  {
    id: 'data-cleansing',
    title: 'Data Cleansing Toolkit',
    category: 'AI / Data',
    description:
      'Scripts and workflows for cleaning inconsistent datasets before analysis, reporting, or modeling.',
    repo: 'https://github.com/rashil9955/data-cleansing-toolkit',
  },
  {
    id: 'risk-scoring',
    title: 'Risk Scoring Dashboard',
    category: 'AI / Data',
    description:
      'A dashboard concept that turns raw indicators into readable risk scores and decision-support views.',
    repo: 'https://github.com/rashil9955/risk-scoring-dashboard',
  },
  {
    id: 'secure-communication',
    title: 'Secure Communication App',
    category: 'Security',
    description:
      'A secure messaging experiment focused on encryption concepts, authentication, and safe data handling.',
    repo: 'https://github.com/rashil9955/secure-communication',
  },
  {
    id: 'accessibility-automation',
    title: 'Accessibility Automation',
    category: 'Security',
    description:
      'Python automation for finding document and web accessibility issues more efficiently.',
    repo: 'https://github.com/rashil9955/accessibility-automation',
  },
  {
    id: 'object-detection',
    title: 'Object Detection Experiment',
    category: 'AI / Data',
    description:
      'A computer vision build exploring object detection workflows and practical image analysis.',
    repo: 'https://github.com/rashil9955/object-detection',
  },
  {
    id: 'web-dashboard',
    title: 'Web Analytics Dashboard',
    category: 'Web Apps',
    description:
      'A web dashboard for organizing metrics, visual summaries, and user-facing data views.',
    repo: 'https://github.com/rashil9955/web-analytics-dashboard',
  },
  {
    id: 'database-system',
    title: 'Database Management System',
    category: 'Systems',
    description:
      'A coursework-driven database project focused on schema design, queries, and structured records.',
    repo: 'https://github.com/rashil9955/database-management-system',
  },
  {
    id: 'csharp-apps',
    title: 'C# Coursework Apps',
    category: 'Systems',
    description:
      'Object-oriented programming projects built while learning C#, application structure, and persistence.',
    repo: 'https://github.com/rashil9955/csharp-coursework',
  },
  {
    id: 'drone-project',
    title: 'Custom Drone Project',
    category: 'Hardware',
    description:
      'A hands-on drone rebuild using motors, controllers, propellers, a custom frame, and flight testing.',
    repo: 'https://github.com/rashil9955/custom-drone-project',
  },
  {
    id: 'bb8-robot',
    title: 'BB-8 Robot Project',
    category: 'Hardware',
    description:
      'A BB-8 inspired robot prototype using a rolling sphere, internal drive system, and magnetic head coupling.',
    repo: 'https://github.com/rashil9955/bb8-robot',
  },
  {
    id: 'thekedar-ui',
    title: 'Thekedar App UI/UX',
    category: 'Design',
    description:
      'A UI/UX design project for a service platform connecting customers with local hardware providers.',
    repo: 'https://github.com/rashil9955/thekedar-ui',
  },
  {
    id: 'local-school-websites',
    title: 'Local School Websites',
    category: 'Web Apps',
    description:
      'Early hand-coded websites for local schools and companies, focused on layout, clarity, and usability.',
    repo: 'https://github.com/rashil9955/local-school-websites',
  },
];

const experienceItems: ExperienceItem[] = [
  {
    id: 'sdsu-accessibility-2026',
    year: '2026',
    month: 'January',
    title: 'Digital Accessibility Liaison',
    organization: 'South Dakota State University',
    location: 'Brookings, South Dakota',
    period: 'January 2026 - Present',
    icon: ShieldCheck,
    summary:
      'Improving digital accessibility across university documents and web platforms with a mix of manual analysis and Python automation.',
    details: [
      'Develop and maintain Python scripts that detect and fix accessibility issues more efficiently.',
      'Analyze PDF and HTML structures to identify semantic, structural, and WCAG 2.1 accessibility problems.',
      'Collaborate with cross-functional teams to turn technical accessibility requirements into practical fixes.',
    ],
    shape: 'code',
  },
  {
    id: 'daktronics-product-2025',
    year: '2025',
    month: 'August',
    title: 'Product Intern',
    organization: 'Daktronics',
    location: 'Brookings, South Dakota',
    period: 'August 2025 - Present',
    icon: BriefcaseBusiness,
    summary:
      'Learning how product decisions connect customer needs, technical constraints, documentation, and real-world value.',
    details: [
      'Built a stronger bridge between computer science, product development, communication, and practical decision-making.',
      'Studied how teams reason about use cases, customers, product value, and implementation tradeoffs.',
    ],
    shape: 'screen',
  },
  {
    id: 'daktronics-live-events-2025',
    year: '2025',
    month: 'May',
    title: 'Live Events Manufacturing',
    organization: 'Daktronics',
    location: 'Brookings, South Dakota',
    period: 'May 2025 - August 2025',
    icon: Wrench,
    summary:
      'Worked around large-scale display and event technology products, gaining a deeper appreciation for hardware, precision, and quality.',
    details: [
      'Saw how engineering, manufacturing, product design, and customer expectations connect in shipped systems.',
      'Strengthened habits around process discipline, consistency, teamwork, and attention to detail.',
    ],
    shape: 'tool',
  },
  {
    id: 'csc-ta-2024',
    year: '2024',
    month: 'August',
    title: 'Teaching Assistant - CSC 100L',
    organization: 'South Dakota State University',
    period: 'August 2024 - December 2024',
    icon: GraduationCap,
    summary:
      'Helped beginner computer science students with labs, programming assignments, and technical questions.',
    details: [
      'Practiced explaining programming concepts clearly to students who were just starting.',
      'Built communication, patience, leadership, and technical confidence by teaching fundamentals.',
    ],
    shape: 'code',
  },
  {
    id: 'nsa-secretary-2024',
    year: '2024',
    month: 'January',
    title: "Secretary - Nepalese Students' Association",
    organization: 'South Dakota State University',
    period: '2024 - Present',
    icon: Users,
    summary:
      'Supported communication, documentation, event planning, and coordination for the Nepalese student community at SDSU.',
    details: [
      'Developed leadership and organization skills while staying connected to culture, community, and student life.',
      'Handled communication and planning work that kept student activities moving smoothly.',
    ],
    shape: 'community',
  },
  {
    id: 'daktronics-assembler-2024',
    year: '2024',
    month: 'May',
    title: 'Seasonal Assembler - HSPR Department',
    organization: 'Daktronics',
    location: 'Brookings, South Dakota',
    period: 'May 2024 - May 2025',
    icon: Hammer,
    summary:
      'First major professional work experience in the United States, focused on production, safety, quality, and teamwork.',
    details: [
      'Learned how technical products are built at scale in a professional manufacturing environment.',
      'Built discipline around quality, communication, consistency, and workplace expectations.',
    ],
    shape: 'tool',
  },
  {
    id: 'coursework-2024',
    year: '2024',
    month: '2024',
    title: 'Computer Science Coursework and C# Development',
    organization: 'South Dakota State University',
    period: '2024',
    icon: Code2,
    summary:
      'Moved from basic programming into more structured software engineering through C#, OOP, databases, and system design.',
    details: [
      'Started thinking more carefully about classes, data storage, system organization, and maintainable software.',
      'Continued building a computer science foundation through coursework and practice.',
    ],
    shape: 'code',
  },
  {
    id: 'freshman-sdsu-2023',
    year: '2023',
    month: 'July',
    title: 'Freshman Year',
    organization: 'South Dakota State University',
    location: 'Brookings, South Dakota',
    period: 'July 2023',
    icon: Plane,
    summary:
      'Moved to the United States from Nepal and began studying Computer Science at SDSU.',
    details: [
      'Adjusted to a new country, academic system, culture, and level of independence.',
      'Started building a stronger foundation in C, C++, programming logic, structured thinking, and software development.',
    ],
    shape: 'orbit',
  },
  
  {
    id: 'sdsu-commit-2022',
    year: '2022',
    month: '2022',
    title: 'Committed to South Dakota State University',
    period: '2022',
    icon: GraduationCap,
    summary:
      'Committed to SDSU after applying to more than 20 universities in the United States.',
    details: [
      'This decision shaped the transition from Nepal to the United States and toward a focused computer science path.',
    ],
    shape: 'screen',
  },
  {
    id: 'reliance-mun-2022',
    year: '2022',
    month: '2022',
    title: 'Organizer - Reliance Public Model United Nations',
    period: '2022',
    icon: Users,
    summary:
      'Continued organizing Model UN events and strengthening leadership, planning, communication, and event management skills.',
    details: [
      'Used prior MUN experience to guide participants, handle pressure, and coordinate structured discussion.',
    ],
    shape: 'community',
  },
  {
    id: 'thekedar-2022',
    year: '2022',
    month: 'August',
    title: 'UI/UX Designer - Thekedar App',
    period: 'August 2022',
    icon: Palette,
    summary:
      'Designed user flows and layouts for a hardware solutions platform connecting customers with local service providers.',
    details: [
      'Learned to think through app navigation, usability, service discovery, and product design for real-world needs.',
    ],
    shape: 'screen',
  },
  {
    id: 'alumni-founder-2022',
    year: '2022',
    month: '2022',
    title: 'Founder - Alumni Association of Reliance Public School',
    period: '2022',
    icon: Users,
    summary:
      'Founded an alumni association to help graduates stay connected and support one another.',
    details: [
      'Handled organization-building, leadership, communication, long-term planning, logo design, and graphics.',
    ],
    shape: 'community',
  },
  {
    id: 'web-dev-2022',
    year: '2022',
    month: '2022',
    title: 'Web Development for Local Schools and Companies',
    period: '2022',
    icon: Code2,
    summary:
      'Started manually coding websites for local schools and companies, connecting design instincts with implementation.',
    details: [
      'Learned website structure, layouts, user experience, and how to build digital experiences from scratch.',
    ],
    shape: 'code',
  },
  {
    id: 'a-level-grad-2022',
    year: '2022',
    month: 'June',
    title: 'CIE A-Level Graduation',
    organization: 'Budhanilkantha School',
    period: 'June 2022',
    icon: GraduationCap,
    summary:
      'Graduated from CIE A-Levels after building a broad base across academics, design, leadership, web work, and student activities.',
    details: [
      'This period helped form the bridge into computer science and a broader technical direction.',
    ],
    shape: 'screen',
  },
  {
    id: 'esports-design-2022',
    year: '2022',
    month: '2022',
    title: 'Graphic Designer for Student Clubs and International Esports Teams',
    period: '2022',
    icon: Palette,
    summary:
      'Created graphics, social visuals, logos, banners, posters, and branding materials for varied audiences.',
    details: [
      'Learned client communication, deadlines, visual adaptation, and designing for schools, clubs, events, and esports.',
    ],
    shape: 'screen',
  },
  {
    id: 'bnksmun-2021',
    year: '2021',
    month: '2021',
    title: 'Organizer - Budhanilkantha Model United Nations',
    organization: 'Budhanilkantha School',
    period: '2021',
    icon: Users,
    summary:
      'Helped organize BNKSMUN, a conference with around 150+ high school participants.',
    details: [
      'Coordinated teams, communicated with participants, managed live logistics, and solved event problems as they came up.',
    ],
    shape: 'community',
  },
  {
    id: 'recomun-2021',
    year: '2021',
    month: '2021',
    title: 'Organizer and SOCHUM Chair - ReCoMUN',
    period: '2021',
    icon: Users,
    summary:
      'Helped organize Reliance College Model United Nations with around 250+ participants and chaired SOCHUM.',
    details: [
      'Led debate, maintained committee structure, guided delegates, and developed leadership under pressure.',
    ],
    shape: 'community',
  },
  {
    id: 'python-design-2021',
    year: '2021',
    month: '2021',
    title: 'Freelance Graphic Design and Early Python Programming',
    period: '2021',
    icon: Code2,
    summary:
      'Balanced freelance design, A-Level academics, and a renewed interest in programming through smaller Python experiments.',
    details: [
      'Programming slowly became a larger part of the same creative problem-solving mindset that had powered design work.',
    ],
    shape: 'code',
  },
  {
    id: 'freelance-creative-2020',
    year: '2020',
    month: '2020',
    title: 'Freelance Graphic Designer and Video Editor',
    period: '2020 - 2022',
    icon: Palette,
    summary:
      'Designed thumbnails, videos, logos, banners, posters, social graphics, MUN branding, and esports visuals.',
    details: [
      'Built client communication, deadline habits, visual hierarchy, branding judgment, and digital presentation skills.',
      'Worked across YouTube, schools, student clubs, events, and online teams.',
    ],
    shape: 'screen',
  },
  {
    id: 'adobe-2020',
    year: '2020',
    month: '2020',
    title: 'Started Using Adobe Photoshop and Illustrator',
    period: '2020',
    icon: Palette,
    summary:
      'Began using Photoshop and Illustrator seriously for thumbnails, logos, posters, banners, and visual materials.',
    details: [
      'Learned how small design choices affect clarity, meaning, and how people understand information.',
    ],
    shape: 'screen',
  },
  {
    id: 'a-level-admission-2020',
    year: '2020',
    month: 'August',
    title: 'Admitted to CIE A-Levels',
    organization: 'Budhanilkantha School',
    period: 'August 2020',
    icon: GraduationCap,
    summary:
      'Started CIE A-Levels at Budhanilkantha School after completing school at Reliance Public School.',
    details: [
      'Continued growing academically while developing creative, leadership, and technical skills outside the classroom.',
    ],
    shape: 'screen',
  },
  {
    id: 'school-grad-2020',
    year: '2020',
    month: '2020',
    title: 'High School Graduation',
    organization: 'Reliance Public School',
    period: '2020',
    icon: GraduationCap,
    summary:
      'Graduated from Reliance Public School during the year COVID changed how learning and daily life worked.',
    details: [
      'Used the disruption as time to explore baking, photography, design, video editing, and new creative skills.',
    ],
    shape: 'screen',
  },
  {
    id: 'mun-chair-2019',
    year: '2019',
    month: 'August',
    title: 'Chairperson - Reliance Public Model United Nations VII',
    period: 'August 2019',
    icon: Users,
    summary:
      'Served as Chairperson for a Historical Crisis Committee with around 50 delegates and won the Conference Icon Award.',
    details: [
      'Managed debate, guided delegates, controlled crisis flow, and strengthened moderation and decision-making skills.',
    ],
    shape: 'community',
  },
  {
    id: 'drone-2019',
    year: '2019',
    month: 'June',
    title: 'Custom Drone Project',
    period: 'June 2019',
    icon: Cpu,
    summary:
      'Built and tested a custom drone with friends using motors, receivers, motor controllers, propellers, and a control unit.',
    details: [
      'Rebuilt a broken plastic frame with lightweight wood, reassembled the system, programmed controllers, and flew it again.',
      'Learned hardware assembly, electronics, motor control, structural design, troubleshooting, and teamwork.',
    ],
    shape: 'chip',
    image: {
      src: droneImage,
      alt: 'Custom drone project build',
      caption: 'Custom drone build',
    },
  },
  {
    id: 'thaimun-2019',
    year: '2019',
    month: 'April',
    title: 'Historical Crisis Committee Delegate - THAIMUN',
    organization: 'Thailand International Model United Nations',
    location: 'Bangkok, Thailand',
    period: 'April 2019',
    icon: Plane,
    summary:
      'Represented Baldwin of Boulogne in a Historical Crisis Committee at THAIMUN in Bangkok.',
    details: [
      'Practiced diplomacy, negotiation, historical analysis, crisis response, public speaking, and strategy in an international setting.',
    ],
    shape: 'orbit',
  },
  {
    id: 'bb8-2019',
    year: '2019',
    month: 'March',
    title: 'BB-8 Robot Project',
    period: 'March 2019',
    icon: Bot,
    summary:
      'Built a working BB-8 inspired robot from scratch using a remote-controlled chassis, rolling sphere, and magnetic head coupling.',
    details: [
      'Solved the challenge of keeping the head steady by building an internal support structure with magnets.',
      'Learned magnetic coupling, mechanical balance, movement systems, prototyping, and trial-and-error engineering.',
    ],
    shape: 'chip',
    image: {
      src: bb8Image,
      alt: 'BB-8 inspired robot project',
      caption: 'BB-8 robot prototype',
    },
  },
  {
    id: 'thaimun-2018',
    year: '2018',
    month: '2018',
    title: 'Early Model United Nations Experience',
    organization: 'Thailand International Model United Nations',
    period: '2018',
    icon: Plane,
    summary:
      'An early international Model UN experience that helped build confidence in public speaking, diplomacy, and structured debate.',
    details: [
      'Practiced research, formal speaking, negotiation, and responding thoughtfully inside committee discussion.',
      'This experience helped set the foundation for later Model UN leadership and crisis committee work.',
    ],
    shape: 'orbit',
    image: {
      src: thaimunImage,
      alt: 'THAIMUN Model United Nations experience',
      caption: 'THAIMUN experience',
    },
  },
];

const sectionText: Record<SectionKey, string[]> = {
  HOME: [
    '10 REM PERSONAL PORTFOLIO',
    '20 PRINT "Hi, I am Rashil."',
    '30 PRINT "I started programming in grade 8 with QBASIC."',
    '40 PRINT "This site is a small love letter to that first blue screen."',
    '50 GOTO ABOUT',
  ],
  ABOUT: [
    'SUB AboutMe',
    '  LET origin$ = "Grade 8, a blue screen, and QBASIC"',
    '  PRINT "I am Rashil, a builder who likes making useful things feel human."',
    '  PRINT "My favorite work sits between product thinking, clean code, and tiny moments of delight."',
    '  PRINT "I care about software that is direct, dependable, and personal enough to remember."',
    '  PRINT "That first QBASIC program still shapes how I build: start simple, make it run, then give it soul."',
    '  GOSUB WhatIDo',
    'END SUB',
    '',
    'WhatIDo:',
    '  PRINT "I turn rough ideas into interactive systems, portfolio pieces, and practical tools."',
    '  RETURN',
  ],
  EXPERIENCE: [
    'TYPE Experience',
    '  role AS STRING * 40',
    '  focus AS STRING * 70',
    'END TYPE',
    '',
    'PRINT "Add internships, roles, freelance work, leadership, and shipped systems here."',
  ],
  PROJECTS: [
    'FOR project = 1 TO 3',
    '  PRINT "Project"; project; ": a focused build with a clear story"',
    'NEXT project',
    '',
    'REM Replace these placeholders with real project cards later.',
  ],
  PORTFOLIO: [
    'SCREEN 13',
    'PALETTE 1, CYAN',
    'PRINT "Selected work, experiments, case studies, and visual builds."',
    'PRINT "This section can grow into a gallery without changing the shell."',
  ],
  CONTACT: [
    'INPUT "Want to connect"; answer$',
    'IF answer$ = "YES" THEN PRINT "Email: r@rshibak.com"',
    'PRINT "LinkedIn: https://www.linkedin.com/in/rshibak/"',
    'PRINT "GitHub: https://github.com/rashil9955"',
  ],
  RESUME: [
    'OPEN "resume.pdf" FOR OUTPUT AS #1',
    'PRINT #1, "Resume download placeholder"',
    'CLOSE #1',
    '',
    'PRINT "Add a real resume link when ready."',
  ],
};

function App() {
  const [activeSection, setActiveSection] = useState<SectionKey | null>(null);
  const [history, setHistory] = useState<HistoryLine[]>([]);
  const [command, setCommand] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const isExpandedMode =
    activeSection === 'ABOUT' || activeSection === 'EXPERIENCE' || activeSection === 'CONTACT';

  const sectionLines = useMemo(
    () => (activeSection ? sectionText[activeSection] : []),
    [activeSection],
  );

  function openSection(section: SectionKey) {
    setActiveSection(section);
    setHistory([{ kind: 'system', text: `Loading ${section}.BAS ... OK` }]);
  }

  function runCommand(rawCommand: string) {
    const normalized = rawCommand.trim().replace(/\s+/g, ' ').toUpperCase();
    if (!normalized) return;

    if (normalized === 'CLS') {
      setActiveSection(null);
      setHistory([]);
      setCommand('');
      return;
    }

    if (normalized === 'HELP') {
      setActiveSection(null);
      setHistory([
        { kind: 'command', text: `> ${normalized}` },
        { kind: 'system', text: 'Available commands:' },
        ...commands.map((item) => ({ kind: 'system' as const, text: `  ${item}` })),
      ]);
      setCommand('');
      return;
    }

    if (normalized === 'PROJECTS') {
      openSection('PROJECTS');
      setHistory((current) => [{ kind: 'command', text: `> ${normalized}` }, ...current]);
      setCommand('');
      return;
    }

    if (normalized === 'GITHUB' || normalized === 'OPEN GITHUB') {
      setActiveSection(null);
      setHistory([
        { kind: 'command', text: `> ${normalized}` },
        { kind: 'system', text: `GitHub: ${githubProfileUrl}` },
        { kind: 'system', text: 'Tip: type PROJECTS to open the projects page.' },
      ]);
      setCommand('');
      return;
    }

    const openMatch = normalized.match(/^OPEN (HOME|ABOUT|EXPERIENCE|PROJECTS|PORTFOLIO|CONTACT|RESUME)$/);
    if (openMatch) {
      openSection(openMatch[1] as SectionKey);
      setHistory((current) => [{ kind: 'command', text: `> ${normalized}` }, ...current]);
      setCommand('');
      return;
    }

    setHistory((current) => [
      ...current,
      { kind: 'command', text: `> ${normalized}` },
      { kind: 'error', text: 'Syntax error: command not recognized' },
    ]);
    setCommand('');
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      runCommand(command);
    }
  }

  return (
    <main className={`page-shell${isExpandedMode ? ' is-expanded-mode' : ''}`}>
      <div className="ambient-copy">Grade 8 memory loaded. QBASIC mode ready.</div>
      <QBasicWindow
        activeSection={activeSection}
        history={history}
        sectionLines={sectionLines}
        command={command}
        onCommandChange={setCommand}
        onCommandRun={runCommand}
        onInputKeyDown={handleKeyDown}
        onOpenSection={openSection}
        inputRef={inputRef}
      />
    </main>
  );
}

type QBasicWindowProps = {
  activeSection: SectionKey | null;
  history: HistoryLine[];
  sectionLines: string[];
  command: string;
  onCommandChange: (value: string) => void;
  onCommandRun: (value: string) => void;
  onInputKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  onOpenSection: (section: SectionKey) => void;
  inputRef: RefObject<HTMLInputElement | null>;
};

function QBasicWindow({
  activeSection,
  history,
  sectionLines,
  command,
  onCommandChange,
  onCommandRun,
  onInputKeyDown,
  onOpenSection,
  inputRef,
}: QBasicWindowProps) {
  const isExpandedMode =
    activeSection === 'ABOUT' || activeSection === 'EXPERIENCE' || activeSection === 'CONTACT';

  return (
    <section
      className={`qbasic-window${isExpandedMode ? ' is-expanded' : ''}${activeSection === 'PROJECTS' ? ' is-projects' : ''}`}
      onClick={() => inputRef.current?.focus()}
    >
      <div className="title-bar">
        <div className="title-left">
          <span className="app-icon">QB</span>
          <span>QB64 x32 - RASHIL.BAS</span>
        </div>
        <div className="window-controls" aria-hidden="true">
          <Minus size={13} />
          <Square size={11} />
          <X size={13} />
        </div>
      </div>
      <MenuBar activeSection={activeSection} onOpenSection={onOpenSection} />
      <div className="editor-frame">
        <div className="document-tab">Untitled*</div>
        <CodeScreen activeSection={activeSection} history={history} sectionLines={sectionLines} />
        <div className="scrollbar scrollbar-y">
          <span>▲</span>
          <div />
          <span>▼</span>
        </div>
        {activeSection === 'PROJECTS' ? <div className="scroll-cue">SCROLL<br />▼</div> : null}
        <div className="scrollbar scrollbar-x">
          <span>◄</span>
          <div />
          <span>►</span>
        </div>
        <CommandInput
          value={command}
          onChange={onCommandChange}
          onRun={onCommandRun}
          onKeyDown={onInputKeyDown}
          inputRef={inputRef}
        />
      </div>
      <StatusBar activeSection={activeSection} />
    </section>
  );
}

function MenuBar({
  activeSection,
  onOpenSection,
}: {
  activeSection: SectionKey | null;
  onOpenSection: (section: SectionKey) => void;
}) {
  return (
    <nav className="menu-bar" aria-label="Portfolio navigation">
      <div className="menu-items">
        {menuItems.map((item) => (
          <button
            key={item.section}
            className={activeSection === item.section ? 'is-active' : undefined}
            onClick={() => onOpenSection(item.section)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}

function CodeScreen({
  activeSection,
  history,
  sectionLines,
}: {
  activeSection: SectionKey | null;
  history: HistoryLine[];
  sectionLines: string[];
}) {
  if (activeSection === 'ABOUT') {
    return (
      <div className="code-screen about-screen">
        <AboutPage />
      </div>
    );
  }

  if (activeSection === 'EXPERIENCE') {
    return (
      <div className="code-screen experience-screen">
        <ExperiencePage />
      </div>
    );
  }

  if (activeSection === 'PROJECTS') {
    return (
      <div className="code-screen projects-screen">
        <ProjectsPage />
      </div>
    );
  }

  return (
    <div className="code-screen">
      <div className="screen-content">
        {!activeSection && history.length === 0 ? <WatermarkHint /> : null}
        {history.map((line, index) => (
          <p key={`${line.text}-${index}`} className={`line-${line.kind}`}>
            {linkifyTerminalText(line.text)}
          </p>
        ))}
        {activeSection ? (
          <SectionRenderer key={activeSection} title={activeSection} lines={sectionLines} />
        ) : null}
      </div>
    </div>
  );
}

function AboutPage() {
  return (
    <article className="about-page">
      <div className="about-title-wrap" aria-label="About me">
        <span className="about-title-shadow" aria-hidden="true">
          About Me
        </span>
        <h1>About Me</h1>
      </div>
      <div className="about-copy">
        <p>
          Hi, I&rsquo;m Rashil Shibakoti, a Computer Science student at South Dakota State
          University from Nepal. I&rsquo;m interested in software engineering, cybersecurity, data
          systems, AI, and Natural Language Processing.
        </p>
        <p>
          My first programming experience was with QBASIC, which introduced me to the excitement of
          building things with code. Since then, my focus has grown toward creating practical
          software systems that solve real problems.
        </p>
        <p>
          I have worked on projects involving fraud detection, data cleansing, risk scoring, secure
          communication, object detection, databases, and web dashboards. I enjoy connecting backend
          logic, clean design, and real-world usefulness.
        </p>
        <p>
          This website is a place to share my projects, experience, and growth as I continue
          becoming a stronger software engineer.
        </p>
      </div>
    </article>
  );
}

function ProjectsPage() {
  const [view, setView] = useState<'category' | 'list'>('category');
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('AI / Data');
  const visibleProjects =
    view === 'list' ? projects : projects.filter((project) => project.category === activeCategory);

  return (
    <article className="projects-page">
      <header className="projects-header">
        <p className="projects-kicker">LOAD PROJECTS.BAS</p>
        <h1>Projects</h1>
        <p>
          Choose category view to browse by project type, or list view to see every build in one
          long scroll.
        </p>
      </header>

      <div className="project-view-switch" aria-label="Project view options">
        <button
          type="button"
          className={view === 'category' ? 'is-active' : undefined}
          onClick={() => setView('category')}
        >
          <LayoutGrid size={14} />
          Category View
        </button>
        <button
          type="button"
          className={view === 'list' ? 'is-active' : undefined}
          onClick={() => setView('list')}
        >
          <List size={14} />
          List View
        </button>
      </div>

      {view === 'category' ? (
        <section className="project-category-panel" aria-label="Project categories">
          <div className="project-category-grid">
            {projectCategories.map((category) => {
              const count = projects.filter((project) => project.category === category).length;

              return (
                <button
                  key={category}
                  type="button"
                  className={activeCategory === category ? 'is-active' : undefined}
                  onClick={() => setActiveCategory(category)}
                >
                  <FolderOpen size={16} />
                  <span>{category}</span>
                  <strong>{count}</strong>
                </button>
              );
            })}
          </div>
        </section>
      ) : null}

      <section className="project-list" aria-label={view === 'list' ? 'All projects' : `${activeCategory} projects`}>
        <div className="project-list-heading">
          <span>{view === 'list' ? 'ALL PROJECTS' : activeCategory.toUpperCase()}</span>
          <strong>{visibleProjects.length} FILES</strong>
        </div>
        {visibleProjects.map((project, index) => (
          <article
            key={project.id}
            className="project-card"
            style={{ '--project-index': index } as CSSProperties}
          >
            <div>
              <span className="project-category">{project.category}</span>
              <h2>{project.title}</h2>
              <p>{project.description}</p>
            </div>
            <a href={project.repo} target="_blank" rel="noreferrer">
              <Code2 size={15} />
              GitHub Repo
              <ExternalLink size={13} />
            </a>
          </article>
        ))}
      </section>
    </article>
  );
}

function ExperiencePage() {
  const [activeItemId, setActiveItemId] = useState(experienceItems[0].id);
  const entryRefs = useRef<Record<string, HTMLElement | null>>({});
  const activeItem = experienceItems.find((item) => item.id === activeItemId) ?? experienceItems[0];
  const yearItems = useMemo(
    () => experienceItems.filter((item, index) => index === 0 || item.year !== experienceItems[index - 1].year),
    [],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];

        if (visible?.target.id) {
          setActiveItemId(visible.target.id);
        }
      },
      {
        root: null,
        rootMargin: '-24% 0px -58% 0px',
        threshold: [0.08, 0.18, 0.32, 0.5, 0.72],
      },
    );

    Object.values(entryRefs.current).forEach((node) => {
      if (node) observer.observe(node);
    });

    return () => observer.disconnect();
  }, []);

  function scrollToItem(id: string) {
    entryRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  return (
    <article className="experience-page">
      <header className="experience-hero">
        <p className="experience-kicker">LOAD EXPERIENCE.BAS</p>
        <h1>Experience</h1>
        <p>
          My experience is a mix of software development, product thinking, design, leadership,
          teaching, hands-on engineering, and community building. I started by building things,
          designing things, organizing events, and solving problems wherever I could.
        </p>
      </header>

      <div className="experience-grid">
        <aside className="experience-left" aria-label="Skill graph and project symbols">
          <SkillRadar axes={skillAxes} />
          <ProjectGlyphs activeShape={activeItem.shape} />
        </aside>

        <section className="experience-timeline" aria-label="Experience entries">
          {experienceItems.map((item, index) => {
            const Icon = item.icon;
            const startsYear = index === 0 || item.year !== experienceItems[index - 1].year;

            return (
              <div
                key={item.id}
                className={`experience-entry-wrap${item.image ? ' has-entry-image' : ''}`}
              >
                {startsYear ? (
                  <h2 id={`year-${item.year}`} className="experience-year-heading">
                    {item.year}
                    <span>{yearDeck(item.year)}</span>
                  </h2>
                ) : null}
                {item.image ? (
                  <figure className="experience-entry-image">
                    <img src={item.image.src} alt={item.image.alt} loading="lazy" />
                    <figcaption>{item.image.caption}</figcaption>
                  </figure>
                ) : null}
                <article
                  id={item.id}
                  ref={(node) => {
                    entryRefs.current[item.id] = node;
                  }}
                  className={`experience-card${activeItemId === item.id ? ' is-active' : ''}`}
                  style={{ '--card-index': index } as CSSProperties}
                >
                  <div className="experience-card-marker" aria-hidden="true">
                    <Icon size={19} />
                  </div>
                  <div className="experience-card-copy">
                    <div className="experience-card-topline">
                      <span>{item.period}</span>
                      {item.location ? <span>{item.location}</span> : null}
                    </div>
                    <h3>{item.title}</h3>
                    {item.organization ? <p className="experience-org">{item.organization}</p> : null}
                    <p>{item.summary}</p>
                    <details>
                      <summary>Read more</summary>
                      <ul>
                        {item.details.map((detail) => (
                          <li key={detail}>{detail}</li>
                        ))}
                      </ul>
                    </details>
                  </div>
                </article>
              </div>
            );
          })}
          <footer className="experience-summary">
            <h2>Closing Summary</h2>
            <p>
              Each stage added a different skill: robotics and drone building taught hands-on
              problem-solving, design taught visual communication, Model UN taught leadership,
              web development introduced digital products, teaching strengthened technical
              communication, and Daktronics added real professional experience.
            </p>
          </footer>
        </section>

        <TimelineNav
          items={experienceItems}
          yearItems={yearItems}
          activeItemId={activeItemId}
          activeLabel={`${activeItem.month} ${activeItem.year}`}
          onSelect={scrollToItem}
        />
      </div>
    </article>
  );
}

function yearDeck(year: string) {
  const decks: Record<string, string> = {
    '2026': 'Digital accessibility, automation, inclusive technology',
    '2025': 'Product, manufacturing, professional growth',
    '2024': 'Leadership, teaching, computer science, Daktronics',
    '2023': 'Moving to the United States and starting at SDSU',
    '2022': 'Web development, UI/UX, alumni work, applications',
    '2021': 'Model UN leadership, freelance design, early programming',
    '2020': 'A-Levels, design, video editing, creative growth',
    '2019': 'Robotics, drone building, Model United Nations',
    '2018': 'Early international Model UN experience',
  };

  return decks[year] ?? '';
}

function SkillRadar({ axes }: { axes: SkillAxis[] }) {
  const [activeAxis, setActiveAxis] = useState<SkillAxis>(axes[0]);
  const size = 320;
  const center = size / 2;
  const maxRadius = 116;
  const levels = [0.25, 0.5, 0.75, 1];
  const points = axes.map((axis, index) => {
    const angle = (Math.PI * 2 * index) / axes.length - Math.PI / 2;
    const radius = (axis.rating / 100) * maxRadius;

    return {
      axis,
      angle,
      x: center + Math.cos(angle) * radius,
      y: center + Math.sin(angle) * radius,
      labelX: center + Math.cos(angle) * (maxRadius + 30),
      labelY: center + Math.sin(angle) * (maxRadius + 30),
    };
  });
  const polygon = points.map((point) => `${point.x},${point.y}`).join(' ');

  return (
    <section className="skill-radar" aria-label="Portfolio skill spider graph">
      <div className="radar-heading">
        <span>PORTFOLIO SKILL AXIS</span>
        <strong>{activeAxis.rating}</strong>
      </div>
      <svg viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Interactive spider graph of portfolio skills">
        {levels.map((level) => (
          <polygon
            key={level}
            points={axes
              .map((_, index) => {
                const angle = (Math.PI * 2 * index) / axes.length - Math.PI / 2;
                const radius = maxRadius * level;
                return `${center + Math.cos(angle) * radius},${center + Math.sin(angle) * radius}`;
              })
              .join(' ')}
            className="radar-level"
          />
        ))}
        {points.map((point) => (
          <line
            key={`axis-${point.axis.label}`}
            x1={center}
            y1={center}
            x2={center + Math.cos(point.angle) * maxRadius}
            y2={center + Math.sin(point.angle) * maxRadius}
            className="radar-axis-line"
          />
        ))}
        <polygon points={polygon} className="radar-fill" />
        <polyline points={`${polygon} ${points[0].x},${points[0].y}`} className="radar-stroke" />
        {points.map((point) => (
          <g key={point.axis.label}>
            <circle
              cx={point.x}
              cy={point.y}
              r={activeAxis.label === point.axis.label ? 7 : 4.5}
              tabIndex={0}
              className={activeAxis.label === point.axis.label ? 'radar-dot is-active' : 'radar-dot'}
              onMouseEnter={() => setActiveAxis(point.axis)}
              onFocus={() => setActiveAxis(point.axis)}
            />
            <text
              x={point.labelX}
              y={point.labelY}
              textAnchor={point.labelX < center - 8 ? 'end' : point.labelX > center + 8 ? 'start' : 'middle'}
              dominantBaseline="middle"
              className={activeAxis.label === point.axis.label ? 'radar-label is-active' : 'radar-label'}
            >
              {shortSkillLabel(point.axis.label)}
            </text>
          </g>
        ))}
      </svg>
      <div className="radar-readout">
        <span>{activeAxis.label}</span>
        <div>
          <i style={{ width: `${activeAxis.rating}%` }} />
        </div>
      </div>
    </section>
  );
}

function shortSkillLabel(label: string) {
  return label
    .replace('Software Development', 'Software')
    .replace('Web & UI Design', 'Web/UI')
    .replace('Backend Systems', 'Backend')
    .replace('Data & Analytics', 'Data')
    .replace('AI / Computer Vision', 'AI/CV')
    .replace('Hardware Prototyping', 'Hardware')
    .replace('Product Thinking', 'Product')
    .replace('Technical Writing', 'Writing')
    .replace('Problem Solving', 'Problem');
}

function ProjectGlyphs({ activeShape }: { activeShape: ExperienceItem['shape'] }) {
  const glyphs: Array<{ key: ExperienceItem['shape']; label: string }> = [
    { key: 'code', label: '</>' },
    { key: 'screen', label: 'UI' },
    { key: 'chip', label: 'CPU' },
    { key: 'orbit', label: 'PATH' },
    { key: 'tool', label: 'BUILD' },
    { key: 'community', label: 'TEAM' },
  ];

  return (
    <section className="project-glyphs" aria-label="Experience symbols">
      {glyphs.map((glyph, index) => (
        <span
          key={glyph.key}
          className={`project-glyph project-glyph-${glyph.key}${activeShape === glyph.key ? ' is-active' : ''}`}
          style={{ '--glyph-index': index } as CSSProperties}
        >
          {glyph.label}
        </span>
      ))}
    </section>
  );
}

function TimelineNav({
  items,
  yearItems,
  activeItemId,
  activeLabel,
  onSelect,
}: {
  items: ExperienceItem[];
  yearItems: ExperienceItem[];
  activeItemId: string;
  activeLabel: string;
  onSelect: (id: string) => void;
}) {
  return (
    <aside className="timeline-nav" aria-label="Scroll timeline navigation">
      <div className="timeline-tooltip">{activeLabel}</div>
      <div className="timeline-track" aria-hidden="true" />
      {items.map((item) => {
        const isYear = yearItems.some((yearItem) => yearItem.id === item.id);
        return (
          <button
            key={item.id}
            type="button"
            className={`timeline-nav-item${isYear ? ' is-year' : ''}${activeItemId === item.id ? ' is-active' : ''}`}
            onClick={() => onSelect(item.id)}
            aria-label={`Scroll to ${item.title}, ${item.month} ${item.year}`}
          >
            <span className="timeline-marker" />
            {isYear ? <strong>{item.year}</strong> : null}
          </button>
        );
      })}
    </aside>
  );
}

function SectionRenderer({ title, lines }: { title: SectionKey; lines: string[] }) {
  return (
    <article className="section-renderer">
      <p className="line-system">REM ===== {title}.BAS =====</p>
      {lines.map((line, index) => (
        <p
          key={`${title}-${index}`}
          className={line.startsWith('REM') ? 'line-system' : undefined}
          style={{ '--line-index': index } as CSSProperties}
        >
          {colorizeLine(line)}
        </p>
      ))}
      <p className="line-system">REM ===== END {title}.BAS =====</p>
    </article>
  );
}

function colorizeLine(line: string) {
  const match = line.match(/^(.*?)(\".*\")(.*)$/);
  if (!match) return line || '\u00a0';

  const stringValue = match[2].slice(1, -1);
  const href = getStringTokenHref(stringValue);
  const stringToken = <span className="string-token">{match[2]}</span>;

  return (
    <>
      {match[1]}
      {href ? (
        <a href={href} target={href.startsWith('mailto:') ? undefined : '_blank'} rel="noreferrer">
          {stringToken}
        </a>
      ) : (
        stringToken
      )}
      {match[3]}
    </>
  );
}

function linkifyTerminalText(text: string) {
  const urlMatch = text.match(/https?:\/\/\S+/);
  if (!urlMatch) return text;

  const href = urlMatch[0];
  const before = text.slice(0, urlMatch.index);
  const after = text.slice((urlMatch.index ?? 0) + href.length);

  return (
    <>
      {before}
      <a href={href} target="_blank" rel="noreferrer">
        {href}
      </a>
      {after}
    </>
  );
}

function getStringTokenHref(value: string) {
  const urlMatch = value.match(/https?:\/\/\S+/);
  if (urlMatch) return urlMatch[0];

  const emailMatch = value.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  if (emailMatch) return `mailto:${emailMatch[0]}`;

  return null;
}

function WatermarkHint() {
  return (
    <p className="typewriter-line" aria-hidden="true">
      <span className="prompt-token">&gt;</span>
      <span className="typed-command" />
      <span className="cursor-mark">|</span>
    </p>
  );
}

function CommandInput({
  value,
  onChange,
  onRun,
  onKeyDown,
  inputRef,
}: {
  value: string;
  onChange: (value: string) => void;
  onRun: (value: string) => void;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  inputRef: RefObject<HTMLInputElement | null>;
}) {
  return (
    <div className="command-panel">
      <label htmlFor="command-input">===== Command =====</label>
      <div className="command-row">
        <span>READY&gt;</span>
        <input
          ref={inputRef}
          id="command-input"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={onKeyDown}
          autoComplete="off"
          spellCheck={false}
          aria-label="QBASIC command input"
        />
        <button onClick={() => onRun(value)} aria-label="Run command">
          <FileText size={14} />
          RUN
        </button>
      </div>
    </div>
  );
}

function StatusBar({ activeSection }: { activeSection: SectionKey | null }) {
  return (
    <footer className="status-bar">
      <span>OK</span>
      <span>Status</span>
      <span>{activeSection ? `${activeSection}.BAS` : 'Find'}</span>
      <span>1:39</span>
    </footer>
  );
}

export default App;
