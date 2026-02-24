import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { AxiosError } from 'axios';
import * as adminService from '../services/adminService';

interface AdminAuthState {
  token: string | null;
  admin: { email: string } | null;
  isAdminAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AdminAuthContextType extends AdminAuthState {
  adminLogin: (credentials: adminService.AdminLoginCredentials) => Promise<void>;
  adminLogout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

interface AdminAuthProviderProps {
  children: ReactNode;
}

export const AdminAuthProvider: React.FC<AdminAuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AdminAuthState>(() => {
    const token = localStorage.getItem('admin_token');
    return {
      token,
      admin: null,
      isAdminAuthenticated: !!token,
      isLoading: !!token, // Loading if we need to validate existing token
      error: null,
    };
  });

  const fetchAdminProfile = useCallback(async () => {
    if (authState.token) {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      try {
        const profile = await adminService.getAdminProfile();
        setAuthState(prev => ({
          ...prev,
          admin: profile,
          isAdminAuthenticated: true,
          isLoading: false,
        }));
      } catch {
        adminService.adminLogout();
        setAuthState({
          token: null,
          admin: null,
          isAdminAuthenticated: false,
          isLoading: false,
          error: 'Admin session expired. Please login again.',
        });
      }
    }
  }, [authState.token]);

  useEffect(() => {
    if (authState.token && !authState.admin) {
      fetchAdminProfile();
    }
  }, [authState.token, authState.admin, fetchAdminProfile]);

  const adminLogin = async (credentials: adminService.AdminLoginCredentials) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await adminService.adminLogin(credentials);
      setAuthState(prev => ({
        ...prev,
        token: response.token,
        isAdminAuthenticated: true,
        isLoading: true, // Will fetch profile next
        error: null,
      }));
    } catch (err) {
      let errorMessage = 'Login failed';
      if (err instanceof AxiosError) {
        errorMessage = err.response?.data?.message || err.message || 'Login failed due to network or server error';
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      adminService.adminLogout();
      setAuthState({
        token: null,
        admin: null,
        isAdminAuthenticated: false,
        isLoading: false,
        error: errorMessage,
      });
    }
  };

  const adminLogout = () => {
    adminService.adminLogout();
    setAuthState({
      token: null,
      admin: null,
      isAdminAuthenticated: false,
      isLoading: false,
      error: null,
    });
  };

  return (
    <AdminAuthContext.Provider
      value={{
        token: authState.token,
        admin: authState.admin,
        isAdminAuthenticated: authState.isAdminAuthenticated,
        isLoading: authState.isLoading,
        error: authState.error,
        adminLogin,
        adminLogout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = (): AdminAuthContextType => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
