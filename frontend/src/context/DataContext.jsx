import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';
import { useSocket } from './SocketContext';

const DataContext = createContext(null);

const normalize = (item) => ({ ...item, id: item._id || item.id });
const normalizeList = (list) => list.map(normalize);

const DEFAULT_SETTINGS = {
  bookCallUrl: '',
  bookCallLabel: '',
  heroHeading: '',
  heroSub: '',
  aboutHeading: '',
  aboutHeadingAccent: '',
  aboutBio: '',
  aboutTags: [],
  aboutImage: '',
  instagramUrl: '',
  linkedinUrl: '',
};

export function DataProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const { socket } = useSocket();

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

  // Real-time socket listeners
  useEffect(() => {
    if (!socket) return;

    const onServiceCreated = ({ service }) =>
      setServices((prev) => [...prev, normalize(service)]);
    const onServiceUpdated = ({ service }) =>
      setServices((prev) =>
        prev.map((s) => (s.id === (service._id || service.id) ? normalize(service) : s))
      );
    const onServiceDeleted = ({ id }) =>
      setServices((prev) => prev.filter((s) => s.id !== id));

    const onProjectCreated = ({ project }) =>
      setProjects((prev) => [...prev, normalize(project)]);
    const onProjectUpdated = ({ project }) =>
      setProjects((prev) =>
        prev.map((p) => (p.id === (project._id || project.id) ? normalize(project) : p))
      );
    const onProjectDeleted = ({ id }) =>
      setProjects((prev) => prev.filter((p) => p.id !== id));

    const onTestimonialCreated = ({ testimonial }) =>
      setTestimonials((prev) => [...prev, normalize(testimonial)]);
    const onTestimonialUpdated = ({ testimonial }) =>
      setTestimonials((prev) =>
        prev.map((t) =>
          t.id === (testimonial._id || testimonial.id) ? normalize(testimonial) : t
        )
      );
    const onTestimonialDeleted = ({ id }) =>
      setTestimonials((prev) => prev.filter((t) => t.id !== id));

    const onSettingsUpdated = ({ settings: s }) =>
      setSettings({ ...DEFAULT_SETTINGS, ...s, id: s._id || s.id });

    socket.on('service:created', onServiceCreated);
    socket.on('service:updated', onServiceUpdated);
    socket.on('service:deleted', onServiceDeleted);
    socket.on('project:created', onProjectCreated);
    socket.on('project:updated', onProjectUpdated);
    socket.on('project:deleted', onProjectDeleted);
    socket.on('testimonial:created', onTestimonialCreated);
    socket.on('testimonial:updated', onTestimonialUpdated);
    socket.on('testimonial:deleted', onTestimonialDeleted);
    socket.on('settings:updated', onSettingsUpdated);

    return () => {
      socket.off('service:created', onServiceCreated);
      socket.off('service:updated', onServiceUpdated);
      socket.off('service:deleted', onServiceDeleted);
      socket.off('project:created', onProjectCreated);
      socket.off('project:updated', onProjectUpdated);
      socket.off('project:deleted', onProjectDeleted);
      socket.off('testimonial:created', onTestimonialCreated);
      socket.off('testimonial:updated', onTestimonialUpdated);
      socket.off('testimonial:deleted', onTestimonialDeleted);
      socket.off('settings:updated', onSettingsUpdated);
    };
  }, [socket]);

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
