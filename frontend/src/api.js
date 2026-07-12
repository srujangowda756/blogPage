const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const AUTH_TOKEN_KEY = 'blog_token';

export function getApiBaseUrl() {
  return API_URL;
}

export function getWsUrl() {
  const normalized = API_URL.replace(/^http/, 'ws');
  return `${normalized}/ws`;
}

function parseJwt(token) {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = atob(normalized);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

function isTokenExpired(token) {
  if (!token) return true;
  const payload = parseJwt(token);
  if (!payload || !payload.exp) return false;
  return Date.now() >= payload.exp * 1000;
}

export function getToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

function getAuthHeaders() {
  const headers = {};
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

export function saveAuth(token) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  window.dispatchEvent(new Event('auth:changed'));
}

export function clearAuth() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  window.dispatchEvent(new Event('auth:changed'));
}

export function isAuthenticated() {
  const token = getToken();
  if (!token) return false;

  if (isTokenExpired(token)) {
    clearAuth();
    return false;
  }

  return true;
}

export async function request(path, options = {}) {
  const isFormData = options.body instanceof FormData;
  const token = getToken();

  if (token && isTokenExpired(token)) {
    clearAuth();
    throw new Error('Session expired. Please log in again.');
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(!isFormData && { 'Content-Type': 'application/json' }),
      ...getAuthHeaders(),
      ...(options.headers || {}),
    },
  });

  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const data = isJson ? await res.json().catch(() => ({})) : await res.text().catch(() => '');

  if (!res.ok) {
    const message = typeof data === 'string' ? data : data.detail || data.message || 'Request failed';
    throw new Error(message);
  }

  if (res.status === 204) {
    return null;
  }

  return data;
}

export async function loginUser(email, password) {
  const data = await request('/user/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  saveAuth(data.access_token);
  return data;
}

export async function registerUser(email, password) {
  return request('/user/register', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function fetchBlogs(skip = 0, limit = 6) {
  const params = new URLSearchParams({ skip: skip.toString(), limit: limit.toString() });
  return request(`/blogs/?${params.toString()}`);
}

export async function fetchBlogById(id) {
  return request(`/blogs/${id}`);
}

export async function createBlog(payload) {
  return request('/blogs/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateBlog(id, payload) {
  return request(`/blogs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function deleteBlog(id) {
  return request(`/blogs/${id}`, {
    method: 'DELETE',
  });
}