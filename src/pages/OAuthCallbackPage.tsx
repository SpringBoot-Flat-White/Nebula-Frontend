import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * OAuth Callback Page
 * 
 * This page handles the OAuth2 redirect after successful authentication.
 * The backend redirects here with query parameters indicating:
 * - profileCompleted: whether the user needs to complete their profile
 * - email: the user's email
 * 
 * The JWT token is already set as an HttpOnly cookie by the backend.
 */
const OAuthCallbackPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { handleOAuthCallback } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevent running twice in development mode (React StrictMode)
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const processOAuthCallback = async () => {
      try {
        const profileCompleted = searchParams.get('profileCompleted') === 'true';
        const email = searchParams.get('email');
        const fullName = searchParams.get('fullName');
        const userType = searchParams.get('userType');
        const userId = searchParams.get('userId');
        const planId = searchParams.get('planId');

        if (!email) {
          setError('Invalid authentication response. Please try again.');
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        // Parse user data from query parameters sent by backend
        const userData = {
          email,
          fullName: fullName || '',
          userType: userType || 'INDIVIDUAL',
          userId: userId ? parseInt(userId) : undefined,
          planId: planId ? parseInt(planId) : undefined,
        };

        // Process the OAuth callback in the auth context with complete user data
        await handleOAuthCallback(userData);

        // Redirect based on profile completion status
        if (profileCompleted) {
          navigate('/dashboard');
        } else {
          navigate(`/complete-profile?email=${encodeURIComponent(email)}`);
        }
      } catch (err) {
        console.error('OAuth callback error:', err);
        setError(err instanceof Error ? err.message : 'Authentication failed');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    processOAuthCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-800 text-center">
          <div className="w-16 h-16 bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Authentication Failed</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <p className="text-sm text-gray-500">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-800 text-center">
        <div className="animate-spin w-16 h-16 border-4 border-gray-700 border-t-primary-500 rounded-full mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold text-white mb-2">Completing Sign In</h2>
        <p className="text-gray-400">Please wait while we set up your account...</p>
      </div>
    </div>
  );
};

export default OAuthCallbackPage;
