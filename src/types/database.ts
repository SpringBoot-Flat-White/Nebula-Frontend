// Types based on database schema (DDL)

export type UserType = 'INDIVIDUAL' | 'ORGANIZATION';

export type ContainerStatus = 'CREATING' | 'RUNNING' | 'SUSPENDED' | 'DELETED';

export type PaymentStatus = 'APPROVED' | 'PENDING' | 'FAILED' | 'PAUSED';

export type EngineName = 'MySQL' | 'PostgreSQL' | 'MongoDB' | 'Redis' | 'Cassandra' | 'SQL Server';

// Plans
export interface Plan {
  id: number;
  name: string;
  maxInstances: number;
  price: number;
  isFree: boolean;
}

// Engines
export interface Engine {
  id: number;
  name: EngineName;
}

// Containers
export interface Container {
  id: number;
  ip: string;
  port: number;
  engineId: number;
  status: ContainerStatus;
  createdAt: string;
}

// User Database Credentials
export interface UserDB {
  id: number;
  dbUser: string;
  dbPasswordEnc: string;
  userId: number;
}

// Instances
export interface Instance {
  id: number;
  name: string;
  containerId: number;
  userDbId: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
  // Populated fields (from joins)
  container?: Container;
  engine?: Engine;
  credentials?: InstanceCredentials;
}

// Instance with full details (populated)
export interface InstanceDetail extends Instance {
  container: Container;
  engine: Engine;
  status: ContainerStatus;
}

// Credentials shown only once
export interface InstanceCredentials {
  host: string;
  port: number;
  database: string;
  username: string;
  password?: string; // Only shown once after creation
}

// Payments
export interface Payment {
  id: number;
  userId: number;
  planId: number;
  status: PaymentStatus;
  transactionId: string | null;
  amount: number;
  createdAt: string;
}

// Password rotation history
export interface PasswordRotation {
  id: number;
  userDbId: number;
  oldPasswordEnc: string;
  newPasswordEnc: string;
  rotatedAt: string;
}

// Organizations
export interface Organization {
  id: number;
  name: string;
  ownerId: number;
  createdAt: string;
}

export interface OrganizationMember {
  id: number;
  orgId: number;
  userId: number;
}

// API Response types
export interface CreateInstanceRequest {
  engineId: number;
  name?: string; // Optional for Free plan
}

export interface CreateInstanceResponse {
  instance: Instance;
  credentials: InstanceCredentials;
}

export interface RotatePasswordResponse {
  newPassword: string;
  rotatedAt: string;
}
