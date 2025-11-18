import type {
  InstanceDetail,
  CreateInstanceRequest,
  CreateInstanceResponse,
  RotatePasswordResponse,
  InstanceUpdateRequest,
  Engine,
} from '../types/database';

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
 * Get instances filtered by engine
 * GET /api/instances/{userId}/{engineId}
 */
export const getInstancesByEngine = async (engineId: number): Promise<InstanceDetail[]> => {
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
  
  const response = await fetch(`${API_BASE_URL}/api/instances/${user.userId}/${engineId}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch instances by engine');
  }

  return await response.json();
};

/**
 * Create a new database instance
 * POST /api/instances
 */
export const createInstance = async (
  request: CreateInstanceRequest
): Promise<CreateInstanceResponse> => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';

  const response = await fetch(`${API_BASE_URL}/api/instances`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create instance: ${errorText}`);
  }

  return await response.json();
};

/**
 * Suspend an instance
 * PUT /api/instances
 */
export const suspendInstance = async (instanceId: number): Promise<InstanceDetail> => {
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

  if (!instanceId) {
    throw new Error('Instance ID is required');
  }

  const requestBody: InstanceUpdateRequest = {
    user: user.userId,
    instanceId,
    status: 'SUSPENDED',
  };

  console.log('Suspend request body:', requestBody);

  const response = await fetch(`${API_BASE_URL}/api/instances`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error('Failed to suspend instance');
  }

  return await response.json();
};

/**
 * Resume an instance
 * PUT /api/instances
 */
export const resumeInstance = async (instanceId: number): Promise<InstanceDetail> => {
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

  if (!instanceId) {
    throw new Error('Instance ID is required');
  }

  const requestBody: InstanceUpdateRequest = {
    user: user.userId,
    instanceId,
    status: 'RUNNING',
  };

  console.log('Resume request body:', requestBody);

  const response = await fetch(`${API_BASE_URL}/api/instances`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error('Failed to resume instance');
  }

  return await response.json();
};

/**
 * Delete an instance
 * DELETE /api/instances/{id}
 */
export const deleteInstance = async (id: number): Promise<void> => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';

  const response = await fetch(`${API_BASE_URL}/api/instances/${id}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete instance');
  }
};

/**
 * Rotate password for an instance
 * POST /api/instances/{id}/rotate-password
 */
export const rotatePassword = async (id: number): Promise<RotatePasswordResponse> => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';

  const response = await fetch(`${API_BASE_URL}/api/instances/${id}/rotate-password`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to rotate password');
  }

  return await response.json();
};

/**
 * Get available database engines
 */
export const getEngines = async (): Promise<Engine[]> => {
  // Hardcoded engines list matching backend IDs
  const engines: Engine[] = [
    { id: 1, name: 'MySQL' },
    { id: 2, name: 'PostgreSQL' },
    { id: 3, name: 'SQL Server' },
    { id: 4, name: 'MongoDB' },
    { id: 5, name: 'Redis' },
    { id: 6, name: 'Cassandra' },
  ];
  
  return engines;
};
