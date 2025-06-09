import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AxiosError } from 'axios'; // Import AxiosError
import * as authService from '../services/authService'; // Assuming authService.ts is in ../services

interface AuthState {
  token: string | null;
  user: authService.UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (credentials: authService.LoginCredentials) => Promise<void>;
  logout: () => void;
  token: string | null;
  fetchUserProfile?: () => Promise<void>;
  // clearError: () => void; // Optional: if you want to manually clear errors
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const token = localStorage.getItem('token');
    return {
      token: token,
      user: null,
      isAuthenticated: !!token,
      isLoading: false, // Set to true if you auto-fetch profile on load
      error: null,
    };
  });

  // Fetch user profile function (must be defined outside useEffect)
  const fetchUserProfile = React.useCallback(async () => {
    if (authState.token) {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      try {
        const profile = await authService.getProfile();
        setAuthState(prev => ({ ...prev, user: profile, isAuthenticated: true, isLoading: false }));
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        // Token might be invalid/expired, so log out
        authService.logout();
        setAuthState({
          token: null,
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: 'Session expired. Please login again.',
        });
      }
    }
  }, [authState.token]);

  // Optional: Fetch user profile if token exists on initial load
  useEffect(() => {
    if (authState.token && !authState.user) {
      fetchUserProfile();
    }
  }, [authState.token, authState.user, fetchUserProfile]); // Add fetchUserProfile to deps

  const login = async (credentials: authService.LoginCredentials) => {
    const response = await authService.login(credentials);
    // After login, fetch user profile and update state
    await fetchUserProfile();

    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      setAuthState(prev => ({
        ...prev, // Keep existing user and error state for a moment
        token: response.token,
        isAuthenticated: true, // Optimistically set isAuthenticated
        isLoading: true, // We will be loading profile in useEffect
        error: null, 
      }));
    } catch (err) {
      let errorMessage = 'Login failed';
      if (err instanceof AxiosError) {
        errorMessage = err.response?.data?.message || err.message || 'Login failed due to network or server error';
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      console.error('Login error:', errorMessage);
      // Ensure token and user are cleared on login failure
      authService.logout(); // Clear any potentially partially set token
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
        isAuthenticated: false,
        token: null,
        user: null,
      }));
      // Re-throw or handle as per app's error handling strategy
      // throw new Error(errorMessage);
    }
  };

  const logout = () => {
    authService.logout();
    setAuthState({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
    // Optionally redirect to login page here using useNavigate if this component is within Router context
  };

  // const clearError = () => {
  //   setAuthState(prev => ({ ...prev, error: null }));
  // };

  return (
    <AuthContext.Provider value={{ user: authState.user, isAuthenticated: authState.isAuthenticated, login, logout, isLoading: authState.isLoading, error: authState.error, token: authState.token, fetchUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
