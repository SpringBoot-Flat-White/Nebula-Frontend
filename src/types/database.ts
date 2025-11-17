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

// Instance with full details (populated from joins)
export interface InstanceDetail extends Instance {
  idInstance: number;
  databaseName: string;
  engineName: EngineName;
  container: Container;
  engine: Engine;
  credentials: InstanceCredentials;
  status: ContainerStatus;
  containerIp?: string;
  containerPort?: number;
  dbUsername?: string;
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
  user: number; // User ID who owns the instance
  engineId: number; // Database engine type ID
  databaseName?: string; // Name of the database to create (required for Premium/Standard)
  dbUser?: string; // Database username (required for Premium/Standard, max 100 chars)
  dbPasswordEnc?: string; // Database password (required for Premium/Standard, max 255 chars)
}

export interface CreateInstanceResponse {
  id: number;
  databaseName: string;
  engineName: EngineName;
  dbUsername: string;
  containerIp: string;
  status: string;
  containerPort: number;
  password: string;
  userId: number;
  containerId: number;
  createdAt: string;
}

export interface RotatePasswordResponse {
  newPassword: string;
  rotatedAt: string;
}
