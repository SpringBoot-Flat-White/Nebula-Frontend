import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, LoginCredentials, RegisterData, AuthContextType } from '../types';
import { loginRequest, registerRequest } from '../hooks/Auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = () => {
      // We store the user profile in localStorage while the JWT is stored
      // as an HttpOnly cookie set by the backend. On mount we rehydrate
      // the user from localStorage if present.
      const userData = localStorage.getItem('user');

      if (userData) {
        try {
          const parsedUser = JSON.parse(userData) as User;
          setUser(parsedUser);
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem('user');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  /**
   * Perform login against the backend. The backend sets an HttpOnly cookie
   * containing the JWT; the response body contains the user profile which
   * we persist in localStorage for client rehydration.
   */
  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const resp = await loginRequest(credentials);

      const newUser: User = {
        email: resp.email,
        fullName: resp.fullName,
        userType: resp.userType,
        plan: resp.plan || 'FREE', // Default to FREE if not provided by backend
      };

      // Persist user profile locally; token is stored in cookie by the server.
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
    } catch (error) {
      console.error('Login error:', error);
      throw error instanceof Error ? error : new Error('Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Register a new user via the backend. Backend is expected to set the
   * authentication cookie and return the created user's profile in the body.
   */
  const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      const resp = await registerRequest(data);

      const newUser: User = {
        email: resp.email,
        fullName: resp.fullName,
        userType: resp.userType,
        plan: resp.plan || 'FREE', // Default to FREE if not provided by backend
      };

      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
    } catch (error) {
      console.error('Registration error:', error);
      throw error instanceof Error ? error : new Error('Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout the current user. If the backend exposes a logout endpoint that
   * clears the authentication cookie, we call it. In any case we remove the
   * local user profile so the UI updates immediately.
   */
  const logout = async () => {
    try {
      // Best-effort server logout; if this fails we still clear client state.
      await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      // ignore errors from logout call
      console.warn('Server logout failed or not available', err);
    } finally {
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  /**
   * Handle OAuth callback. This is called when the user is redirected back
   * from the OAuth provider. The JWT is already set as an HttpOnly cookie.
   * We create a basic user profile that will be completed later if needed.
   */
  const handleOAuthCallback = async (email: string) => {
    setIsLoading(true);
    try {
      // Create a basic user profile with the email from the callback
      // The JWT is already stored as an HttpOnly cookie by the backend
      const newUser: User = {
        email: email,
        fullName: '', // Will be filled when completing profile or from backend
        userType: 'INDIVIDUAL',
        plan: 'FREE',
      };

      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
    } catch (error) {
      console.error('OAuth callback error:', error);
      throw error instanceof Error ? error : new Error('OAuth authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Complete the user profile after OAuth registration.
   * This is called when a new OAuth user needs to provide their full name.
   */
  const completeProfile = async (email: string, fullName: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/auth/complete-profile?email=${encodeURIComponent(email)}`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ fullName }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || 
          errorData.error || 
          'Failed to complete profile'
        );
      }

      const userData = await response.json();

      const updatedUser: User = {
        email: userData.email,
        fullName: userData.fullName,
        userType: user?.userType || 'INDIVIDUAL',
        plan: user?.plan || 'FREE',
      };

      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Complete profile error:', error);
      throw error instanceof Error ? error : new Error('Failed to complete profile.');
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    handleOAuthCallback,
    completeProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
