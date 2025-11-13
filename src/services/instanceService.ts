import type {
  InstanceDetail,
  CreateInstanceRequest,
  CreateInstanceResponse,
  RotatePasswordResponse,
  Engine,
} from '../types/database';

// MOCK DATA - Replace with real API calls when backend is ready
const MOCK_ENGINES: Engine[] = [
  { id: 1, name: 'MySQL' },
  { id: 2, name: 'PostgreSQL' },
  { id: 3, name: 'MongoDB' },
  { id: 4, name: 'Redis' },
  { id: 5, name: 'Cassandra' },
  { id: 6, name: 'SQL Server' },
];

const MOCK_INSTANCES: InstanceDetail[] = [
  {
    id: 1,
    name: 'my-mysql-db',
    containerId: 1,
    userDbId: 1,
    userId: 1,
    createdAt: '2025-11-10T10:30:00Z',
    updatedAt: '2025-11-10T10:30:00Z',
    container: {
      id: 1,
      ip: '91.98.233.27',
      port: 3306,
      engineId: 1,
      status: 'RUNNING',
      createdAt: '2025-11-10T10:30:00Z',
    },
    engine: { id: 1, name: 'MySQL' },
    status: 'RUNNING',
    credentials: {
      host: '91.98.233.27',
      port: 3306,
      database: 'my-mysql-db',
      username: 'user_1',
    },
  },
  {
    id: 2,
    name: 'test-postgres',
    containerId: 2,
    userDbId: 2,
    userId: 1,
    createdAt: '2025-11-09T14:20:00Z',
    updatedAt: '2025-11-09T14:20:00Z',
    container: {
      id: 2,
      ip: '91.98.233.27',
      port: 5432,
      engineId: 2,
      status: 'SUSPENDED',
      createdAt: '2025-11-09T14:20:00Z',
    },
    engine: { id: 2, name: 'PostgreSQL' },
    status: 'SUSPENDED',
    credentials: {
      host: '91.98.233.27',
      port: 5432,
      database: 'test-postgres',
      username: 'user_2',
    },
  },
];

// Make it mutable for CRUD operations
const mockInstancesStorage = [...MOCK_INSTANCES];

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Generate random database name for Free plan
const generateDbName = (engineName: string): string => {
  const randomHash = Math.random().toString(36).substring(2, 10);
  return `${engineName.toLowerCase()}_${randomHash}`;
};

// Generate random port
const generatePort = (engineId: number): number => {
  const basePorts: { [key: number]: number } = {
    1: 3306, // MySQL
    2: 5432, // PostgreSQL
    3: 27017, // MongoDB
    4: 6379, // Redis
    5: 9042, // Cassandra
    6: 1433, // SQL Server
  };
  return basePorts[engineId] || 8000 + Math.floor(Math.random() * 1000);
};

/**
 * Get all instances for the current user
 * GET /api/instances/{userId}
 */
export const getInstances = async (): Promise<InstanceDetail[]> => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';
  
  // Get userId from localStorage
  const userData = localStorage.getItem('user');
  if (!userData) {
    throw new Error('User not authenticated');
  }
  
  const user = JSON.parse(userData);
  if (!user.userId) {
    throw new Error('User ID not found');
  }
  
  const response = await fetch(`${API_BASE_URL}/api/instances/${user.userId}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch instances');
  }

  return await response.json();
};

/**
 * Get instance by ID
 * TODO: Replace with: GET /api/instances/{id}
 */
export const getInstanceById = async (id: number): Promise<InstanceDetail | null> => {
  await delay(300);
  return mockInstancesStorage.find((inst) => inst.id === id) || null;
};

/**
 * Create a new database instance
 * TODO: Replace with: POST /api/instances
 */
export const createInstance = async (
  request: CreateInstanceRequest
): Promise<CreateInstanceResponse> => {
  await delay(2000); // Simulate container creation time

  const engine = MOCK_ENGINES.find((e) => e.id === request.engineId);
  if (!engine) {
    throw new Error('Engine not found');
  }

  const instanceName = request.name || generateDbName(engine.name);
  const port = generatePort(request.engineId);
  const newId = mockInstancesStorage.length + 1;
  const password = `pwd_${Math.random().toString(36).substring(2, 15)}`;

  const newInstance: InstanceDetail = {
    id: newId,
    name: instanceName,
    containerId: newId,
    userDbId: newId,
    userId: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    container: {
      id: newId,
      ip: '91.98.233.27',
      port: port,
      engineId: request.engineId,
      status: 'RUNNING',
      createdAt: new Date().toISOString(),
    },
    engine: engine,
    status: 'RUNNING',
    credentials: {
      host: '91.98.233.27',
      port: port,
      database: instanceName,
      username: `user_${newId}`,
      password: password, // Only shown once
    },
  };

  mockInstancesStorage.push(newInstance);

  return {
    instance: newInstance,
    credentials: newInstance.credentials!,
  };
};

/**
 * Suspend an instance
 * TODO: Replace with: PUT /api/instances/{id}/suspend
 */
export const suspendInstance = async (id: number): Promise<InstanceDetail> => {
  await delay(1000);

  const instance = mockInstancesStorage.find((inst) => inst.id === id);
  if (!instance) {
    throw new Error('Instance not found');
  }

  instance.status = 'SUSPENDED';
  instance.container.status = 'SUSPENDED';
  instance.updatedAt = new Date().toISOString();

  return instance;
};

/**
 * Resume a suspended instance
 * TODO: Replace with: PUT /api/instances/{id}/resume
 */
export const resumeInstance = async (id: number): Promise<InstanceDetail> => {
  await delay(1000);

  const instance = mockInstancesStorage.find((inst) => inst.id === id);
  if (!instance) {
    throw new Error('Instance not found');
  }

  instance.status = 'RUNNING';
  instance.container.status = 'RUNNING';
  instance.updatedAt = new Date().toISOString();

  return instance;
};

/**
 * Delete an instance permanently
 * TODO: Replace with: DELETE /api/instances/{id}
 */
export const deleteInstance = async (id: number): Promise<void> => {
  await delay(1000);

  const index = mockInstancesStorage.findIndex((inst) => inst.id === id);
  if (index === -1) {
    throw new Error('Instance not found');
  }

  mockInstancesStorage[index].status = 'DELETED';
  mockInstancesStorage[index].container.status = 'DELETED';
  mockInstancesStorage[index].updatedAt = new Date().toISOString();

  // Remove from list after marking as deleted
  mockInstancesStorage.splice(index, 1);
};

/**
 * Rotate password for an instance
 * TODO: Replace with: POST /api/instances/{id}/rotate-password
 */
export const rotatePassword = async (id: number): Promise<RotatePasswordResponse> => {
  await delay(1500);

  const instance = mockInstancesStorage.find((inst) => inst.id === id);
  if (!instance) {
    throw new Error('Instance not found');
  }

  const newPassword = `pwd_${Math.random().toString(36).substring(2, 15)}`;

  return {
    newPassword: newPassword,
    rotatedAt: new Date().toISOString(),
  };
};

/**
 * Get available engines
 * TODO: Replace with: GET /api/engines
 */
export const getEngines = async (): Promise<Engine[]> => {
  await delay(200);
  return MOCK_ENGINES;
};
