const API_ORIGIN = (import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:3000').replace(/\/+$/, '');
export const API_BASE_URL = `${API_ORIGIN}/api`;

export const getToken = () => localStorage.getItem('token');
export const setToken = (token: string) => localStorage.setItem('token', token);
export const clearToken = () => localStorage.removeItem('token');

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = getToken();
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let message = `API Error (${response.status})`;
    try {
      const data = await response.json();

      const formatIssue = (issue: any) => {
        const field = issue.path?.length ? String(issue.path[0]) : '';
        const capField = field ? field.charAt(0).toUpperCase() + field.slice(1) : '';
        const msg = issue.message || 'Invalid format';
        return capField ? `${capField}: ${msg}` : msg;
      };

      let errObj = data.error;

      // Hono Zod validator puts stringified JSON array in `error.message` sometimes
      if (errObj && typeof errObj === 'object' && errObj.message && typeof errObj.message === 'string' && errObj.message.startsWith('[')) {
        try { errObj = JSON.parse(errObj.message); } catch { /* ignore */ }
      } else if (typeof errObj === 'string' && errObj.startsWith('[')) {
        try { errObj = JSON.parse(errObj); } catch { /* ignore */ }
      }

      if (Array.isArray(errObj) && errObj.length > 0) {
        message = formatIssue(errObj[0]);
      } else if (Array.isArray(data) && data.length > 0) {
        message = formatIssue(data[0]);
      } else if (typeof errObj === 'object' && errObj !== null) {
        if (Array.isArray(errObj.issues) && errObj.issues.length > 0) {
          message = formatIssue(errObj.issues[0]);
        } else if (errObj.message) {
          message = errObj.message;
        } else {
          message = JSON.stringify(errObj);
        }
      } else {
        message = data.error || data.message || message;
      }
    } catch {
      // Ignore JSON parse error and fallback to text if possible
    }
    throw new ApiError(response.status, message);
  }

  return response.json();
}

export const authApi = {
  register: (data: any) => apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data: any) => apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
};

export interface DisasterNewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  date: string;
  imageUrl: string;
  country: string;
  disasterType: string;
  isGlobal: boolean;
  videoUrl: string | null;
  sourceUrl: string | null;
}

export interface CountryStatusItem {
  id: string;
  country: string;
  activeDisasters: number;
  affectedPopulation: number;
  alertLevel: string;
  recentEvents: string[];
  prediction: string;
}

export interface SurvivalTipItem {
  id: string;
  title: string;
  icon: string;
  description: string;
  disasterType: string;
  steps: string[];
}

export const dashboardApi = {
  getLocalNews: (country: string) =>
    apiFetch(`/news?country=${encodeURIComponent(country)}`) as Promise<DisasterNewsItem[]>,
  getGlobalNews: () =>
    apiFetch('/news?global=true') as Promise<DisasterNewsItem[]>,
  getCountryStatuses: () =>
    apiFetch('/countries') as Promise<CountryStatusItem[]>,
  getSurvivalTips: () =>
    apiFetch('/guides/survival') as Promise<SurvivalTipItem[]>,
};
