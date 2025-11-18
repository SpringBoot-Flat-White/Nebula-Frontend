import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PaymentPendingPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { logout } = useAuth();

  useEffect(() => {
    // Log payment details
    const paymentId = searchParams.get('payment_id');
    const status = searchParams.get('collection_status') || searchParams.get('status');
    const preferenceId = searchParams.get('preference_id');

    console.log('Payment Pending:', { paymentId, status, preferenceId });
  }, [searchParams]);

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
          {/* Pending State */}
          <div className="bg-gray-900/95 backdrop-blur-sm rounded-2xl shadow-2xl shadow-yellow-500/20 p-12 border border-gray-800 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/50 animate-spin">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent mb-4">
              Pago Pendiente
            </h1>
            
            <p className="text-xl text-gray-300 mb-8">
              Tu pago está siendo procesado
            </p>

            <div className="bg-yellow-900/30 rounded-xl p-6 mb-8 border border-yellow-700/50">
              <div className="space-y-3">
                <p className="text-gray-300 font-semibold mb-3">
                  ⏳ Por favor, espera a que tu pago sea confirmado
                </p>
                <p className="text-gray-400 text-sm">
                  Algunos métodos de pago requieren confirmación adicional del banco. 
                  Recibirás un email de confirmación cuando tu pago haya sido procesado.
                </p>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-6 mb-8 border border-gray-700">
              <div className="flex items-start space-x-3 text-left">
                <svg className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="font-semibold text-white mb-2">¿Qué sucede ahora?</h3>
                  <ul className="text-gray-400 text-sm space-y-1">
                    <li>• Tu pago está siendo validado</li>
                    <li>• Verifica tu email para actualizaciones</li>
                    <li>• Tu plan se activará una vez confirmado</li>
                    <li>• Esto generalmente toma algunos minutos</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleGoToDashboard}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-4 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-purple-500/50 hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Ir al Dashboard
              </button>
              <button
                onClick={handleViewPlans}
                className="w-full bg-gray-800 text-gray-300 font-semibold py-3 px-6 rounded-lg hover:bg-gray-700 transition-all duration-300 border border-gray-700"
              >
                Ver Planes
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-700">
              <p className="text-gray-500 text-sm">
                Si tu pago no se confirma en 24 horas, contacta con soporte
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPendingPage;
