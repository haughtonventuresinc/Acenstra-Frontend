import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://acenstra-backend-production.up.railway.app';

const adminClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setAdminToken = (token: string | null) => {
  if (token) {
    adminClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete adminClient.defaults.headers.common['Authorization'];
  }
};

export interface AdminLoginCredentials {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  token: string;
}

export interface AdminUser {
  id: string;
  email: string;
  dateJoined: string;
  status: 'active' | 'inactive';
}

export interface AdminApplication {
  id: string;
  applicantName: string;
  applicantEmail: string;
  type: 'Credit Repair' | 'Business Funding';
  status: 'Pending' | 'Approved' | 'Rejected' | 'In Review';
  date: string;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalApplications: number;
  revenue: number;
  userGrowth: number;
  activeGrowth: number;
  applicationGrowth: number;
  revenueGrowth: number;
}

// Admin login - uses the same /api/login endpoint
export const adminLogin = async (credentials: AdminLoginCredentials): Promise<AdminLoginResponse> => {
  const response = await adminClient.post<AdminLoginResponse>('/api/login', credentials);
  if (response.data.token) {
    localStorage.setItem('admin_token', response.data.token);
    setAdminToken(response.data.token);
  }
  return response.data;
};

export const adminLogout = () => {
  localStorage.removeItem('admin_token');
  setAdminToken(null);
};

export const getAdminProfile = async (): Promise<{ email: string }> => {
  const token = localStorage.getItem('admin_token');
  if (token && !adminClient.defaults.headers.common['Authorization']) {
    setAdminToken(token);
  }
  const response = await adminClient.get<{ email: string }>('/api/me');
  return response.data;
};

// --- Mock data for dashboard (swap with real API calls later) ---

export const getAdminStats = async (): Promise<AdminStats> => {
  // TODO: Replace with real API call e.g. adminClient.get('/api/admin/stats')
  return {
    totalUsers: 1248,
    activeUsers: 847,
    totalApplications: 356,
    revenue: 89420,
    userGrowth: 12.5,
    activeGrowth: 8.3,
    applicationGrowth: 15.2,
    revenueGrowth: 22.1,
  };
};

export const getAdminUsers = async (): Promise<AdminUser[]> => {
  // TODO: Replace with real API call e.g. adminClient.get('/api/admin/users')
  return [
    { id: '1', email: 'john.doe@email.com', dateJoined: '2025-12-15', status: 'active' },
    { id: '2', email: 'jane.smith@email.com', dateJoined: '2025-11-20', status: 'active' },
    { id: '3', email: 'mike.wilson@email.com', dateJoined: '2026-01-05', status: 'inactive' },
    { id: '4', email: 'sarah.jones@email.com', dateJoined: '2026-01-18', status: 'active' },
    { id: '5', email: 'tom.brown@email.com', dateJoined: '2025-10-30', status: 'active' },
    { id: '6', email: 'lisa.garcia@email.com', dateJoined: '2026-02-01', status: 'active' },
    { id: '7', email: 'david.martinez@email.com', dateJoined: '2025-09-12', status: 'inactive' },
    { id: '8', email: 'emily.chen@email.com', dateJoined: '2026-02-10', status: 'active' },
  ];
};

export const getAdminApplications = async (): Promise<AdminApplication[]> => {
  // TODO: Replace with real API call e.g. adminClient.get('/api/admin/applications')
  return [
    { id: '1', applicantName: 'John Doe', applicantEmail: 'john.doe@email.com', type: 'Credit Repair', status: 'Approved', date: '2026-01-15' },
    { id: '2', applicantName: 'Jane Smith', applicantEmail: 'jane.smith@email.com', type: 'Business Funding', status: 'Pending', date: '2026-02-01' },
    { id: '3', applicantName: 'Mike Wilson', applicantEmail: 'mike.wilson@email.com', type: 'Credit Repair', status: 'In Review', date: '2026-02-05' },
    { id: '4', applicantName: 'Sarah Jones', applicantEmail: 'sarah.jones@email.com', type: 'Business Funding', status: 'Approved', date: '2026-01-20' },
    { id: '5', applicantName: 'Tom Brown', applicantEmail: 'tom.brown@email.com', type: 'Credit Repair', status: 'Rejected', date: '2025-12-28' },
    { id: '6', applicantName: 'Lisa Garcia', applicantEmail: 'lisa.garcia@email.com', type: 'Business Funding', status: 'Pending', date: '2026-02-12' },
    { id: '7', applicantName: 'David Martinez', applicantEmail: 'david.martinez@email.com', type: 'Credit Repair', status: 'In Review', date: '2026-02-18' },
  ];
};

// Initialize token from localStorage on module load
const initialToken = localStorage.getItem('admin_token');
if (initialToken) {
  setAdminToken(initialToken);
}
