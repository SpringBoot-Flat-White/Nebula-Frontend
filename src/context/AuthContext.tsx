import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, LoginCredentials, RegisterData, AuthContextType, AccountType, PlanType } from '../types';
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
        userId: resp.userId,
        planId: resp.planId
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
        userId: resp.userId,
        planId: resp.planId,
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
   * User data is passed from the backend via query parameters.
   */
  const handleOAuthCallback = async (userData: {
    email: string;
    fullName: string;
    userType: string;
    userId?: number;
    planId?: number;
    plan?: string;
  }) => {
    setIsLoading(true);
    try {
      // Fetch complete user data from backend to get the correct plan
      let planName: PlanType = 'FREE';
      
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const backendData = await response.json();
          const backendPlan = backendData.plan?.toUpperCase();
          // Validate that the plan is a valid PlanType
          if (backendPlan === 'FREE' || backendPlan === 'STANDARD' || backendPlan === 'PREMIUM') {
            planName = backendPlan as PlanType;
          }
          console.log('OAuth - Fetched plan from backend:', planName);
        }
      } catch (error) {
        console.error('Failed to fetch plan from backend:', error);
      }

      // Create user profile from data sent by backend in query parameters
      const newUser: User = {
        email: userData.email,
        fullName: userData.fullName,
        userType: userData.userType as AccountType,
        plan: planName,
        userId: userData.userId,
        planId: userData.planId,
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

      console.log('Complete profile - Response from backend:', userData);
      console.log('Complete profile - Current user data:', user);

      const updatedUser: User = {
        email: userData.email || user?.email || email,
        fullName: userData.fullName || fullName,
        userType: userData.userType || user?.userType || 'INDIVIDUAL',
        plan: userData.plan || user?.plan || 'FREE',
        // Preserve userId and planId from current user if backend doesn't return them
        userId: userData.userId || user?.userId,
        planId: userData.planId || user?.planId,
      };

      console.log('Complete profile - Final user data:', updatedUser);

      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Complete profile error:', error);
      throw error instanceof Error ? error : new Error('Failed to complete profile.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Refresh user data from the backend.
   * This is useful after payment completion to get the updated plan.
   */
  const refreshUser = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
        method: 'GET',
        credentials: 'include', // Include HttpOnly cookie
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to refresh user data');
      }

      const userData = await response.json();

      const updatedUser: User = {
        email: userData.email,
        fullName: userData.fullName,
        userType: userData.userType,
        plan: userData.plan || 'FREE',
        userId: userData.userId,
        planId: userData.planId,
      };

      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      console.log('User data refreshed successfully:', updatedUser);
    } catch (error) {
      console.error('Error refreshing user data:', error);
      // Don't throw error, just log it
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
    refreshUser,
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
