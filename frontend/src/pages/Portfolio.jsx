import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../context/DataContext';
import api from '../api/axios';
import BookCallLink from '../components/BookCallLink';
import { mediaUrl } from '../utils/mediaUrl';
import '../components/PillNavbar.css';
import './Portfolio.css';

const useInView = (threshold = 0.12) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setVisible(true);
    }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
};

const scrollTo = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

function Navbar({ settings, onNavigate }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const links = [
    { label: 'Clients', target: 'testimonials' },
    { label: 'Services', target: 'services' },
    { label: 'About Us', target: 'about' },
    { label: 'Resources', target: 'work' },
  ];

  const go = (id) => {
    setOpen(false);
    scrollTo(id);
  };

  return (
    <header className={`pill-nav-wrap pf-nav-wrap ${scrolled ? 'scrolled' : ''}`}>
      <div className="pill-nav">
        <button
          type="button"
          className="pill-nav-logo"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="rabeeh home"
        >
          <div className="pill-nav-logo-circle">
            <span className="pill-nav-logo-letter">R</span>
          </div>
        </button>

        <ul className="pill-nav-links">
          {links.map((l) => (
            <li key={l.label}>
              <button type="button" onClick={() => go(l.target)}>{l.label}</button>
            </li>
          ))}
        </ul>

        <div className="pill-nav-actions">
          <BookCallLink
            settings={settings}
            className="btn-primary pill-nav-cta"
            onNavigate={(id) => go(id)}
          />
          <button
            type="button"
            className="pill-nav-toggle"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      <div className={`pill-nav-mobile ${open ? 'open' : ''}`}>
        {links.map((l) => (
          <button key={l.label} type="button" onClick={() => go(l.target)}>{l.label}</button>
        ))}
        <BookCallLink
          settings={settings}
          className="btn-primary"
          onNavigate={(id) => go(id)}
        />
      </div>
    </header>
  );
}

function Hero({ settings, onNavigate }) {
  const [ref, vis] = useInView(0.08);

  return (
    <section id="home" className={`hero-section ${vis ? 'in-view' : ''}`} ref={ref}>
      <div className="hero-bg" aria-hidden="true">
        <div className="hero-wave hero-wave-1" />
        <div className="hero-wave hero-wave-2" />
        <div className="hero-wave hero-wave-3" />
      </div>

      <div className="container hero-content">
        <div className="hero-badge">
          <div className="badge-avatars">
            <div className="badge-avatar av-1" />
            <div className="badge-avatar av-2" />
            <div className="badge-avatar av-3" />
          </div>
          TRUSTED BY 100+ COMPANIES WORLDWIDE
        </div>

        {settings?.heroHeading && (
          <h1 className="hero-title">{settings.heroHeading}</h1>
        )}

        {settings?.heroSub && (
          <p className="hero-sub">{settings.heroSub}</p>
        )}

        <div className="hero-ctas">
          <BookCallLink
            settings={settings}
            className="btn-primary"
            onNavigate={onNavigate}
          />
          <button type="button" className="btn-ghost" onClick={() => scrollTo('about')}>
            Know More
          </button>
        </div>
      </div>
    </section>
  );
}

function About({ settings }) {
  const [ref, vis] = useInView();
  const [imgError, setImgError] = useState(false);
  const tags = settings?.aboutTags || [];
  const customImage = settings?.aboutImage?.trim();
  const portraitSrc = customImage ? mediaUrl(customImage) : '';

  useEffect(() => {
    setImgError(false);
  }, [portraitSrc]);

  return (
    <section id="about" className={`about-section ${vis ? 'in-view' : ''}`} ref={ref}>
      <div className="container about-grid">
        {portraitSrc && (
          <div className="about-img-wrap">
            <div className="about-img-frame">
              {!imgError && (
                <img
                  key={portraitSrc}
                  src={portraitSrc}
                  alt="Founder portrait"
                  className="about-portrait"
                  onError={() => setImgError(true)}
                />
              )}
              <div className={`about-portrait-fallback ${imgError ? 'visible' : ''}`} aria-hidden="true">
                <span>R</span>
              </div>
            </div>
          </div>
        )}

        <div className="about-text">
          {(settings?.aboutHeading || settings?.aboutHeadingAccent) && (
            <h2 className="about-heading">
              {settings?.aboutHeading}{' '}
              {settings?.aboutHeadingAccent && (
                <span className="accent">{settings.aboutHeadingAccent}</span>
              )}
            </h2>
          )}
          {settings?.aboutBio && (
            <p className="about-bio">{settings.aboutBio}</p>
          )}
          {tags.length > 0 && (
            <div className="about-tags">
              {tags.map((t) => (
                <span key={t} className="tag about-tag">{t}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

const SERVICE_ICONS = {
  'Identity Design': (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  ),
  'Web Architecture': (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  'Digital Strategy': (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
};

function Services() {
  const { services } = useData();
  const [ref, vis] = useInView();

  return (
    <section id="services" className={`services-section ${vis ? 'in-view' : ''}`} ref={ref}>
      <div className="container">
        <div className="section-header">
          <h2>Our Expertise</h2>
          <div className="section-bar" />
        </div>
        <div className="services-grid">
          {services.map((s, i) => (
            <article
              key={s.id}
              className="service-card"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="service-icon-box">
                {SERVICE_ICONS[s.title] || <span>{s.icon}</span>}
              </div>
              <h3>{s.title}</h3>
              <p>{s.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, index, style }) {
  const thumbClass = `project-thumb thumb-${(index % 3) + 1}`;
  const inner = (
    <>
      <div className={thumbClass}>
        {project.image ? (
          <img src={mediaUrl(project.image)} alt={project.title} loading="lazy" />
        ) : (
          <div className="project-thumb-placeholder">
            <span>{project.title}</span>
          </div>
        )}
      </div>
      <div className="project-meta">
        <h3>{project.title}</h3>
        <div className="project-tags">
          {(project.tags || []).map((t) => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>
      </div>
    </>
  );

  if (project.liveUrl?.trim()) {
    return (
      <a
        href={project.liveUrl}
        className="project-card project-card-link"
        style={style}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open ${project.title} live project`}
      >
        {inner}
      </a>
    );
  }

  return (
    <article className="project-card" style={style}>
      {inner}
    </article>
  );
}

function Work() {
  const { projects } = useData();
  const [ref, vis] = useInView();
  const trackRef = useRef(null);
  const scrollPaused = useRef(false);

  useEffect(() => {
    if (!vis || projects.length === 0) return undefined;

    let frameId;
    let direction = 1;

    const step = () => {
      const track = trackRef.current;
      if (
        track &&
        window.innerWidth >= 769 &&
        track.scrollWidth > track.clientWidth + 8 &&
        !scrollPaused.current
      ) {
        track.scrollLeft += direction * 0.6;
        if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 2) direction = -1;
        if (track.scrollLeft <= 0) direction = 1;
      }
      frameId = requestAnimationFrame(step);
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [vis, projects.length]);

  return (
    <section id="work" className={`work-section ${vis ? 'in-view' : ''}`} ref={ref}>
      <div className="container">
        <div className="work-header">
          <h2 className="work-heading">Selected Work</h2>
          <p className="work-sub">
            A gallery of technical mastery and aesthetic breakthroughs.
          </p>
        </div>

        {projects.length === 0 ? (
          <p className="work-empty">No projects yet.</p>
        ) : (
          <div
            className="projects-scroll-outer"
            onMouseEnter={() => { scrollPaused.current = true; }}
            onMouseLeave={() => { scrollPaused.current = false; }}
          >
            <div className="projects-scroll-track" ref={trackRef}>
              {projects.map((p, i) => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  index={i}
                  style={{ animationDelay: `${i * 0.08}s` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function Testimonials() {
  const { testimonials } = useData();
  const [ref, vis] = useInView();

  return (
    <section id="testimonials" className={`testimonials-section ${vis ? 'in-view' : ''}`} ref={ref}>
      <div className="container">
        <div className="section-header">
          <h2>
            Echoes of <span className="accent">Success</span>
          </h2>
        </div>
        <div className="testimonials-grid">
          {testimonials.slice(0, 2).map((t, i) => (
            <article
              key={t.id}
              className="testimonial-card"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="t-stars" aria-label={`${t.rating || 5} stars`}>
                {Array.from({ length: 5 }).map((_, j) => (
                  <span key={j} className={j < (t.rating || 5) ? 'star on' : 'star'}>★</span>
                ))}
              </div>
              <p className="t-text">&ldquo;{t.text}&rdquo;</p>
              <footer className="t-author">
                <div className="t-avatar">
                  {t.avatar ? (
                    <img src={t.avatar} alt="" />
                  ) : (
                    <span>{t.name[0]}</span>
                  )}
                </div>
                <div>
                  <p className="t-name">{t.name}</p>
                  <p className="t-role">{t.role}</p>
                </div>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const { settings } = useData();
  const [ref, vis] = useInView();
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/contacts', form);
      setSent(true);
      setTimeout(() => setSent(false), 4000);
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  return (
    <section id="contact" className={`contact-section ${vis ? 'in-view' : ''}`} ref={ref}>
      <div className="container">
        <div className="contact-card">
          <h2>Start a Project</h2>
          <p className="contact-sub">
            Ready to bring your vision into the light? Let&apos;s build something extraordinary.
          </p>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="input-group">
                <label htmlFor="contact-name" className="sr-only">Full Name</label>
                <input
                  id="contact-name"
                  name="name"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
              <div className="input-group">
                <label htmlFor="contact-email" className="sr-only">Email Address</label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
            </div>
            <div className="input-group">
              <label htmlFor="contact-phone" className="sr-only">Mobile Number</label>
              <input
                id="contact-phone"
                name="phone"
                type="tel"
                placeholder="Mobile Number (optional)"
                value={form.phone}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            <div className="input-group">
              <label htmlFor="contact-message" className="sr-only">Your Message</label>
              <textarea
                id="contact-message"
                name="message"
                placeholder="Your Message"
                rows={4}
                value={form.message}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
            <button type="submit" className="btn-primary contact-btn">
              {sent ? '✓ Request Transmitted!' : 'Transmit Request'}
            </button>
          </form>
          <div className="contact-social-footer">
            {settings?.instagramUrl && (
              <a href={settings.instagramUrl} target="_blank" rel="noreferrer">Instagram</a>
            )}
            {settings?.linkedinUrl && (
              <a href={settings.linkedinUrl} target="_blank" rel="noreferrer">LinkedIn</a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="pf-footer">
      <div className="container footer-inner">
        <span className="footer-logo">rabeeh</span>
        <span className="footer-copyright">
          © {new Date().getFullYear()} rabeeh. ALL RIGHTS RESERVED.
        </span>
      </div>
    </footer>
  );
}

export default function Portfolio() {
  const { settings } = useData();
  const navigateTo = (id) => scrollTo(id);

  return (
    <>
      <Navbar settings={settings} onNavigate={navigateTo} />
      <div className="portfolio-page">
        <Hero settings={settings} onNavigate={navigateTo} />
        <About settings={settings} />
        <Services />
        <Work />
        <Testimonials />
        <Contact />
        <Footer />
      </div>
    </>
  );
}
