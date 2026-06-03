import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
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
    { label: 'TESTIMONIALS', value: testimonials.length >= 1000 ? (testimonials.length/1000).toFixed(1)+'k' : testimonials.length, icon: '✦', sub: '★ 4.9 Average Rating', subColor: 'var(--accent-cyan)' },
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
              <th>CATEGORY</th>
              <th>STATUS</th>
              <th>TAGS</th>
            </tr>
          </thead>
          <tbody>
            {projects.slice(0, 5).map(p => (
              <tr key={p.id}>
                <td>{p.title}</td>
                <td>{p.category}</td>
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
      <div className="manager-header">
        <div>
          <h2>Services Manager</h2>
          <p>Manage what services appear on your portfolio.</p>
        </div>
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

/* ── PROJECTS MANAGER ── */
function ProjectsManager() {
  const { projects, addProject, updateProject, deleteProject } = useData();
  const [modal, setModal] = useState(null);
  const blank = { title: '', category: 'Web', description: '', tags: '', image: '', liveUrl: '', githubUrl: '' };
  const [form, setForm] = useState(blank);

  const openAdd = () => { setForm(blank); setModal('add'); };
  const openEdit = p => { setForm({ ...p, tags: (p.tags||[]).join(', ') }); setModal(p); };
  const handleSave = () => {
    if (!form.title.trim()) return;
    const payload = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) };
    if (modal === 'add') addProject(payload);
    else updateProject(modal.id, payload);
    setModal(null);
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
      <div className="manager-header">
        <div>
          <h2>Projects Manager</h2>
          <p>Add and manage portfolio projects.</p>
        </div>
        <button className="btn-primary" onClick={openAdd}>+ Add Project</button>
      </div>
      <table className="data-table card">
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Tags</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map(p => (
            <tr key={p.id}>
              <td><strong>{p.title}</strong><br /><span style={{color:'var(--text-secondary)',fontSize:'0.8rem'}}>{p.description?.slice(0,60)}...</span></td>
              <td><span className="tag">{p.category}</span></td>
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
      {modal && (
        <Modal title={modal === 'add' ? 'Add Project' : 'Edit Project'} onClose={() => setModal(null)}>
          <div className="modal-form">
            {field('title', 'Title', 'input', 'Project Name')}
            <div>
              <label>Category</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="form-input">
                <option>Web</option>
                <option>Design</option>
                <option>Mobile</option>
                <option>Branding</option>
                <option>Other</option>
              </select>
            </div>
            {field('description', 'Description', 'textarea', 'Project description...')}
            {field('tags', 'Tags (comma separated)', 'input', 'React, Node.js, Figma')}
            {field('image', 'Image URL', 'input', 'https://...')}
            {field('liveUrl', 'Live URL', 'input', 'https://...')}
            {field('githubUrl', 'GitHub URL', 'input', 'https://github.com/...')}
            <button className="btn-primary" onClick={handleSave}>Save Project</button>
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
  const blank = { name: '', role: '', avatar: '', text: '', rating: 5 };
  const [form, setForm] = useState(blank);

  const openAdd = () => { setForm(blank); setModal('add'); };
  const openEdit = t => { setForm({ ...t }); setModal(t); };
  const handleSave = () => {
    if (!form.name.trim()) return;
    if (modal === 'add') addTestimonial(form);
    else updateTestimonial(modal.id, form);
    setModal(null);
  };

  return (
    <div className="manager">
      <div className="manager-header">
        <div>
          <h2>Testimonials Manager</h2>
          <p>Manage client testimonials shown on your portfolio.</p>
        </div>
        <button className="btn-primary" onClick={openAdd}>+ Add Testimonial</button>
      </div>
      <div className="manager-grid">
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
            <label>Avatar URL</label>
            <input value={form.avatar} onChange={e => setForm(f => ({ ...f, avatar: e.target.value }))} placeholder="https://..." className="form-input" />
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

/* ── SIDEBAR ── */
const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '⊞' },
  { id: 'projects', label: 'Projects Manager', icon: '⬚' },
  { id: 'services', label: 'Services Manager', icon: '⌨' },
  { id: 'testimonials', label: 'Testimonials', icon: '✦' },
];

/* ── MAIN ADMIN DASHBOARD ── */
export default function AdminDashboard() {
  const { logout } = useAuth();
  const { services, projects, testimonials } = useData();
  const navigate = useNavigate();
  const [active, setActive] = useState('dashboard');
  const [sideOpen, setSideOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  const renderContent = () => {
    switch (active) {
      case 'dashboard': return <DashboardHome services={services} projects={projects} testimonials={testimonials} />;
      case 'services': return <ServicesManager />;
      case 'projects': return <ProjectsManager />;
      case 'testimonials': return <TestimonialsManager />;
      default: return null;
    }
  };

  return (
    <div className="admin-layout">
      {/* mobile overlay */}
      {sideOpen && <div className="side-overlay" onClick={() => setSideOpen(false)} />}

      {/* SIDEBAR */}
      <aside className={`admin-sidebar ${sideOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <span className="sidebar-logo">AURA CREATIVE</span>
          <span className="sidebar-role">ADMIN PANEL</span>
        </div>
        <nav className="sidebar-nav">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              className={`sidebar-item ${active === item.id ? 'active' : ''}`}
              onClick={() => { setActive(item.id); setSideOpen(false); }}
            >
              <span className="sidebar-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="user-avatar">D</div>
            <div>
              <p className="user-name">Management Suite</p>
              <p className="user-sub">Director Mode</p>
            </div>
          </div>
          <button className="sidebar-item settings-btn" onClick={() => {}}>
            <span className="sidebar-icon">⚙</span> Settings
          </button>
          <button className="sidebar-item logout-btn" onClick={handleLogout}>
            <span className="sidebar-icon">↩</span> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="admin-main">
        {/* top bar */}
        <div className="admin-topbar">
          <button className="hamburger-admin" onClick={() => setSideOpen(true)}>
            <span /><span /><span />
          </button>
          <div className="topbar-left">
            <h1 className="page-title">
              {active === 'dashboard' && 'Agency Overview'}
              {active === 'services' && 'Services Manager'}
              {active === 'projects' && 'Projects Manager'}
              {active === 'testimonials' && 'Testimonials'}
            </h1>
            <p className="page-sub">
              {active === 'dashboard' && "Welcome back, Director. Here's your creative ecosystem."}
              {active !== 'dashboard' && 'Manage your portfolio content dynamically.'}
            </p>
          </div>
          <div className="topbar-right">
            <div className="sys-badge">
              <span className="sys-dot" />
              SYSTEM ONLINE
            </div>
            {active === 'projects' && (
              <button className="btn-primary" onClick={() => document.querySelector('.manager-header .btn-primary')?.click()}>
                New Project
              </button>
            )}
          </div>
        </div>

        {/* page content */}
        <div className="admin-content">
          {renderContent()}
        </div>

        <div className="admin-footer">
          © 2024 AURA CREATIVE. SYSTEM STATUS: ENCRYPTED PORTAL.
        </div>
      </main>
    </div>
  );
}
