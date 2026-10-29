import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import {
  analyticsConfigured,
  getAnalyticsConsent,
  initAnalytics,
  setAnalyticsConsent,
  trackEvent,
  trackPageView,
} from './analytics';
import type { AnalyticsConsent } from './analytics';
import aarpsLogo from './assets/aarps-logo.png';
import arrowUpIcon from './assets/arrow-up.svg';
import bb8Image from './assets/bb8.jpg';
import aarpsDesign from './assets/design/aarps.svg';
import bnksMunBadge from './assets/design/bnks-mun-badge.png';
import bnksMunDesign from './assets/design/bnks-mun.svg';
import icaftDesign from './assets/design/icaft-2021.svg';
import rpmunDesign from './assets/design/rpmun.svg';
import droneImage from './assets/drone.jpg';
import { CONTACT_SUBMITTED_KEY, ContactForm } from './ContactForm';
import { profilePhoto } from './profilePhoto';
import type { RouteKey } from './router';
import { handleInternalLinkClick, useRoute } from './router';
import { applyRouteMeta } from './seo';
import { testimonials } from './testimonials';

type NavRoute = 'work' | 'about' | 'contact';

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

type WorkCategory = 'Coding' | 'Graphic Design' | 'Leadership' | 'Other';

type WorkFilter = 'All' | WorkCategory;

type EntrySection = {
  label: string;
  entries: Entry[];
};

const navItems: Array<{ label: string; route: NavRoute }> = [
  { label: 'WORK', route: 'work' },
  { label: 'ABOUT', route: 'about' },
  { label: 'CONTACT', route: 'contact' },
];

const githubProfileUrl = 'https://github.com/rashil9955';
const linkedInUrl = 'https://www.linkedin.com/in/rshibak/';
const email = 'r@rshibak.com';
// Off until Cloudflare Email Routing is set up for rshibak.com (see README). Flip to true to show the form.
const contactFormEnabled = false;

const workSections: Array<EntrySection & { label: WorkCategory }> = [
  {
    label: 'Coding',
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
        title: 'Web Development — Local Schools & Companies',
        meta: '2022',
        description:
          'Built websites for local schools and businesses, bringing together front-end development, visual design, and practical client needs.',
      },
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
  {
    label: 'Graphic Design',
    entries: [
      {
        title: 'UI/UX Designer — Thekedar App',
        meta: 'August 2022',
        description:
          'Designed user flows and interface layouts for a platform connecting customers with local hardware and service providers. Focused on making the product straightforward to navigate.',
      },
      {
        title: 'Freelance Graphic Designer & Video Editor',
        meta: '2020 – 2022',
        description:
          'Created branding, logos, posters, thumbnails, videos, and social graphics for student clubs, events, and international esports teams.',
      },
    ],
  },
  {
    label: 'Leadership',
    entries: [
      {
        title: 'Secretary — Nepalese Students’ Association',
        meta: '2024 – Present',
        description:
          'Supported student-community events, communications, planning, and coordination for Nepalese students at South Dakota State University.',
      },
      {
        title: 'Teaching Assistant — CSC 100L',
        org: 'South Dakota State University',
        meta: 'August – December 2024 · Brookings, SD',
        description:
          'Supported a game development class of around 60 students. Held office hours, answered programming questions, and helped students work through lab exercises and game development assignments.',
      },
      {
        title: 'Founder — Reliance Public School Alumni Association',
        meta: '2022',
        href: 'https://alumni.rps.edu.np/',
        image: {
          src: aarpsLogo,
          // The logo is a link, so its alt text names where it goes.
          alt: 'AARPS (Alumni Association of Reliance Public School) website',
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
    ],
  },
  {
    label: 'Other',
    entries: [
      {
        title: 'Manufacturing Intern',
        org: 'Daktronics',
        meta: 'May 2024 – August 2026 · Brookings, SD',
        description:
          'Worked across manufacturing and live-events production, supporting the assembly and operation of electronic display products. Gained hands-on experience with production processes, quality, troubleshooting, and teamwork.',
      },
      {
        title: 'Seasonal Assembler',
        org: 'Daktronics',
        meta: 'Until May 2024 · Brookings, SD',
        description:
          'Assembled and prepared electronic display components in a manufacturing environment, following production instructions and quality standards while working with a team.',
      },
      {
        title: 'Custom Drone Project',
        meta: 'June 2019',
        description:
          'Built and tested a custom drone with friends, working with motors, propellers, electronic speed controllers, receivers, and the control system.',
        image: {
          src: droneImage,
          alt: 'The finished quadcopter, with green and red propellers, lying on a hand-drawn project poster',
          shape: 'landscape',
        },
      },
      {
        title: 'BB-8 Inspired Robot Project',
        meta: 'March 2019',
        description:
          'Built a rolling BB-8-inspired robot using a remote-controlled chassis and magnetic head coupling, experimenting with mechanical design and movement.',
        image: {
          src: bb8Image,
          alt: 'The hand-painted white and orange BB-8 robot on the floor, next to printed sketches of its design',
          shape: 'portrait',
        },
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

type Faq = {
  question: string;
  answer: ReactNode;
};

const faqs: Faq[] = [
  {
    question: 'What are you currently working on?',
    answer: (
      <>
        Finishing my Computer Science degree at South Dakota State University, and working as a
        Digital Accessibility Liaison on campus. Day to day, that means fixing reading order,
        document structure, and alt text so university content works for everyone, and writing
        Python tools to take the repetitive parts off people&rsquo;s plates.
      </>
    ),
  },
  {
    question: 'What kind of opportunities are you looking for?',
    answer: (
      <>
        Internships and early-career roles in software engineering, especially work that touches
        AI/ML, accessibility, data, or human-computer interaction. If it&rsquo;s about building
        something genuinely useful for real people, I&rsquo;d love to hear about it.
      </>
    ),
  },
  {
    question: 'Are you open to collaborations or freelance projects?',
    answer: (
      <>
        I&rsquo;m happy to hear about them. I&rsquo;ve done freelance graphic design, video editing,
        and websites for local schools and businesses before, so creative and web projects feel
        familiar. Send me the details and I&rsquo;ll tell you honestly whether I&rsquo;m a good fit
        and have the time.
      </>
    ),
  },
  {
    question: 'What areas of technology interest you most?',
    answer: (
      <>
        Software engineering, AI and machine learning, digital accessibility, and human-computer
        interaction, plus data, design, and the occasional creative project that doesn&rsquo;t fit
        neatly into any of those.
      </>
    ),
  },
  {
    question: 'What’s the best way to get in touch with you?',
    answer: (
      <>
        {contactFormEnabled ? (
          <>
            The <InternalLink href="/contact">contact form</InternalLink> is the easiest: it lands
            right in my inbox. You can also find me on{' '}
          </>
        ) : (
          <>The easiest way is a message on </>
        )}
        <a href={linkedInUrl} target="_blank" rel="noreferrer">
          LinkedIn
        </a>
        , or see what I&rsquo;m building on{' '}
        <a href={githubProfileUrl} target="_blank" rel="noreferrer">
          GitHub
        </a>
        .
      </>
    ),
  },
];

function App() {
  const route = useRoute();

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => trackSpotlight(), []);

  useEffect(() => {
    applyRouteMeta(route);
    trackPageView(document.title);
  }, [route]);

  return (
    <>
      <a className="skip-link" href="#content">
        Skip to content
      </a>
      <Page route={route} />
      <AnalyticsConsentBanner />
    </>
  );
}

// Feeds the pointer position to the big titles, which tint the letters near the cursor (see .display-title in styles.css).
function trackSpotlight() {
  const handleMove = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse') return;
    const target = event.target instanceof Element ? event.target.closest<HTMLElement>('.display-title, .side-word') : null;
    if (!target) return;
    const rect = target.getBoundingClientRect();
    target.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
    target.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
  };

  document.addEventListener('pointermove', handleMove, { passive: true });
  return () => document.removeEventListener('pointermove', handleMove);
}

function Page({ route }: { route: RouteKey }) {
  switch (route) {
    case 'home':
      return <HomePage />;
    case 'work':
      return <WorkPage />;
    case 'about':
      return (
        <SectionPage title="ABOUT" marquee="ABOUT ME" active="about">
          <div className="about-intro">
            <div className="about-copy">
              <p>
                Hi, I&rsquo;m Rashil Shibakoti, a Computer Science student at South Dakota State
                University from Nepal. I&rsquo;m interested in software engineering, cybersecurity,
                data systems, AI, and Natural Language Processing.
              </p>
              <p>
                My first programming experience was with QBASIC, which introduced me to the
                excitement of building things with code. Since then, my focus has grown toward
                creating practical software systems that solve real problems.
              </p>
              <p>
                I have worked on projects involving fraud detection, data cleansing, risk scoring,
                secure communication, object detection, databases, and web dashboards. I enjoy
                connecting backend logic, clean design, and real-world usefulness.
              </p>
              <p>
                This website is a place to share my projects, experience, and growth as I continue
                becoming a stronger software engineer.
              </p>
            </div>
            <ProfilePhoto />
          </div>
          <EntrySections sections={aboutSections} />
          <FaqSection />
        </SectionPage>
      );
    case 'contact':
      return (
        <SectionPage title="CONTACT" marquee="SAY HELLO" active="contact">
          {contactFormEnabled ? <ContactForm /> : null}
          <EntrySections sections={contactSections} />
        </SectionPage>
      );
    case 'privacy':
      return (
        <SectionPage title="PRIVACY" marquee="PRIVACY POLICY">
          <PrivacyPolicy />
        </SectionPage>
      );
    case 'thankYou':
      return (
        <SectionPage title="THANK YOU" marquee="MESSAGE RECEIVED">
          <ThankYou />
        </SectionPage>
      );
    case 'notFound':
      return (
        <SectionPage title="404" marquee="NOTHING HERE" titleClassName="not-found-title">
          <NotFound />
        </SectionPage>
      );
  }
}

function HomePage() {
  return (
    <main className="page home-page">
      <div className="home-spacer home-spacer-top" />
      <Marquee text="RASHIL SHIBAKOTI    RASHIL SHIBAKOTI   " />
      <div className="home-spacer home-spacer-title" />
      <h1 className="display-title">RUSH S.</h1>
      <div className="home-spacer home-spacer-bio" />
      <div id="content" className="home-bio" tabIndex={-1}>
        <p>A few too many planets in one house,</p>
        <p>and a few too many interests in one person.</p>
        <p>I write, code, design, cook, and occasionally get lost in conversations.</p>
        <p>Somewhere along the way, I also found a love for making technology more accessible.</p>
        <p>Mostly, I just enjoy the art of figuring things out.</p>
      </div>
      <p className="home-cta">
        Have something interesting in mind? Let&rsquo;s talk.{' '}
        <InternalLink
          href="/contact"
          onNavigate={() => trackEvent({ name: 'cta_click', params: { cta: 'home_get_in_touch' } })}
        >
          Get in touch&nbsp;&rarr;
        </InternalLink>
      </p>
      <div className="home-spacer home-spacer-nav" />
      <SiteNav />
    </main>
  );
}

const workFilters: WorkFilter[] = ['All', ...workSections.map((section) => section.label)];

// Pieces for the Graphic Design collage; each `id` maps to a position in styles.css.
const designPieces: Array<{ id: string; src: string; alt: string; width: number; height: number }> = [
  {
    id: 'aarps',
    src: aarpsDesign,
    alt: 'AARPS logo for the Alumni Association of Reliance Public School',
    width: 346,
    height: 327,
  },
  {
    id: 'bnks-badge',
    src: bnksMunBadge,
    alt: 'BNKS MUN 2021 name placard for Rashil Shibakoti, Chairperson, UNODC',
    width: 1100,
    height: 782,
  },
  { id: 'icaft', src: icaftDesign, alt: 'ICAFT 2021 logo', width: 233, height: 308 },
  { id: 'bnks-mun', src: bnksMunDesign, alt: 'BNKS MUN 2021 logo', width: 1029, height: 338 },
  {
    id: 'rpmun',
    src: rpmunDesign,
    alt: 'RPMUN logo for Reliance Public School Model United Nations',
    width: 318,
    height: 332,
  },
];

function DesignCollage() {
  return (
    <section className="design-collage" aria-labelledby="design-collage-heading">
      <h2 id="design-collage-heading" className="visually-hidden">
        Graphic Design
      </h2>
      {designPieces.map((piece) => (
        <img
          key={piece.id}
          className={`design-piece design-piece-${piece.id}`}
          src={piece.src}
          alt={piece.alt}
          width={piece.width}
          height={piece.height}
          loading="lazy"
          decoding="async"
        />
      ))}
    </section>
  );
}

function WorkPage() {
  const [filter, setFilter] = useState<WorkFilter>('All');
  const sections = filter === 'All' ? workSections : workSections.filter((section) => section.label === filter);

  const chooseFilter = (next: WorkFilter) => {
    setFilter(next);
    // The list starts well below the hero, so bring it into view to show what changed.
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById('content')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  return (
    <SectionPage
      title="WORK"
      marquee="MY WORK"
      active="work"
      // The collage runs to the right edge, where the side word would sit on top of it.
      sideWord={filter === 'Graphic Design' ? undefined : 'WORK'}
      heroExtra={
        <div className="work-filters" role="group" aria-label="Filter work by category">
          {workFilters.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={filter === option}
              onClick={() => chooseFilter(option)}
            >
              <span className="site-nav-label" data-label={option.toUpperCase()}>
                {option.toUpperCase()}
              </span>
            </button>
          ))}
        </div>
      }
    >
      {filter === 'Graphic Design' ? <DesignCollage /> : <EntrySections sections={sections} />}
      <Testimonials />
    </SectionPage>
  );
}

function SectionPage({
  title,
  marquee,
  active,
  sideWord,
  titleClassName,
  heroExtra,
  children,
}: {
  title: string;
  marquee: string;
  active?: NavRoute;
  sideWord?: string;
  titleClassName?: string;
  heroExtra?: ReactNode;
  children: ReactNode;
}) {
  return (
    <main className="page section-page">
      <header className="section-hero">
        <Marquee text={`${marquee}   ${marquee}   ${marquee} `} />
        <h1 className={`display-title section-title${titleClassName ? ` ${titleClassName}` : ''}`}>
          {title}
        </h1>
        <SiteNav active={active} label="Main navigation" />
        {heroExtra}
      </header>
      <div id="content" className="section-body" tabIndex={-1}>
        {sideWord ? (
          <span className="side-word" aria-hidden="true">
            {sideWord}
          </span>
        ) : null}
        {children}
      </div>
      <footer className="section-footer">
        <InternalLink href="/privacy" className="footer-privacy">
          Privacy
        </InternalLink>
        <SiteNav active={active} label="Footer navigation" />
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

function SiteNav({ active, label = 'Main navigation' }: { active?: NavRoute; label?: string }) {
  return (
    <nav className="site-nav" aria-label={label}>
      {navItems.map((item) => {
        // The current page's slot links back home instead.
        const { label, href } = active === item.route ? { label: 'ME', href: '/' } : { label: item.label, href: `/${item.route}` };
        return (
          <InternalLink key={item.route} href={href}>
            {/* Always reserve the page name's width, so swapping in "ME" doesn't shift the row. */}
            <span className="site-nav-label" data-label={item.label}>
              {label}
            </span>
          </InternalLink>
        );
      })}
    </nav>
  );
}

function InternalLink({
  href,
  className,
  children,
  onNavigate,
  'aria-current': ariaCurrent,
}: {
  href: string;
  className?: string;
  children: ReactNode;
  onNavigate?: () => void;
  'aria-current'?: 'page';
}) {
  return (
    <a
      href={href}
      className={className}
      aria-current={ariaCurrent}
      onClick={(event) => {
        onNavigate?.();
        handleInternalLinkClick(event);
      }}
    >
      {children}
    </a>
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
      decoding="async"
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

function FaqSection() {
  return (
    <section className="entry-section faq" aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="entry-section-label">
        A Few Questions
      </h2>
      {faqs.map((faq) => (
        <article key={faq.question} className="entry">
          <h3 className="entry-title">{faq.question}</h3>
          <p className="entry-description">{faq.answer}</p>
        </article>
      ))}
    </section>
  );
}

function ProfilePhoto() {
  if (!profilePhoto) return null;

  return (
    <img
      className="profile-photo"
      src={profilePhoto.src}
      width={profilePhoto.width}
      height={profilePhoto.height}
      alt={profilePhoto.alt}
      decoding="async"
    />
  );
}

function Testimonials() {
  if (testimonials.length === 0) return null;

  return (
    <section className="entry-section testimonials" aria-labelledby="testimonials-heading">
      <h2 id="testimonials-heading" className="entry-section-label">
        Kind Words
      </h2>
      {testimonials.map((testimonial) => (
        <figure key={`${testimonial.name}-${testimonial.quote.slice(0, 24)}`} className="entry">
          <blockquote className="entry-description">
            <p>&ldquo;{testimonial.quote}&rdquo;</p>
          </blockquote>
          <figcaption className="entry-meta">
            {testimonial.href ? (
              <a href={testimonial.href} target="_blank" rel="noreferrer">
                {testimonial.name}
              </a>
            ) : (
              testimonial.name
            )}
            {[testimonial.role, testimonial.organization].filter(Boolean).length
              ? `, ${[testimonial.role, testimonial.organization].filter(Boolean).join(', ')}`
              : null}
            {testimonial.relationship ? ` · ${testimonial.relationship}` : null}
          </figcaption>
        </figure>
      ))}
    </section>
  );
}

function ThankYou() {
  // Only claim success when this browser session actually submitted the form.
  const [submitted] = useState(() => {
    try {
      return window.sessionStorage.getItem(CONTACT_SUBMITTED_KEY) === '1';
    } catch {
      return false;
    }
  });

  return (
    <section className="entry-section message-block" aria-label="Confirmation">
      {submitted ? (
        <>
          <p className="message-lead">Your message made it through. I&rsquo;ll be in touch soon.</p>
          <p className="entry-description">
            Thanks for taking the time to write. While you wait, feel free to wander around{' '}
            <InternalLink href="/work">my work</InternalLink>.
          </p>
        </>
      ) : (
        <>
          <p className="message-lead">Looking to send me a message?</p>
          <p className="entry-description">
            This page shows up after you send one through the{' '}
            <InternalLink href="/contact">contact form</InternalLink>.
          </p>
        </>
      )}
      <p className="message-actions">
        <InternalLink href="/" className="pill-link">
          Back to the homepage
        </InternalLink>
      </p>
    </section>
  );
}

function NotFound() {
  return (
    <section className="entry-section message-block" aria-label="Page not found">
      <p className="message-lead">This page wandered off. Probably out figuring things out.</p>
      <p className="entry-description">
        The link might be old, or there might be a typo in the address. Either way, there&rsquo;s
        nothing here, but the rest of the site is right where I left it.
      </p>
      <p className="message-actions">
        <InternalLink
          href="/"
          className="pill-link"
          onNavigate={() => trackEvent({ name: 'cta_click', params: { cta: 'not_found_home' } })}
        >
          Take me home
        </InternalLink>
      </p>
    </section>
  );
}

function PrivacyPolicy() {
  const [consent, setConsent] = useState<AnalyticsConsent | null>(() => getAnalyticsConsent());

  function choose(next: AnalyticsConsent) {
    setAnalyticsConsent(next);
    setConsent(next);
  }

  return (
    <div className="privacy">
      <p className="entry-meta privacy-updated">Last updated October 28, 2026</p>
      <p className="about-copy">
        This is a personal website, so I keep things simple: I only collect what I need to read and
        reply to your messages. Here&rsquo;s exactly what happens, in plain language.
      </p>

      <PrivacySection title="The contact form">
        <p>
          When you use the form on the <InternalLink href="/contact">Contact</InternalLink> page, it
          collects your name, your email address, and your message. That&rsquo;s it.
        </p>
        <p>
          Your message is turned into an email by the code that runs this site on Cloudflare, and
          sent through Cloudflare Email Routing to my personal Gmail inbox. The site itself
          doesn&rsquo;t save a copy anywhere else. Once it arrives, it lives in my Gmail account like
          any other email, which Google stores under its own privacy policy.
        </p>
        <p>
          I use what you send only to read and reply to your message. I don&rsquo;t add you to a
          mailing list, and I don&rsquo;t sell or share your details.
        </p>
        <p>
          To limit spam, the form uses your IP address to stop too many messages from being sent too
          quickly. It also includes a hidden field that only bots tend to fill in.
        </p>
      </PrivacySection>

      <PrivacySection title="Analytics">
        {analyticsConfigured ? (
          <>
            <p>
              This site can use Google Analytics 4 to understand which pages people visit and how
              they find the site, but only if you say yes. Until you agree, the Google Analytics
              script isn&rsquo;t loaded at all.
            </p>
            <p>
              If you agree, Google Analytics records things like the pages you view, roughly where
              you&rsquo;re visiting from, your device and browser, and two events: clicks on the
              &ldquo;Get in touch&rdquo; link and whether a contact-form submission succeeded. Your
              name, email address, and message are never sent to Google Analytics.
            </p>
            <p className="privacy-choice">
              Your current choice:{' '}
              <strong>
                {consent === 'granted' ? 'allowed' : consent === 'denied' ? 'not allowed' : 'not chosen yet'}
              </strong>
              .{' '}
              {consent === 'granted' ? (
                <button type="button" className="text-button" onClick={() => choose('denied')}>
                  Turn analytics off
                </button>
              ) : (
                <button type="button" className="text-button" onClick={() => choose('granted')}>
                  Allow analytics
                </button>
              )}
            </p>
          </>
        ) : (
          <p>
            Google Analytics is not turned on for this site right now, so no analytics scripts run
            and nothing is tracked.
          </p>
        )}
      </PrivacySection>

      <PrivacySection title="Cookies and local storage">
        <p>
          This site doesn&rsquo;t set any cookies of its own.{' '}
          {analyticsConfigured
            ? 'If you allow analytics, Google Analytics sets its own cookies (named _ga and _ga_ followed by an ID) to tell visits apart. Turning analytics off above removes them. '
            : ''}
          Your browser&rsquo;s local storage is used to remember your analytics choice, and session
          storage briefly notes that you just sent a message so the thank-you page shows the right
          thing.
        </p>
        <p>
          Cloudflare, which hosts the site, may set strictly necessary cookies to protect it from
          abuse.
        </p>
      </PrivacySection>

      <PrivacySection title="Services involved">
        <ul className="privacy-list">
          <li>
            <strong>Cloudflare</strong> hosts this site, runs the contact form, and delivers its
            emails. Like any web host, it processes technical details such as your IP address and
            the pages you request in order to serve and secure the site, and may keep request logs.{' '}
            <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noreferrer">
              Cloudflare&rsquo;s privacy policy
            </a>
          </li>
          <li>
            <strong>Google Fonts</strong> serves the fonts on this site, so your browser shares your
            IP address with Google when it downloads them.{' '}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">
              Google&rsquo;s privacy policy
            </a>
          </li>
          <li>
            <strong>Gmail</strong> (Google) is where contact-form messages end up.
          </li>
          {analyticsConfigured ? (
            <li>
              <strong>Google Analytics</strong> measures visits, only if you allow it.
            </li>
          ) : null}
        </ul>
      </PrivacySection>

      <PrivacySection title="Deleting what you sent">
        <p>
          Want me to delete a message you sent? Email me at{' '}
          <a href="mailto:rashil9955@gmail.com">rashil9955@gmail.com</a>, ideally from the same
          address you used in the form, and I&rsquo;ll delete it from my inbox.
        </p>
      </PrivacySection>

      <PrivacySection title="Questions">
        <p>
          If anything here is unclear, or you have a question about your information, write to me at{' '}
          <a href="mailto:rashil9955@gmail.com">rashil9955@gmail.com</a>.
        </p>
      </PrivacySection>
    </div>
  );
}

function PrivacySection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="entry-section privacy-section">
      <h2 className="entry-section-label">{title}</h2>
      <div className="privacy-body">{children}</div>
    </section>
  );
}

function AnalyticsConsentBanner() {
  const [consent, setConsent] = useState<AnalyticsConsent | null>(() => getAnalyticsConsent());

  if (!analyticsConfigured || consent) return null;

  function choose(next: AnalyticsConsent) {
    setAnalyticsConsent(next);
    setConsent(next);
  }

  return (
    <aside className="consent-banner" aria-label="Analytics choice">
      <p>
        Mind if I use Google Analytics to see which pages people visit? No names, emails, or
        messages are ever sent. <InternalLink href="/privacy">Privacy</InternalLink>
      </p>
      <div className="consent-actions">
        <button type="button" className="text-button" onClick={() => choose('granted')}>
          Sure
        </button>
        <button type="button" className="text-button" onClick={() => choose('denied')}>
          No thanks
        </button>
      </div>
    </aside>
  );
}

export default App;
