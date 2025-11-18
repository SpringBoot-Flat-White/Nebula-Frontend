export interface StatsToday {
  date: string;
  count: number;
}

export interface StatsTotal {
  date: string;
  count: number;
}

export interface StatsByEngine {
  engineName: string;
  count: number;
  [key: string]: string | number;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';

/**
 * Get instances created today
 * GET /api/instances/stats/today
 */
export const getStatsToday = async (): Promise<StatsToday> => {
  const response = await fetch(`${API_BASE_URL}/api/instances/stats/today`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch today stats');
  }

  return await response.json();
};

/**
 * Get total instances
 * GET /api/instances/stats/total
 */
export const getStatsTotal = async (): Promise<StatsTotal> => {
  const response = await fetch(`${API_BASE_URL}/api/instances/stats/total`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch total stats');
  }

  return await response.json();
};

/**
 * Get instances by engine
 * GET /api/instances/stats/by-engine
 */
export const getStatsByEngine = async (): Promise<StatsByEngine[]> => {
  const response = await fetch(`${API_BASE_URL}/api/instances/stats/by-engine`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch engine stats');
  }

  return await response.json();
};
