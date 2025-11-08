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
export type AccountType = 'INDIVIDUAL' | 'ORGANIZATION';

/**
 * Basic user profile persisted on the client-side session state.
 */
export interface User {
  email: string;
  fullName: string;
  userType: AccountType;
  id?: string;
  createdAt?: string;
}

/**
 * Payload sent to the authentication endpoint.
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Payload used when registering a new account via the API.
 */
export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  userType: AccountType;
}

/**
 * Raw authentication response returned by the backend after a successful login.
 */
export interface AuthenticationResponse {
  access_token: string;
  email: string;
  fullName: string;
  userType: AccountType;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}
