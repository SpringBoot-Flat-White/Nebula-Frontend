import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { PricingPlan } from '../types';
import { createPayment } from '../services/paymentService';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phone, setPhone] = useState('');

  // Get selected plan from navigation state
  const selectedPlan = location.state?.plan as PricingPlan | undefined;

  useEffect(() => {
    // Redirect to plans if no plan selected
    if (!selectedPlan) {
      navigate('/dashboard/plans');
    }
  }, [selectedPlan, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleProceedToPayment = async () => {
    if (!selectedPlan || !user) return;

    // Validate phone number
    if (!phone || phone.trim() === '') {
      setError('Please enter your phone number');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Map plan name to plan ID
      const planIdMap: { [key: string]: number } = {
        'free': 1,
        'standard': 2,
        'premium': 3,
      };

      const planId = planIdMap[selectedPlan.id.toLowerCase()];

      if (!planId) {
        throw new Error('Invalid plan');
      }

      // Create payment preference in backend
      const response = await createPayment({
        planId: planId,
        payerEmail: user.email,
        payerPhone: phone,
      });

      // Redirect to Mercado Pago
      if (response.initPoint) {
        window.location.href = response.initPoint;
      } else {
        throw new Error('Payment URL not received');
      }
    } catch (err) {
      console.error('Error creating payment:', err);
      setError(err instanceof Error ? err.message : 'Error processing payment. Please try again.');
      setLoading(false);
    }
  };

  if (!selectedPlan) {
    return null;
  }

  // Precios en COP sin IVA
  const priceMap: { [key: string]: number } = {
    'free': 0,
    'standard': 2000,
    'premium': 3000,
  };

  const price = priceMap[selectedPlan.id.toLowerCase()] || 0;
  const total = price;

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
        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard/plans')}
          className="flex items-center text-gray-400 hover:text-purple-400 transition-colors mb-8"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Plans
        </button>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
            Payment Summary
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Confirm your subscription before proceeding to payment
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Summary */}
            <div className="lg:col-span-2 space-y-6">
              {/* Plan Details Card */}
              <div className="bg-gray-900/95 backdrop-blur-sm rounded-2xl shadow-2xl shadow-purple-500/10 p-8 border border-gray-800">
                <h2 className="text-2xl font-bold text-white mb-6">Selected Plan</h2>
                
                <div className="flex items-start justify-between mb-6 pb-6 border-b border-gray-700">
                  <div>
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                      {selectedPlan.name}
                    </h3>
                    <p className="text-gray-400">
                      {selectedPlan.instances} database instances
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-white">
                      ${selectedPlan.price}
                    </p>
                    <p className="text-gray-400 text-sm">per month</p>
                  </div>
                </div>

                <h4 className="font-semibold text-white mb-4">Included Features:</h4>
                <ul className="space-y-3">
                  {selectedPlan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg
                        className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-purple-400"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* User Info Card */}
              <div className="bg-gray-900/95 backdrop-blur-sm rounded-2xl shadow-2xl shadow-purple-500/10 p-8 border border-gray-800">
                <h2 className="text-2xl font-bold text-white mb-6">Billing Information</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Name</p>
                    <p className="text-white font-semibold">{user?.fullName}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Email</p>
                    <p className="text-white font-semibold">{user?.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Account Type</p>
                    <p className="text-white font-semibold capitalize">{user?.userType.toLowerCase()}</p>
                  </div>
                  <div>
                    <label htmlFor="phone" className="text-gray-400 text-sm mb-1 block">
                      Phone <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+5491123456789"
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all"
                      required
                    />
                    <p className="text-gray-500 text-xs mt-1">Include country code (e.g: +54)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Summary Card */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl shadow-2xl shadow-purple-500/50 p-8 text-white sticky top-24">
                <h2 className="text-2xl font-bold mb-6">Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="border-b border-purple-400 pb-4">
                    <div className="flex justify-between text-xl">
                      <span className="font-bold">Total</span>
                      <span className="font-bold">${total.toLocaleString('es-CO')}</span>
                    </div>
                    <p className="text-purple-100 text-sm mt-1">COP per month</p>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-6">
                    <p className="text-sm text-white">{error}</p>
                  </div>
                )}

                <button
                  onClick={handleProceedToPayment}
                  disabled={loading}
                  className="w-full bg-white text-purple-600 font-bold py-4 px-6 rounded-lg hover:bg-purple-50 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      Proceed to Payment
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </button>

                <div className="mt-6 pt-6 border-t border-purple-400">
                  <div className="flex items-center justify-center space-x-2 text-purple-100">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span className="text-sm">Secure payment with Mercado Pago</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

