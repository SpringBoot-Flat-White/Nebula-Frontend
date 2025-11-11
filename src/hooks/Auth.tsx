import type {
	AuthenticationResponse,
	LoginCredentials,
	RegisterData,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';
const LOGIN_ENDPOINT = `${API_BASE_URL}/api/v1/auth/login`;
const REGISTER_ENDPOINT = `${API_BASE_URL}/api/v1/auth/register`;

/**
 * Safely parses a JSON payload, returning null if the body is empty or malformed.
 */
async function parseJson<T>(response: Response): Promise<T | null> {
	const raw = await response.text();
	if (!raw) {
		return null;
	}

	try {
		return JSON.parse(raw) as T;
	} catch (error) {
		console.warn('Failed to parse JSON response', error);
		return null;
	}
}

/**
 * Validates an HTTP response and throws a descriptive error when the request fails.
 */
async function ensureSuccess<T>(response: Response): Promise<T> {
	const payload = await parseJson<T | Record<string, string>>(response);

	if (!response.ok || !payload) {
		// Extract error message from backend
		const backendMessage = 
			(payload && (payload as Record<string, string>).message) ??
			(payload && (payload as Record<string, string>).error);

		// Provide user-friendly error messages based on status code
		let reason: string;
		
		// Spring Security returns 403 for authentication failures by default,
		// not just authorization failures. Treat both 401 and 403 as invalid credentials.
		if (response.status === 401 || response.status === 403) {
			// Both 401 and 403 usually mean invalid credentials in Spring Security
			reason = backendMessage || 'Invalid email or password. Please try again.';
		} else if (response.status === 404) {
			reason = backendMessage || 'Authentication service not found. Please try again later.';
		} else if (response.status === 409) {
			reason = backendMessage || 'An account with this email already exists.';
		} else if (response.status === 422) {
			reason = backendMessage || 'Invalid data provided. Please check your inputs.';
		} else if (response.status >= 500) {
			reason = backendMessage || 'Server error. Please try again later.';
		} else if (!navigator.onLine) {
			reason = 'No internet connection. Please check your network.';
		} else {
			reason = backendMessage || 'Unexpected error. Please try again.';
		}

		throw new Error(reason);
	}

	return payload as T;
}

/**
 * Performs the login request and returns the backend authentication response.
 */
export const loginRequest = async (
	credentials: LoginCredentials,
): Promise<AuthenticationResponse> => {
	try {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

		const response = await fetch(LOGIN_ENDPOINT, {
			method: 'POST',
			credentials: 'include',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(credentials),
			signal: controller.signal,
		});

		clearTimeout(timeoutId);
		return ensureSuccess<AuthenticationResponse>(response);
	} catch (error) {
		if (error instanceof Error && error.name === 'AbortError') {
			throw new Error('Request timeout. Please check your connection and try again.');
		}
		if (error instanceof Error && error.message.includes('Failed to fetch')) {
			throw new Error('Unable to connect to server. Please check your internet connection.');
		}
		throw error;
	}
};

/**
 * Performs the register request. The backend is expected to mirror the login response.
 */
export const registerRequest = async (
	data: RegisterData,
): Promise<AuthenticationResponse> => {
	try {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

		const response = await fetch(REGISTER_ENDPOINT, {
			method: 'POST',
			credentials: 'include',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data),
			signal: controller.signal,
		});

		clearTimeout(timeoutId);
		return ensureSuccess<AuthenticationResponse>(response);
	} catch (error) {
		if (error instanceof Error && error.name === 'AbortError') {
			throw new Error('Request timeout. Please check your connection and try again.');
		}
		if (error instanceof Error && error.message.includes('Failed to fetch')) {
			throw new Error('Unable to connect to server. Please check your internet connection.');
		}
		throw error;
	}
};
