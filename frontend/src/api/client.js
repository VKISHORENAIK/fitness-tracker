const API_BASE = import.meta.env.VITE_API_URL || '';

function getHeaders() {
  const userId = import.meta.env.VITE_USER_ID || localStorage.getItem('fittrack_user_id') || '';
  return {
    'Content-Type': 'application/json',
    ...(userId ? { 'X-User-Id': userId } : {}),
  };
}

export async function api(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: { ...getHeaders(), ...options.headers },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || res.statusText);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const apiGet = (path) => api(path);
export const apiPost = (path, body) => api(path, { method: 'POST', body: JSON.stringify(body) });
export const apiPut = (path, body) => api(path, { method: 'PUT', body: JSON.stringify(body) });
export const apiDelete = (path) => api(path, { method: 'DELETE' });
