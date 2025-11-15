import type { Transaction } from '../types';

// Backend API URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';

/**
 * Fetches the transaction history for the authenticated user
 * @returns Array of transactions
 */
export const getTransactions = async (): Promise<Transaction[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/payments/transactions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies (HttpOnly JWT)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error fetching transactions: ${response.status}`
      );
    }

    const data: Transaction[] = await response.json();
    return data;
  } catch (error) {
    console.error('Transaction service error:', error);
    throw error;
  }
};
