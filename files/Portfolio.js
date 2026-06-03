import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../context/DataContext';
import './Portfolio.css';

/* ── tiny helpers ── */
const useInView = (threshold = 0.15) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
};

/* ── NAV ── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);
  const links = ['Home','About','Services','Work','Testimonials','Contact'];
  const scroll = (id) => {
    setOpen(false);
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <nav className={`pf-nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="pf-nav-inner">
        <span className="pf-nav-logo">A<span className="dot">.</span></span>
        <ul className="pf-nav-links">
          {links.map(l => (
            <li key={l}><button onClick={() => scroll(l)}>{l}</button></li>
          ))}
        </ul>
        <a href="#contact" onClick={e => { e.preventDefault(); scroll('Contact'); }} className="btn-primary nav-cta">Book a Free Call</a>
        <button className="hamburger" onClick={() => setOpen(!open)}>
          <span /><span /><span />
        </button>
      </div>
      {open && (
        <div className="mobile-menu">
          {links.map(l => <button key={l} onClick={() => scroll(l)}>{l}</button>)}
        </div>
      )}
    </nav>
  );
}

/* ── HERO ── */
function Hero() {
  const [ref, vis] = useInView(0.1);
  return (
    <section id="home" className={`hero-section ${vis ? 'in-view' : ''}`} ref={ref}>
      <div className="hero-bg">
        <div className="hero-orb orb1" />
        <div className="hero-orb orb2" />
        <div className="hero-grid" />
      </div>
      <div className="container hero-content">
        <div className="hero-badge">
          <span className="badge-dot" />
          Trusted by 80+ Founders Worldwide
        </div>
        <h1 className="hero-title">
          Your story, positioned to<br />
          <span className="hero-title-accent">attract real opportunities.</span>
        </h1>
        <p className="hero-sub">
          We help founders own their category on LinkedIn, trusted by VCs, family
          offices, and leaders from billion-dollar companies.
        </p>
        <div className="hero-ctas">
          <button className="btn-primary" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
            Book a Free Call
          </button>
          <button className="btn-ghost" onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}>
            Know More
          </button>
        </div>
      </div>
      <div className="wave-divider">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#0f1420" />
        </svg>
      </div>
    </section>
  );
}

/* ── ABOUT ── */
function About() {
  const [ref, vis] = useInView();
  const tags = ['React','Tailwind CSS','Figma','Framer Motion','Three.js'];
  return (
    <section id="about" className={`about-section ${vis ? 'in-view' : ''}`} ref={ref}>
      <div className="container about-grid">
        <div className="about-img-wrap">
          <div className="about-img-ring" />
          <div className="about-img-placeholder">
            <span>Your Photo</span>
          </div>
          <div className="about-img-blob" />
        </div>
        <div className="about-text">
          <span className="section-label">About Me</span>
          <h2 className="about-heading">
            Pioneering the <span className="accent">New Frontier</span>
          </h2>
          <p className="about-bio">
            Founded by a collective of designers and engineers, we exist to bridge the gap
            between imagination and implementation. We believe that technology should be as
            beautiful as it is functional.
          </p>
          <p className="about-sub">CORE ECOSYSTEM</p>
          <div className="about-tags">
            {tags.map(t => <span key={t} className="tag">{t}</span>)}
          </div>
        </div>
      </div>
      <div className="wave-divider wave-dark">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M0,20 C480,70 960,0 1440,50 L1440,80 L0,80 Z" fill="#0a0d14" />
        </svg>
      </div>
    </section>
  );
}

/* ── SERVICES ── */
function Services() {
  const { services } = useData();
  const [ref, vis] = useInView();
  return (
    <section id="services" className={`services-section ${vis ? 'in-view' : ''}`} ref={ref}>
      <div className="container">
        <div className="section-header">
          <span className="section-label">What I Do</span>
          <h2>Our <span className="accent">Expertise</span></h2>
          <div className="section-bar" />
        </div>
        <div className="services-grid">
          {services.map((s, i) => (
            <div key={s.id} className="service-card card" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="service-icon">{s.icon || '✦'}</div>
              <h3 className="service-title">{s.title}</h3>
              <p className="service-desc">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="wave-divider">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M0,50 C360,10 1080,70 1440,30 L1440,80 L0,80 Z" fill="#0f1420" />
        </svg>
      </div>
    </section>
  );
}

/* ── PROJECTS ── */
function Work() {
  const { projects } = useData();
  const [ref, vis] = useInView();
  const [filter, setFilter] = useState('All');
  const cats = ['All', ...new Set(projects.map(p => p.category))];
  const shown = filter === 'All' ? projects : projects.filter(p => p.category === filter);

  return (
    <section id="work" className={`work-section ${vis ? 'in-view' : ''}`} ref={ref}>
      <div className="container">
        <div className="section-header">
          <span className="section-label">Portfolio</span>
          <h2>Selected <span className="accent">Work</span></h2>
          <p className="section-sub">Our portfolio is a gallery of technical mastery and aesthetic breakthroughs.</p>
        </div>
        <div className="filter-tabs">
          {cats.map(c => (
            <button key={c} className={`filter-btn ${filter === c ? 'active' : ''}`} onClick={() => setFilter(c)}>{c}</button>
          ))}
        </div>
        <div className="projects-grid">
          {shown.map((p, i) => (
            <div key={p.id} className="project-card card" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="project-img">
                {p.image
                  ? <img src={p.image} alt={p.title} />
                  : <div className="project-img-placeholder"><span>{p.title[0]}</span></div>
                }
                <div className="project-overlay">
                  <div className="project-overlay-links">
                    {p.liveUrl && p.liveUrl !== '#' && <a href={p.liveUrl} target="_blank" rel="noreferrer" className="btn-primary" style={{fontSize:'0.75rem',padding:'8px 16px'}}>Live ↗</a>}
                    {p.githubUrl && p.githubUrl !== '#' && <a href={p.githubUrl} target="_blank" rel="noreferrer" className="btn-ghost" style={{fontSize:'0.75rem',padding:'8px 16px'}}>GitHub</a>}
                  </div>
                </div>
              </div>
              <div className="project-info">
                <span className="project-category">{p.category}</span>
                <h3 className="project-title">{p.title}</h3>
                <p className="project-desc">{p.description}</p>
                <div className="project-tags">
                  {(p.tags || []).map(t => <span key={t} className="tag">{t}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="wave-divider wave-dark">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M0,30 C480,80 960,0 1440,60 L1440,80 L0,80 Z" fill="#0a0d14" />
        </svg>
      </div>
    </section>
  );
}

/* ── TESTIMONIALS ── */
function Testimonials() {
  const { testimonials } = useData();
  const [ref, vis] = useInView();
  return (
    <section id="testimonials" className={`testimonials-section ${vis ? 'in-view' : ''}`} ref={ref}>
      <div className="container">
        <div className="section-header">
          <span className="section-label">Social Proof</span>
          <h2>Echoes of <span className="accent">Success</span></h2>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <div key={t.id} className="testimonial-card card" style={{ animationDelay: `${i * 0.12}s` }}>
              <div className="t-stars">
                {Array.from({ length: 5 }).map((_, j) => (
                  <span key={j} className={j < (t.rating || 5) ? 'star active' : 'star'}>★</span>
                ))}
              </div>
              <p className="t-text">"{t.text}"</p>
              <div className="t-author">
                <div className="t-avatar">
                  {t.avatar ? <img src={t.avatar} alt={t.name} /> : <span>{t.name[0]}</span>}
                </div>
                <div>
                  <p className="t-name">{t.name}</p>
                  <p className="t-role">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="wave-divider">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M0,40 C360,0 1080,80 1440,20 L1440,80 L0,80 Z" fill="#0f1420" />
        </svg>
      </div>
    </section>
  );
}

/* ── CONTACT ── */
function Contact() {
  const [ref, vis] = useInView();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleSubmit = e => {
    e.preventDefault();
    // Integrate EmailJS or backend here
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <section id="contact" className={`contact-section ${vis ? 'in-view' : ''}`} ref={ref}>
      <div className="container">
        <div className="contact-card card">
          <span className="section-label">Get In Touch</span>
          <h2>Start a <span className="accent">Project</span></h2>
          <p className="contact-sub">Ready to bring your vision into the light? Let's build something unforgettable.</p>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required className="form-input" />
              <input name="email" type="email" placeholder="Email Address" value={form.email} onChange={handleChange} required className="form-input" />
            </div>
            <textarea name="message" placeholder="Your Vision" rows={5} value={form.message} onChange={handleChange} required className="form-input" />
            <button type="submit" className="btn-primary contact-btn">
              {sent ? '✓ Request Transmitted!' : 'Transmit Request →'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

/* ── FOOTER ── */
function Footer() {
  const socials = [
    { label: 'Instagram', url: '#' },
    { label: 'LinkedIn', url: '#' },
    { label: 'Twitter', url: '#' },
  ];
  return (
    <footer className="pf-footer">
      <div className="container footer-inner">
        <span className="footer-logo">AURA CREATIVE</span>
        <div className="footer-socials">
          {socials.map(s => <a key={s.label} href={s.url}>{s.label}</a>)}
        </div>
        <div className="footer-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Dribbble</a>
        </div>
      </div>
    </footer>
  );
}

/* ── MAIN PAGE ── */
export default function Portfolio() {
  return (
    <div className="portfolio-page">
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Work />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
}
