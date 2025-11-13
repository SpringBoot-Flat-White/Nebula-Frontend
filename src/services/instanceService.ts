import type {
  InstanceDetail,
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
