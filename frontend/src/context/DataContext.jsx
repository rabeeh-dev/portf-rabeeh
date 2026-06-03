import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const DataContext = createContext(null);

const normalize = (item) => ({ ...item, id: item._id || item.id });
const normalizeList = (list) => list.map(normalize);

const DEFAULT_SETTINGS = {
  bookCallUrl: '#contact',
  bookCallLabel: 'Book a Free Call',
  heroHeading: 'Your story, positioned to attract real opportunities.',
  heroSub:
    'We help founders craft their category, tell impactful stories, and build digital experiences that drive growth.',
  aboutHeading: 'Pioneering the',
  aboutHeadingAccent: 'New Frontier',
  aboutBio:
    'Founded by a collective of designers and engineers, rabeeh exists to bridge the gap between imagination and implementation. We believe technology should be as beautiful as it is functional.',
  aboutTags: ['UI/UX DESIGN', 'BRANDING', 'WEBFLOW', 'NEXT.JS', 'TAILWIND CSS', 'FIGMA'],
  aboutImage: '',
};

export function DataProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(() => {
    setLoading(true);
    const testimonialPath = isAuthenticated ? '/testimonials/all' : '/testimonials';

    Promise.all([
      api.get('/services').catch(() => ({ data: [] })),
      api.get('/projects').catch(() => ({ data: [] })),
      api.get(testimonialPath).catch(() => ({ data: [] })),
      api.get('/settings').catch(() => ({ data: DEFAULT_SETTINGS })),
    ])
      .then(([sRes, pRes, tRes, setRes]) => {
        setServices(normalizeList(sRes.data));
        setProjects(normalizeList(pRes.data));
        setTestimonials(normalizeList(tRes.data));
        setSettings({ ...DEFAULT_SETTINGS, ...setRes.data, id: setRes.data._id || setRes.data.id });
      })
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const updateSettings = async (data) => {
    const res = await api.put('/settings', data);
    setSettings({ ...DEFAULT_SETTINGS, ...res.data, id: res.data._id || res.data.id });
    return res.data;
  };

  const addService = async (data) => {
    const res = await api.post('/services', data);
    setServices((prev) => [...prev, normalize(res.data)]);
  };

  const updateService = async (id, data) => {
    const res = await api.put(`/services/${id}`, data);
    setServices((prev) => prev.map((s) => (s.id === id ? normalize(res.data) : s)));
  };

  const deleteService = async (id) => {
    await api.delete(`/services/${id}`);
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  const addProject = async (data) => {
    const res = await api.post('/projects', data);
    setProjects((prev) => [...prev, normalize(res.data)]);
  };

  const updateProject = async (id, data) => {
    const res = await api.put(`/projects/${id}`, data);
    setProjects((prev) => prev.map((p) => (p.id === id ? normalize(res.data) : p)));
  };

  const deleteProject = async (id) => {
    await api.delete(`/projects/${id}`);
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const addTestimonial = async (data) => {
    const res = await api.post('/testimonials', data);
    setTestimonials((prev) => [...prev, normalize(res.data)]);
  };

  const updateTestimonial = async (id, data) => {
    const res = await api.put(`/testimonials/${id}`, data);
    setTestimonials((prev) => prev.map((t) => (t.id === id ? normalize(res.data) : t)));
  };

  const deleteTestimonial = async (id) => {
    await api.delete(`/testimonials/${id}`);
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <DataContext.Provider
      value={{
        services,
        projects,
        testimonials,
        settings,
        loading,
        updateSettings,
        addService,
        updateService,
        deleteService,
        addProject,
        updateProject,
        deleteProject,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
