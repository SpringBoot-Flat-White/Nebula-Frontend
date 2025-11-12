import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState('');

  /**
   * Handles registration using the backend API and stores the resulting user session.
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedName) {
      setError('Please enter your full name.');
      return;
    }

    if (trimmedName.length < 3) {
      setError('Full name must be at least 3 characters long.');
      return;
    }

    if (!trimmedEmail) {
      setError('Please enter your email address.');
      return;
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!trimmedPassword) {
      setError('Please enter a password.');
      return;
    }

    if (trimmedPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    // Password strength validation
    const hasUpperCase = /[A-Z]/.test(trimmedPassword);
    const hasLowerCase = /[a-z]/.test(trimmedPassword);
    const hasNumber = /[0-9]/.test(trimmedPassword);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      setError('Password must contain uppercase, lowercase, and numbers.');
      return;
    }

    if (trimmedPassword !== confirmPassword.trim()) {
      setError('Passwords do not match.');
      return;
    }

    if (!acceptedTerms) {
      setError('You must accept the terms and conditions.');
      return;
    }

    try {
      await register({
        fullName: trimmedName,
        email: trimmedEmail,
        password: trimmedPassword,
        userType: 'INDIVIDUAL',
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl">N</span>
            </div>
            <span className="text-3xl font-bold gradient-text">Nebula</span>
          </Link>
          <h1 className="text-3xl font-bold text-white mt-4">Create Account</h1>
          <p className="text-gray-400 mt-2">Start free with 2 instances</p>
        </div>

        {/* Form Card */}
        <div className="bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-800">
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

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-300 mb-2">
                Full name
              </label>
              <input
                type="text"
                id="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder-gray-500"
                placeholder="John Doe"
                autoComplete="name"
                disabled={isLoading}
                required
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder-gray-500"
                placeholder="you@email.com"
                autoComplete="email"
                disabled={isLoading}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder-gray-500"
                placeholder="••••••••"
                autoComplete="new-password"
                disabled={isLoading}
                required
              />
              {password && (
                <div className="mt-2 text-xs space-y-1">
                  <div className={password.length >= 8 ? 'text-green-500' : 'text-gray-600'}>
                    ✓ At least 8 characters
                  </div>
                  <div className={/[A-Z]/.test(password) ? 'text-green-500' : 'text-gray-600'}>
                    ✓ One uppercase letter
                  </div>
                  <div className={/[a-z]/.test(password) ? 'text-green-500' : 'text-gray-600'}>
                    ✓ One lowercase letter
                  </div>
                  <div className={/[0-9]/.test(password) ? 'text-green-500' : 'text-gray-600'}>
                    ✓ One number
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-300 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder-gray-500"
                placeholder="••••••••"
                autoComplete="new-password"
                disabled={isLoading}
                required
              />
            </div>

            {/* Terms */}
            <div className="flex items-start">
              <input
                type="checkbox"
                id="terms"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="rounded border-gray-700 bg-gray-800 text-primary-600 focus:ring-primary-500 mt-1"
                disabled={isLoading}
                required
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-400">
                I accept the{' '}
                <a href="#" className="text-primary-500 hover:text-primary-400 font-semibold">
                  terms and conditions
                </a>{' '}
                and the{' '}
                <a href="#" className="text-primary-500 hover:text-primary-400 font-semibold">
                  privacy policy
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-900 text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-3">
            {/* Google OAuth */}
            <button
              type="button"
              onClick={() => {
                window.location.href = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/oauth2/authorization/google`;
              }}
              className="w-full flex items-center justify-center px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors font-medium text-gray-300"
              disabled={isLoading}
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>

            {/* GitHub OAuth */}
            <button
              type="button"
              onClick={() => {
                window.location.href = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/oauth2/authorization/github`;
              }}
              className="w-full flex items-center justify-center px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors font-medium text-gray-300"
              disabled={isLoading}
            >
              <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"
                />
              </svg>
              Continue with GitHub
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-800"></div>
            </div>
          </div>

          {/* Login Link */}
          <p className="text-center text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-500 hover:text-primary-400 font-semibold">
              Sign in
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link to="/" className="text-gray-400 hover:text-primary-500 transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
