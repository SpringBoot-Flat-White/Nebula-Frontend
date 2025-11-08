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

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
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
