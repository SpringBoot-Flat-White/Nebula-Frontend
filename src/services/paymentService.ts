import type { PaymentRequest, PaymentResponse } from '../types';

// Backend API URL - use same as AuthContext
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';

/**
 * Creates a payment preference in Mercado Pago through the backend
 * @param paymentData - Payment information including plan details
 * @returns Payment response with Mercado Pago init_point URL
 */
export const createPayment = async (
  paymentData: PaymentRequest
): Promise<PaymentResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/payments/change-plan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies (HttpOnly JWT)
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error creating payment: ${response.status}`
      );
    }

    const data: PaymentResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Payment service error:', error);
    throw error;
  }
};

