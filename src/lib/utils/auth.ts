// Small utility for handling auth tokens in localStorage
const TOKEN_KEY = 'authToken';

export const getAuthToken = (): string | null => {
  try {
    if (typeof window === 'undefined') return null;
    return window.localStorage.getItem(TOKEN_KEY);
  } catch (e) {
    return null;
  }
};

export const setAuthToken = (token: string) => {
  try {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(TOKEN_KEY, token);
    // debug
    try {
      console.log('%c[auth] token saved to localStorage', 'color: #10b981', token?.slice?.(0,8)+'...');
    } catch (e) {
      console.warn('[auth] token saved log failed', e);
    }
  } catch (e) {
    // ignore
  }
};

export const clearAuthToken = () => {
  try {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(TOKEN_KEY);
  } catch (e) {
    // ignore
  }
};

export default {
  getAuthToken,
  setAuthToken,
  clearAuthToken,
};