// JWT Token utilities for localStorage management

const TOKEN_KEY = 'pinterest_jwt_token';
const USER_KEY = 'pinterest_user';

export interface StoredUser {
  userId: number;
  name: string;
  email: string;
  username: string;
  mobile: string;
  bio: string;
  profilePath: string;
  accountType: 'USER' | 'BUSINESS';
  businessName?: string;
  websiteUrl?: string;
  description?: string;
}

// Store JWT token in localStorage
export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

// Get JWT token from localStorage
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

// Remove JWT token from localStorage
export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

// Check if user is authenticated (has valid token)
export const isAuthenticated = (): boolean => {
  const token = getToken();
  if (!token) return false;
  
  // Check if token is expired
  try {
    const payload = parseJwt(token);
    if (!payload || !payload.exp) return false;
    
    // exp is in seconds, Date.now() is in milliseconds
    const isExpired = payload.exp * 1000 < Date.now();
    return !isExpired;
  } catch {
    return false;
  }
};

// Parse JWT token to get payload
export const parseJwt = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

// Get user ID from token
export const getUserIdFromToken = (): number | null => {
  const token = getToken();
  if (!token) return null;
  
  const payload = parseJwt(token);
  return payload?.userId || null;
};

// Store user data in localStorage
export const setStoredUser = (user: StoredUser): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

// Get user data from localStorage
export const getStoredUser = (): StoredUser | null => {
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

// Remove user data from localStorage
export const removeStoredUser = (): void => {
  localStorage.removeItem(USER_KEY);
};

// Clear all auth data (logout)
export const clearAuth = (): void => {
  removeToken();
  removeStoredUser();
};

// Get Authorization header for API requests
export const getAuthHeader = (): { Authorization: string } | {} => {
  const token = getToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
};
