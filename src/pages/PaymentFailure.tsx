import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PaymentFailurePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { logout } = useAuth();

  useEffect(() => {
    // Log payment details
    const paymentId = searchParams.get('payment_id');
    const status = searchParams.get('collection_status') || searchParams.get('status');
    const preferenceId = searchParams.get('preference_id');

    console.log('Payment Failure:', { paymentId, status, preferenceId });
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
          {/* Failure State */}
          <div className="bg-gray-900/95 backdrop-blur-sm rounded-2xl shadow-2xl shadow-red-500/20 p-12 border border-gray-800 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-red-500/50">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent mb-4">
              Pago No Completado
            </h1>
            
            <p className="text-xl text-gray-300 mb-8">
              Hubo un problema al procesar tu pago
            </p>

            <div className="bg-red-900/30 rounded-xl p-6 mb-8 border border-red-700/50">
              <div className="space-y-3">
                <p className="text-gray-300">
                  El pago no pudo ser procesado. Esto puede deberse a:
                </p>
                <ul className="text-gray-400 text-sm space-y-2 text-left max-w-md mx-auto">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Fondos insuficientes en la tarjeta</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Datos de tarjeta incorrectos</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Transacción rechazada por el banco</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Límite de compras excedido</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-6 mb-8 border border-gray-700">
              <div className="flex items-start space-x-3 text-left">
                <svg className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <h3 className="font-semibold text-white mb-2">¿Necesitas ayuda?</h3>
                  <p className="text-gray-400 text-sm">
                    Si el problema persiste, por favor contacta con tu banco o intenta con otro método de pago. 
                    También puedes contactar nuestro equipo de soporte.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleViewPlans}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-4 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-purple-500/50 hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Intentar Nuevamente
              </button>
              <button
                onClick={handleGoToDashboard}
                className="w-full bg-gray-800 text-gray-300 font-semibold py-3 px-6 rounded-lg hover:bg-gray-700 transition-all duration-300 border border-gray-700"
              >
                Volver al Dashboard
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-700">
              <p className="text-gray-500 text-sm">
                No se realizó ningún cargo a tu cuenta
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailurePage;
