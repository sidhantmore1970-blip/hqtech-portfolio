// Lightweight API client — points to the Express backend
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

function getToken() {
  return localStorage.getItem('hqadmin_token');
}

async function request(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Network error' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Public
  getServices: () => request('/services'),
  getContent: () => request('/content'),
  submitContact: (data) => request('/contact', { method: 'POST', body: JSON.stringify(data) }),

  // Admin auth
  login: (password) => request('/admin/login', { method: 'POST', body: JSON.stringify({ password }) }),
  verify: () => request('/admin/verify', { method: 'POST' }),

  // Admin services
  getAdminServices: () => request('/admin/services'),
  createService: (data) => request('/admin/services', { method: 'POST', body: JSON.stringify(data) }),
  updateService: (id, data) => request(`/admin/services/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteService: (id) => request(`/admin/services/${id}`, { method: 'DELETE' }),

  // Admin plans
  createPlan: (data) => request('/admin/plans', { method: 'POST', body: JSON.stringify(data) }),
  updatePlan: (id, data) => request(`/admin/plans/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletePlan: (id) => request(`/admin/plans/${id}`, { method: 'DELETE' }),

  // Admin content
  updateContent: (data) => request('/admin/content', { method: 'PUT', body: JSON.stringify(data) }),

  // Admin messages
  getMessages: () => request('/admin/messages'),
  markMessageRead: (id) => request(`/admin/messages/${id}/read`, { method: 'PUT' }),
  deleteMessage: (id) => request(`/admin/messages/${id}`, { method: 'DELETE' }),
};
