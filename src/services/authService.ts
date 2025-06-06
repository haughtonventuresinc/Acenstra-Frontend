import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'; // Using Vite's env variable

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
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
}

export interface UserProfile {
  userId: number;
  username: string;
  // Add other fields that your /auth/profile endpoint might return
}

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
  if (response.data.access_token) {
    localStorage.setItem('token', response.data.access_token); // Store token in localStorage
    setAuthToken(response.data.access_token);
  }
  return response.data;
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
  const response = await apiClient.get<UserProfile>('/auth/profile');
  return response.data;
};

// Attempt to load token from localStorage on initial load
const initialToken = localStorage.getItem('token');
if (initialToken) {
  setAuthToken(initialToken);
}

export default apiClient;
