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

  // Optional: Fetch user profile if token exists on initial load
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (authState.token && !authState.user) {
        setAuthState(prev => ({ ...prev, isLoading: true }));
        try {
          const profile = await authService.getProfile();
          setAuthState(prev => ({ ...prev, user: profile, isAuthenticated: true, isLoading: false }));
        } catch (err) {
          console.error('Failed to fetch profile on load:', err);
          // Token might be invalid/expired, so log out
          authService.logout(); // This will clear token from LS and auth headers
          setAuthState({
            token: null,
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: 'Session expired. Please login again.',
          });
        }
      }
    };
    fetchUserProfile();
  }, [authState.token, authState.user]); // Re-run if token or user changes

  const login = async (credentials: authService.LoginCredentials) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const loginResponse = await authService.login(credentials);
      // After successful login, authService.login already sets the token in localStorage and apiClient headers.
      // It also fetches the profile in the useEffect above when authState.token changes.
      // So we just need to update the state here based on the login response.
      // The useEffect will handle fetching the profile.
      setAuthState(prev => ({
        ...prev, // Keep existing user and error state for a moment
        token: loginResponse.access_token,
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
    <AuthContext.Provider value={{ ...authState, login, logout /*, clearError */ }}>
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
