import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import AdminPillNav from '../components/AdminPillNav';
import ImageCropUpload from '../components/ImageCropUpload';
import './AdminDashboard.css';

/* ── reusable modal ── */
function Modal({ title, onClose, children }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

/* ── star picker ── */
function StarPicker({ value, onChange }) {
  return (
    <div className="star-picker">
      {[1,2,3,4,5].map(s => (
        <button key={s} type="button" className={`sp-star ${s <= value ? 'active' : ''}`} onClick={() => onChange(s)}>★</button>
      ))}
    </div>
  );
}

/* ── DASHBOARD OVERVIEW ── */
function DashboardHome({ services, projects, testimonials }) {
  const stats = [
    { label: 'TOTAL PROJECTS', value: projects.length, icon: '⬚', sub: '+12% this month', subColor: '#4ade80' },
    { label: 'ACTIVE SERVICES', value: String(services.length).padStart(2,'0'), icon: '⌨', sub: `Capacity: ${Math.round(services.length/10*100)}%`, subColor: 'var(--text-secondary)' },
    { label: 'TESTIMONIALS', value: testimonials.length >= 1000 ? (testimonials.length/1000).toFixed(1)+'k' : testimonials.length, icon: '✦', sub: '★ 4.9 Average Rating', subColor: 'var(--accent)' },
  ];
  return (
    <div className="dash-home">
      <div className="dash-stats">
        {stats.map(s => (
          <div key={s.label} className="stat-card card">
            <div className="stat-top">
              <span className="stat-icon">{s.icon}</span>
              <span className="stat-label">{s.label}</span>
            </div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-sub" style={{ color: s.subColor }}>{s.sub}</div>
          </div>
        ))}
      </div>
      <div className="card recent-activity">
        <div className="ra-header">
          <h3>Recent Project Activity</h3>
          <span className="ra-view">View All</span>
        </div>
        <table className="ra-table">
          <thead>
            <tr>
              <th>PROJECT NAME</th>
              <th>STATUS</th>
              <th>TAGS</th>
            </tr>
          </thead>
          <tbody>
            {projects.slice(0, 5).map(p => (
              <tr key={p.id}>
                <td>{p.title}</td>
                <td><span className="status-badge active">ACTIVE</span></td>
                <td>{(p.tags||[]).slice(0,2).map(t => <span key={t} className="tag" style={{fontSize:'0.7rem'}}>{t}</span>)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── SERVICES MANAGER ── */
function ServicesManager() {
  const { services, addService, updateService, deleteService } = useData();
  const [modal, setModal] = useState(null); // null | 'add' | {id,...}
  const [form, setForm] = useState({ icon: '✦', title: '', description: '' });

  const openAdd = () => { setForm({ icon: '✦', title: '', description: '' }); setModal('add'); };
  const openEdit = s => { setForm({ icon: s.icon, title: s.title, description: s.description }); setModal(s); };
  const handleSave = () => {
    if (!form.title.trim()) return;
    if (modal === 'add') addService(form);
    else updateService(modal.id, form);
    setModal(null);
  };

  return (
    <div className="manager">
      <div className="manager-header manager-header--actions">
        <button className="btn-primary" onClick={openAdd}>+ Add Service</button>
      </div>
      <div className="manager-grid">
        {services.map(s => (
          <div key={s.id} className="manager-card card">
            <div className="mc-icon">{s.icon}</div>
            <div className="mc-body">
              <h4>{s.title}</h4>
              <p>{s.description}</p>
            </div>
            <div className="mc-actions">
              <button className="mc-btn edit" onClick={() => openEdit(s)}>Edit</button>
              <button className="mc-btn del" onClick={() => deleteService(s.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      {modal && (
        <Modal title={modal === 'add' ? 'Add Service' : 'Edit Service'} onClose={() => setModal(null)}>
          <div className="modal-form">
            <label>Icon / Emoji</label>
            <input value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} placeholder="✦" className="form-input" />
            <label>Title</label>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Service Title" className="form-input" />
            <label>Description</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} placeholder="Short description..." className="form-input" />
            <button className="btn-primary" onClick={handleSave}>Save Service</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ── SITE CONTENT (CTA, About) ── */
function ContentManager() {
  const { settings, updateSettings } = useData();
  const [form, setForm] = useState({
    bookCallUrl: '',
    bookCallLabel: '',
    heroHeading: '',
    heroSub: '',
    aboutHeading: '',
    aboutHeadingAccent: '',
    aboutBio: '',
    aboutTags: '',
    aboutImage: '',
    instagramUrl: '',
    linkedinUrl: '',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [imageSaveError, setImageSaveError] = useState('');

  const handleAboutImageChange = async (aboutImage) => {
    setForm((f) => ({ ...f, aboutImage }));
    setImageSaveError('');
    try {
      await updateSettings({ aboutImage });
    } catch (err) {
      setImageSaveError(err.response?.data?.message || 'Failed to save portrait');
    }
  };

  useEffect(() => {
    if (!settings) return;
    setForm({
      bookCallUrl: settings.bookCallUrl || '',
      bookCallLabel: settings.bookCallLabel || '',
      heroHeading: settings.heroHeading || '',
      heroSub: settings.heroSub || '',
      aboutHeading: settings.aboutHeading || '',
      aboutHeadingAccent: settings.aboutHeadingAccent || '',
      aboutBio: settings.aboutBio || '',
      aboutTags: (settings.aboutTags || []).join(', '),
      aboutImage: settings.aboutImage || '',
      instagramUrl: settings.instagramUrl || '',
      linkedinUrl: settings.linkedinUrl || '',
    });
  }, [settings]);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await updateSettings({
        bookCallUrl: form.bookCallUrl,
        bookCallLabel: form.bookCallLabel,
        heroHeading: form.heroHeading,
        heroSub: form.heroSub,
        aboutHeading: form.aboutHeading,
        aboutHeadingAccent: form.aboutHeadingAccent,
        aboutBio: form.aboutBio,
        aboutTags: form.aboutTags.split(',').map((t) => t.trim()).filter(Boolean),
        aboutImage: form.aboutImage,
        instagramUrl: form.instagramUrl,
        linkedinUrl: form.linkedinUrl,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const field = (key, label, type = 'input', placeholder = '') => (
    <div key={key}>
      <label>{label}</label>
      {type === 'textarea' ? (
        <textarea
          value={form[key]}
          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
          rows={4}
          placeholder={placeholder}
          className="form-input"
        />
      ) : (
        <input
          value={form[key]}
          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
          placeholder={placeholder}
          className="form-input"
        />
      )}
    </div>
  );

  return (
    <div className="manager">
      <div className="manager-header manager-header--actions">
        <button type="button" className="btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save changes'}
        </button>
      </div>

      <div className="content-sections">
        <div className="card content-block">
          <h3>Hero section</h3>
          <p className="content-hint">
            Main headline and intro text on the home page. Buttons are configured below.
          </p>
          {field(
            'heroHeading',
            'Heading',
            'input',
            'Your story, positioned to attract real opportunities.'
          )}
          {field(
            'heroSub',
            'Paragraph',
            'textarea',
            'We help founders craft their category, tell impactful stories…'
          )}
        </div>

        <div className="card content-block">
          <h3>Book a Free Call button</h3>
          <p className="content-hint">
            Use a full URL (e.g. Calendly) to open in a new tab, or <code>#contact</code> to scroll to the contact form.
          </p>
          {field('bookCallLabel', 'Button label', 'input', 'Book a Free Call')}
          {field('bookCallUrl', 'Redirect link', 'input', 'https://calendly.com/your-link or #contact')}
        </div>

        <div className="card content-block">
          <h3>About section</h3>
          <ImageCropUpload
            label="Portrait image"
            value={form.aboutImage}
            onChange={handleAboutImageChange}
            aspect={1}
            hint="Square crop for the circular About portrait"
          />
          {imageSaveError && <p className="icu-error">{imageSaveError}</p>}
          <p className="content-hint">
            Portrait saves automatically after upload. Leave empty to use the default placeholder.
          </p>
          {field('aboutHeading', 'Heading (before accent)', 'input', 'Pioneering the')}
          {field('aboutHeadingAccent', 'Heading accent (highlighted)', 'input', 'New Frontier')}
          {field('aboutBio', 'Paragraph', 'textarea', 'Your story…')}
          {field('aboutTags', 'Tags (comma separated)', 'input', 'UI/UX DESIGN, BRANDING, FIGMA')}
        </div>

        <div className="card content-block">
          <h3>Social Profiles</h3>
          <p className="content-hint">
            URLs for the social profile links shown in the contact section of your portfolio.
          </p>
          {field('instagramUrl', 'Instagram Link', 'input', 'https://instagram.com/username')}
          {field('linkedinUrl', 'LinkedIn Link', 'input', 'https://linkedin.com/in/username')}
        </div>
      </div>
    </div>
  );
}

/* ── PROJECTS MANAGER ── */
function ProjectsManager() {
  const { projects, addProject, updateProject, deleteProject } = useData();
  const [modal, setModal] = useState(null);
  const blank = { title: '', description: '', tags: '', image: '', liveUrl: '' };
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);

  const openAdd = () => { setForm(blank); setModal('add'); };
  const openEdit = p => { setForm({ ...p, tags: (p.tags||[]).join(', ') }); setModal(p); };
  const handleSave = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        image: form.image,
        liveUrl: form.liveUrl,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      };
      if (modal === 'add') await addProject(payload);
      else await updateProject(modal.id, payload);
      setModal(null);
    } finally {
      setSaving(false);
    }
  };

  const field = (key, label, type = 'input', placeholder = '') => (
    <div key={key}>
      <label>{label}</label>
      {type === 'textarea'
        ? <textarea value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} rows={3} placeholder={placeholder} className="form-input" />
        : <input value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={placeholder} className="form-input" />
      }
    </div>
  );

  return (
    <div className="manager">
      <div className="manager-header manager-header--actions">
        <button className="btn-primary" onClick={openAdd}>+ Add Project</button>
      </div>
      <div className="data-table card">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Tags</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map(p => (
              <tr key={p.id}>
                <td><strong>{p.title}</strong><br /><span style={{color:'var(--text-secondary)',fontSize:'0.8rem'}}>{p.description?.slice(0,60)}...</span></td>
                <td>{(p.tags||[]).map(t => <span key={t} className="tag" style={{fontSize:'0.7rem',marginRight:4}}>{t}</span>)}</td>
                <td>
                  <div className="table-actions">
                    <button className="mc-btn edit" onClick={() => openEdit(p)}>Edit</button>
                    <button className="mc-btn del" onClick={() => deleteProject(p.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modal && (
        <Modal title={modal === 'add' ? 'Add Project' : 'Edit Project'} onClose={() => setModal(null)}>
          <div className="modal-form">
            {field('title', 'Title', 'input', 'Project Name')}
            {field('description', 'Description', 'textarea', 'Project description...')}
            {field('tags', 'Tags (comma separated)', 'input', 'React, Node.js, Figma')}
            <ImageCropUpload
              label="Project image"
              value={form.image}
              onChange={(image) => setForm((f) => ({ ...f, image }))}
              hint="JPEG, PNG, or WebP — crop to 4:5"
            />
            {field('liveUrl', 'Live project URL', 'input', 'https://your-project.com')}
            <p className="content-hint">Visitors click the project card to open this link.</p>
            <button type="button" className="btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : 'Save Project'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ── TESTIMONIALS MANAGER ── */
function TestimonialsManager() {
  const { testimonials, addTestimonial, updateTestimonial, deleteTestimonial } = useData();
  const [modal, setModal] = useState(null);
  const blank = { name: '', role: '', avatar: '', text: '', rating: 5, approved: true };
  const [form, setForm] = useState(blank);

  const openAdd = () => {
    setForm(blank);
    setModal('add');
  };
  const openEdit = t => { setForm({ ...t }); setModal(t); };
  const handleSave = () => {
    if (!form.name.trim()) return;
    if (modal === 'add') addTestimonial(form);
    else updateTestimonial(modal.id, form);
    setModal(null);
  };

  return (
    <div className="manager">
      <div className="manager-header manager-header--actions">
        <button className="btn-primary" onClick={openAdd}>+ Add Testimonial</button>
      </div>
      <div className="manager-grid">
        {testimonials.length === 0 && (
          <div className="empty-state card">
            <p>No testimonials yet. Click <strong>+ Add Testimonial</strong> above to create one.</p>
          </div>
        )}
        {testimonials.map(t => (
          <div key={t.id} className="testimonial-mgr-card card">
            <div className="tmc-stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={i < t.rating ? 'star active' : 'star'}>★</span>
              ))}
            </div>
            <p className="tmc-text">"{t.text}"</p>
            <div className="tmc-author">
              <div className="t-avatar">{t.avatar ? <img src={t.avatar} alt={t.name} /> : t.name[0]}</div>
              <div>
                <strong>{t.name}</strong>
                <p style={{color:'var(--text-muted)',fontSize:'0.8rem'}}>{t.role}</p>
              </div>
            </div>
            <div className="mc-actions">
              <button className="mc-btn edit" onClick={() => openEdit(t)}>Edit</button>
              <button className="mc-btn del" onClick={() => deleteTestimonial(t.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      {modal && (
        <Modal title={modal === 'add' ? 'Add Testimonial' : 'Edit Testimonial'} onClose={() => setModal(null)}>
          <div className="modal-form">
            <label>Name</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="John Doe" className="form-input" />
            <label>Role / Company</label>
            <input value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} placeholder="CEO, Acme Corp" className="form-input" />
            <ImageCropUpload
              label="Photo"
              value={form.avatar}
              onChange={(avatar) => setForm((f) => ({ ...f, avatar }))}
              aspect={1}
              hint="Square crop for the circular testimonial photo"
            />
            <label>Review</label>
            <textarea value={form.text} onChange={e => setForm(f => ({ ...f, text: e.target.value }))} rows={4} placeholder="What did they say?" className="form-input" />
            <label>Rating</label>
            <StarPicker value={form.rating} onChange={r => setForm(f => ({ ...f, rating: r }))} />
            <button className="btn-primary" onClick={handleSave}>Save Testimonial</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

const PAGE_META = {
  dashboard: {
    title: 'Agency Overview',
    sub: "Welcome back, Director. Here's your creative ecosystem.",
  },
  content: { title: 'Site Content', sub: 'Hero, Book a Free Call button, About portrait, headings, and tags.' },
  projects: { title: 'Projects Manager', sub: 'Add projects with image crop and live links.' },
  services: { title: 'Services Manager', sub: 'Manage services shown on your portfolio.' },
  testimonials: { title: 'Testimonials', sub: 'Manage client testimonials shown on your portfolio.' },
};

/* ── MAIN ADMIN DASHBOARD ── */
export default function AdminDashboard() {
  const { logout } = useAuth();
  const { services, projects, testimonials } = useData();
  const navigate = useNavigate();
  const [active, setActive] = useState('dashboard');

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  const renderContent = () => {
    switch (active) {
      case 'dashboard':
        return <DashboardHome services={services} projects={projects} testimonials={testimonials} />;
      case 'content':
        return <ContentManager />;
      case 'services':
        return <ServicesManager />;
      case 'projects':
        return <ProjectsManager />;
      case 'testimonials':
        return <TestimonialsManager />;
      default:
        return null;
    }
  };

  const meta = PAGE_META[active] || PAGE_META.dashboard;

  return (
    <div className="admin-layout">
      <AdminPillNav
        active={active}
        onTabChange={setActive}
        onLogout={handleLogout}
      />

      <main className="admin-main">
        <div className="admin-page-head">
          <div>
            <h1 className="page-title">{meta.title}</h1>
            <p className="page-sub">{meta.sub}</p>
          </div>
          <div className="sys-badge">
            <span className="sys-dot" />
            SYSTEM ONLINE
          </div>
        </div>

        <div className="admin-content">
          {renderContent()}
        </div>

        <div className="admin-footer">
          © {new Date().getFullYear()} rabeeh. ADMIN PORTAL.
        </div>
      </main>
    </div>
  );
}
