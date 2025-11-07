export interface DatabaseEngine {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  instances: number;
  features: string[];
  popular?: boolean;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
}

// Auth Types
export interface User {
  id: string;
  email: string;
  name: string;
  accountType: 'individual' | 'organization';
  plan: 'free' | 'standard' | 'premium';
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  accountType: 'individual' | 'organization';
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}
