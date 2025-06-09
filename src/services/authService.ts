import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://acenstra-backend-production.up.railway.app'; // Point to backend
//const API_URL = 'http://localhost:5000';  


const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to set the JWT token for subsequent requests
export const setAuthToken = (token: string | null) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface UserProfile {
    email: string;
  // Add other fields if needed
}

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>('/api/login', credentials);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    setAuthToken(response.data.token);
  }
  return response.data;
};

export interface RegisterCredentials {
  email: string;
  password: string;
}

export const register = async (credentials: RegisterCredentials): Promise<void> => {
  await apiClient.post('/api/register', credentials);
};

export const forgotPassword = async (email: string): Promise<string> => {
  const response = await apiClient.post('/api/forgot-password', { email });
  return response.data.message;
};

export const userExists = async (email: string): Promise<boolean> => {
  const response = await apiClient.post('/api/user-exists', { email });
  return response.data.exists;
};

export const logout = () => {
  localStorage.removeItem('token');
  setAuthToken(null);
  // Potentially notify other parts of the app or redirect, e.g., by dispatching a context action
};

export const getProfile = async (): Promise<UserProfile> => {
  // Ensure token is set from localStorage if this is the first protected call after a refresh
  const token = localStorage.getItem('token');
  if (token && !apiClient.defaults.headers.common['Authorization']) {
    setAuthToken(token);
  }
  const response = await apiClient.get<UserProfile>('/api/me'); // backend protected endpoint
  return response.data;
};

// Attempt to load token from localStorage on initial load
const initialToken = localStorage.getItem('token');
if (initialToken) {
  setAuthToken(initialToken);
}

export const getCurrentUser = async (): Promise<{ email: string }> => {
  const response = await apiClient.get('/api/me');
  return response.data;
};

export const analyzeCreditReport = async (creditReportText: string): Promise<{ analysis: string }> => {
  // Ensure token is set if not already (e.g., after page refresh)
  const token = localStorage.getItem('token');
  if (token && !apiClient.defaults.headers.common['Authorization']) {
    setAuthToken(token);
  }
  const response = await apiClient.post<{ analysis: string }>('/api/ai/analyze-credit-report', {
    creditReportText,
  });
  return response.data;
};

export default {
  login,
  register,
  logout,
  getCurrentUser,
  // Note: analyzeCreditReport is a named export, not added to default
};
