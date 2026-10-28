import { apiFetch } from './client.js';

export async function login(email, password) {
  // apiFetch returns the envelope's `data`: { token, user }
  const data = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  if (!data?.token) {
    throw new Error('Login response did not include a token');
  }

  localStorage.setItem('token', data.token);
  if (data.user) {
    localStorage.setItem('user', JSON.stringify(data.user));
  }

  return data.user;
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function fetchCurrentUser() {
  try {
    const user = await apiFetch('/auth/me');
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
    return user;
  } catch {
    return null;
  }
}

export async function register(name, email, password) {
  // Registration returns the new user only; the user logs in separately afterwards.
  return apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
}
