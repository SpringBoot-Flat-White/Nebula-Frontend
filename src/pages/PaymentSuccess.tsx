import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { logout, refreshUser } = useAuth();

  useEffect(() => {
    // Log payment details
    const paymentId = searchParams.get('payment_id');
    const status = searchParams.get('collection_status') || searchParams.get('status');
    const preferenceId = searchParams.get('preference_id');

    console.log('Payment Success:', { paymentId, status, preferenceId });

    // If payment was approved, refresh user data to get updated plan
    
      refreshUser().then(() => {
        console.log('User plan refreshed after successful payment');
      }).catch(err => {
        console.error('Error refreshing user plan:', err);
      });
  }, [searchParams, refreshUser]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  const handleViewPlans = () => {
    navigate('/dashboard/plans');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black">
      {/* Header */}
      <header className="bg-gray-900/95 backdrop-blur-sm shadow-2xl sticky top-0 z-50 border-b border-gray-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/50">
                <span className="text-white font-bold text-xl">N</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Nebula
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-300 hover:text-purple-400 font-semibold transition-colors px-4 py-2 rounded-lg hover:bg-gray-800"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Success State */}
          <div className="bg-gray-900/95 backdrop-blur-sm rounded-2xl shadow-2xl shadow-green-500/20 p-12 border border-gray-800 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/50 animate-bounce">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-4">
              Payment Successful!
            </h1>
            
            <p className="text-xl text-gray-300 mb-8">
              Your subscription has been activated successfully
            </p>

            <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-xl p-6 mb-8 border border-green-700/50">
              <div className="space-y-3">
                <div className="flex items-center justify-center space-x-2 text-green-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-semibold">Payment processed successfully</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-green-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-semibold">Subscription activated</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-green-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-semibold">All features available</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-6 mb-8 border border-gray-700">
              <div className="flex items-start space-x-3 text-left">
                <svg className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="font-semibold text-white mb-2">What's next?</h3>
                  <p className="text-gray-400 text-sm">
                    Your plan has been updated and you now have access to all included features. 
                    Go to your dashboard to start creating your database instances.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleGoToDashboard}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-4 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-purple-500/50 hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Go to Dashboard
              </button>
              <button
                onClick={handleViewPlans}
                className="w-full bg-gray-800 text-gray-300 font-semibold py-3 px-6 rounded-lg hover:bg-gray-700 transition-all duration-300 border border-gray-700"
              >
                View My Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
