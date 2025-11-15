import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import type { FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * Complete Profile Page
 * 
 * This page is shown to users who sign in with OAuth for the first time.
 * They need to provide their full name to complete their profile.
 */
const CompleteProfilePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { completeProfile, isLoading } = useAuth();
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (!emailParam) {
      navigate('/login');
      return;
    }
    setEmail(emailParam);
  }, [searchParams, navigate]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const trimmedFullName = fullName.trim();

    if (!trimmedFullName) {
      setError('Please enter your full name.');
      return;
    }

    if (trimmedFullName.length < 2) {
      setError('Full name must be at least 2 characters long.');
      return;
    }

    if (trimmedFullName.length > 100) {
      setError('Full name must not exceed 100 characters.');
      return;
    }

    try {
      await completeProfile(email, trimmedFullName);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete profile. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl">N</span>
            </div>
            <span className="text-3xl font-bold gradient-text">Nebula</span>
          </Link>
          <h1 className="text-3xl font-bold text-white mt-4">Complete Your Profile</h1>
          <p className="text-gray-400 mt-2">We need a bit more information to get started</p>
        </div>

        {/* Form Card */}
        <div className="bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-800">
          <div className="mb-6 p-4 bg-gray-800 border border-gray-700 rounded-lg">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-primary-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm text-white font-medium">Welcome to Nebula!</p>
                <p className="text-sm text-gray-400 mt-1">
                  Signed in as: <span className="font-semibold text-gray-300">{email}</span>
                </p>
              </div>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Error Message */}
            {error && (
              <div
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
                role="alert"
                aria-live="assertive"
              >
                {error}
              </div>
            )}

            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-semibold text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder-gray-500"
                placeholder="John Doe"
                autoComplete="name"
                disabled={isLoading}
                required
                minLength={2}
                maxLength={100}
              />
              <p className="mt-2 text-sm text-gray-500">
                This is how we'll address you in the platform
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Completing Profile...' : 'Complete Profile'}
            </button>
          </form>
        </div>

        {/* Sign Out Option */}
        <div className="text-center mt-6">
          <Link to="/login" className="text-gray-400 hover:text-primary-500 transition-colors">
            ← Sign in with a different account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfilePage;
