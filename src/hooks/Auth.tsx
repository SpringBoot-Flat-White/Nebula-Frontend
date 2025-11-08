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
		const reason =
			(payload && (payload as Record<string, string>).message) ??
			(payload && (payload as Record<string, string>).error) ??
			'Unexpected error communicating with the authentication service.';

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
	const response = await fetch(LOGIN_ENDPOINT, {
		method: 'POST',
		credentials: 'include',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(credentials),
	});

	return ensureSuccess<AuthenticationResponse>(response);
};

/**
 * Performs the register request. The backend is expected to mirror the login response.
 */
export const registerRequest = async (
	data: RegisterData,
): Promise<AuthenticationResponse> => {
	const response = await fetch(REGISTER_ENDPOINT, {
		method: 'POST',
		credentials: 'include',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
	});

	return ensureSuccess<AuthenticationResponse>(response);
};
