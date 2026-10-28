import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import bb8Image from '../bb8.jpg';
import droneImage from '../drone.jpg';
import aarpsLogo from './assets/aarps-logo.png';
import arrowUpIcon from './assets/arrow-up.svg';

type Route = 'home' | 'work' | 'about' | 'contact';

type Entry = {
  title: string;
  org?: string;
  meta: string;
  description?: string;
  href?: string;
  image?: {
    src: string;
    alt: string;
    shape: 'portrait' | 'landscape' | 'logo';
  };
};

type EntrySection = {
  label: string;
  entries: Entry[];
};

const navItems: Array<{ label: string; route: Exclude<Route, 'home'> }> = [
  { label: 'WORK', route: 'work' },
  { label: 'ABOUT', route: 'about' },
  { label: 'CONTACT', route: 'contact' },
];

const pageTitles: Record<Route, string> = {
  home: 'Rashil Shibakoti',
  work: 'Work — Rashil Shibakoti',
  about: 'About — Rashil Shibakoti',
  contact: 'Contact — Rashil Shibakoti',
};

const githubProfileUrl = 'https://github.com/rashil9955';
const linkedInUrl = 'https://www.linkedin.com/in/rshibak/';
const email = 'r@rshibak.com';

const workSections: EntrySection[] = [
  {
    label: 'Professional Experience',
    entries: [
      {
        title: 'Digital Accessibility Liaison',
        org: 'South Dakota State University',
        meta: 'February 2026 – Present · Brookings, SD',
        href: 'https://www.sdstate.edu/digital-accessibility-hub/meet-our-student-liaisons',
        description:
          'I help make university documents and digital content more accessible, from fixing reading order and document structure to improving alternative text. I also build Python tools to automate repetitive accessibility tasks.',
      },
      {
        title: 'Manufacturing Intern',
        org: 'Daktronics',
        meta: 'May 2024 – August 2026 · Brookings, SD',
        description:
          'Worked across manufacturing and live-events production, supporting the assembly and operation of electronic display products. Gained hands-on experience with production processes, quality, troubleshooting, and teamwork.',
      },
      {
        title: 'Teaching Assistant — CSC 100L',
        org: 'South Dakota State University',
        meta: 'August – December 2024 · Brookings, SD',
        description:
          'Supported a game development class of around 60 students. Held office hours, answered programming questions, and helped students work through lab exercises and game development assignments.',
      },
      {
        title: 'Seasonal Assembler',
        org: 'Daktronics',
        meta: 'Until May 2024 · Brookings, SD',
        description:
          'Assembled and prepared electronic display components in a manufacturing environment, following production instructions and quality standards while working with a team.',
      },
    ],
  },
  {
    label: 'Projects & Creative Work',
    entries: [
      {
        title: 'UI/UX Designer — Thekedar App',
        meta: 'August 2022',
        description:
          'Designed user flows and interface layouts for a platform connecting customers with local hardware and service providers. Focused on making the product straightforward to navigate.',
      },
      {
        title: 'Web Development — Local Schools & Companies',
        meta: '2022',
        description:
          'Built websites for local schools and businesses, bringing together front-end development, visual design, and practical client needs.',
      },
      {
        title: 'Freelance Graphic Designer & Video Editor',
        meta: '2020 – 2022',
        description:
          'Created branding, logos, posters, thumbnails, videos, and social graphics for student clubs, events, and international esports teams.',
      },
      {
        title: 'Custom Drone Project',
        meta: 'June 2019',
        description:
          'Built and tested a custom drone with friends, working with motors, propellers, electronic speed controllers, receivers, and the control system.',
        image: { src: droneImage, alt: 'Custom drone build', shape: 'landscape' },
      },
      {
        title: 'BB-8 Inspired Robot Project',
        meta: 'March 2019',
        description:
          'Built a rolling BB-8-inspired robot using a remote-controlled chassis and magnetic head coupling, experimenting with mechanical design and movement.',
        image: { src: bb8Image, alt: 'BB-8 inspired robot prototype', shape: 'portrait' },
      },
    ],
  },
  {
    label: 'Leadership & Community',
    entries: [
      {
        title: 'Founder — Reliance Public School Alumni Association',
        meta: '2022',
        href: 'https://alumni.rps.edu.np/',
        image: {
          src: aarpsLogo,
          alt: 'Alumni Association of Reliance Public School (AARPS) logo',
          shape: 'logo',
        },
        description:
          'Started an alumni association to connect graduates, strengthen the school community, and create opportunities for alumni to support one another.',
      },
      {
        title: 'Model United Nations — Organizer, Chair & Delegate',
        meta: '2018 – 2022',
        description:
          'Helped organize Model UN conferences, including events with roughly 150–250 participants. Chaired SOCHUM and a Historical Crisis Committee, developed leadership and public-speaking skills, and participated internationally at THAIMUN in Bangkok.',
      },
      {
        title: 'Secretary — Nepalese Students’ Association',
        meta: '2024 – Present',
        description:
          'Supported student-community events, communications, planning, and coordination for Nepalese students at South Dakota State University.',
      },
    ],
  },
  {
    label: 'Code Projects',
    entries: [
      {
        title: 'Portfolio Website',
        meta: 'Web Apps',
        description: 'This website, built with React, TypeScript, and Vite.',
        href: 'https://github.com/rashil9955/Portfolio-Website',
      },
      {
        title: 'Fraud Detection System',
        meta: 'AI / Data',
        description:
          'A machine learning project for identifying suspicious transaction patterns and explaining fraud risk.',
        href: 'https://github.com/rashil9955/Fraud-Detection-System',
      },
      {
        title: 'Data Cleansing Toolkit',
        meta: 'AI / Data',
        description:
          'Scripts and workflows for cleaning inconsistent datasets before analysis, reporting, or modeling.',
      },
      {
        title: 'Risk Scoring Dashboard',
        meta: 'AI / Data',
        description:
          'A dashboard concept that turns raw indicators into readable risk scores and decision-support views.',
      },
      {
        title: 'Object Detection Experiment',
        meta: 'AI / Data',
        description:
          'A computer vision build exploring object detection workflows and practical image analysis.',
      },
      {
        title: 'Secure Communication App',
        meta: 'Security',
        description:
          'A secure messaging experiment focused on encryption concepts, authentication, and safe data handling.',
      },
      {
        title: 'Accessibility Automation',
        meta: 'Security',
        description:
          'Python automation for finding document and web accessibility issues more efficiently.',
      },
      {
        title: 'Web Analytics Dashboard',
        meta: 'Web Apps',
        description:
          'A web dashboard for organizing metrics, visual summaries, and user-facing data views.',
      },
      {
        title: 'Database Management System',
        meta: 'Systems',
        description:
          'A coursework-driven database project focused on schema design, queries, and structured records.',
      },
      {
        title: 'C# Coursework Apps',
        meta: 'Systems',
        description:
          'Object-oriented programming projects built while learning C#, application structure, and persistence.',
      },
    ],
  },
];

const aboutSections: EntrySection[] = [
  {
    label: 'Education',
    entries: [
      {
        title: 'B.S. Computer Science',
        org: 'South Dakota State University',
        meta: 'July 2023 – Present · Brookings, SD',
      },
      {
        title: 'CIE A-Levels',
        org: 'Budhanilkantha School',
        meta: 'August 2020 – June 2022 · Kathmandu, Nepal',
      },
      {
        title: 'High School',
        org: 'Reliance Public School',
        meta: 'Graduated 2020',
      },
    ],
  },
  {
    label: 'Focus Areas',
    entries: [
      {
        title: 'Software, Data & Security',
        meta: 'What I build',
        description:
          'Software development, backend systems, data and analytics, cybersecurity, AI and computer vision, and Natural Language Processing.',
      },
      {
        title: 'Design, Hardware & Writing',
        meta: 'What I bring to it',
        description:
          'Web and UI design, hardware prototyping, product thinking, technical writing, and a lot of problem solving.',
      },
    ],
  },
];

const contactSections: EntrySection[] = [
  {
    label: 'Get in Touch',
    entries: [
      { title: 'Email', meta: email, href: `mailto:${email}` },
      { title: 'LinkedIn', meta: 'linkedin.com/in/rshibak', href: linkedInUrl },
      { title: 'GitHub', meta: 'github.com/rashil9955', href: githubProfileUrl },
    ],
  },
];

function parseRoute(hash: string): Route {
  const route = hash.replace(/^#\/?/, '').toLowerCase();
  return route === 'work' || route === 'about' || route === 'contact' ? route : 'home';
}

function useHashRoute() {
  const [route, setRoute] = useState<Route>(() => parseRoute(window.location.hash));

  useEffect(() => {
    const onHashChange = () => {
      setRoute(parseRoute(window.location.hash));
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    document.title = pageTitles[route];
  }, [route]);

  return route;
}

function App() {
  const route = useHashRoute();

  if (route === 'work') {
    return (
      <SectionPage title="WORK" marquee="MY WORK" active="work" sideWord="WORK">
        <EntrySections sections={workSections} />
      </SectionPage>
    );
  }

  if (route === 'about') {
    return (
      <SectionPage title="ABOUT" marquee="ABOUT ME" active="about">
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
        <EntrySections sections={aboutSections} />
      </SectionPage>
    );
  }

  if (route === 'contact') {
    return (
      <SectionPage title="CONTACT" marquee="SAY HELLO" active="contact">
        <EntrySections sections={contactSections} />
      </SectionPage>
    );
  }

  return <HomePage />;
}

function HomePage() {
  return (
    <main className="page home-page">
      <div className="home-spacer home-spacer-top" />
      <Marquee text="RASHIL SHIBAKOTI    RASHIL SHIBAKOTI   " />
      <div className="home-spacer home-spacer-title" />
      <h1 className="display-title">RUSH S.</h1>
      <div className="home-spacer home-spacer-bio" />
      <div className="home-bio">
        <p>A few too many planets in one house,</p>
        <p>and a few too many interests in one person.</p>
        <p>I write, code, design, cook, and occasionally get lost in conversations.</p>
        <p>Somewhere along the way, I also found a love for making technology more accessible.</p>
        <p>Mostly, I just enjoy the art of figuring things out.</p>
      </div>
      <div className="home-spacer home-spacer-nav" />
      <SiteNav />
    </main>
  );
}

function SectionPage({
  title,
  marquee,
  active,
  sideWord,
  children,
}: {
  title: string;
  marquee: string;
  active: Exclude<Route, 'home'>;
  sideWord?: string;
  children: ReactNode;
}) {
  return (
    <main className="page section-page">
      <header className="section-hero">
        <Marquee text={`${marquee}   ${marquee}   ${marquee} `} />
        <h1 className="display-title section-title">{title}</h1>
        <SiteNav active={active} />
      </header>
      <div className="section-body">
        {sideWord ? (
          <span className="side-word" aria-hidden="true">
            {sideWord}
          </span>
        ) : null}
        {children}
      </div>
      <footer className="section-footer">
        <SiteNav active={active} />
        <button
          type="button"
          className="back-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
        >
          <img src={arrowUpIcon} width={32} height={32} alt="" />
        </button>
      </footer>
    </main>
  );
}

function Marquee({ text }: { text: string }) {
  const run = text.repeat(6);

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        <span>{run}</span>
        <span>{run}</span>
      </div>
    </div>
  );
}

function SiteNav({ active }: { active?: Exclude<Route, 'home'> }) {
  return (
    <nav className="site-nav" aria-label="Main navigation">
      {navItems.map((item) => (
        <a
          key={item.route}
          href={`#/${item.route}`}
          className={active === item.route ? 'is-active' : undefined}
          aria-current={active === item.route ? 'page' : undefined}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}

function EntrySections({ sections }: { sections: EntrySection[] }) {
  return (
    <>
      {sections.map((section) => (
        <section key={section.label} className="entry-section" aria-label={section.label}>
          <h2 className="entry-section-label">{section.label}</h2>
          {section.entries.map((entry) => (
            <article key={entry.title} className="entry">
              <h3 className="entry-title">
                {entry.href ? (
                  <a
                    href={entry.href}
                    target={entry.href.startsWith('mailto:') ? undefined : '_blank'}
                    rel="noreferrer"
                  >
                    {entry.title}
                  </a>
                ) : (
                  entry.title
                )}
                {entry.org ? <span className="entry-org"> | {entry.org}</span> : null}
              </h3>
              <p className="entry-meta">{entry.meta}</p>
              {entry.description ? <p className="entry-description">{entry.description}</p> : null}
              {entry.image ? <EntryImage entry={entry} /> : null}
            </article>
          ))}
        </section>
      ))}
    </>
  );
}

function EntryImage({ entry }: { entry: Entry }) {
  if (!entry.image) return null;

  const image = (
    <img
      className={`entry-image entry-image-${entry.image.shape}`}
      src={entry.image.src}
      alt={entry.image.alt}
      loading="lazy"
    />
  );

  return entry.href ? (
    <a href={entry.href} target="_blank" rel="noreferrer">
      {image}
    </a>
  ) : (
    image
  );
}

export default App;
