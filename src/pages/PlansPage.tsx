import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { PricingPlan } from '../types';

const PlansPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const plans: PricingPlan[] = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      instances: 2,
      features: [
        'Up to 2 instances',
        'Auto-generated names',
        'Secure credentials',
        'Email support',
        'Access to all engines',
      ],
    },
    {
      id: 'standard',
      name: 'Standard',
      price: 19,
      instances: 5,
      popular: true,
      features: [
        'Up to 5 instances',
        'Custom names',
        'Secure credentials',
        'Priority support',
        'Access to all engines',
        'Password rotation',
        'Automatic backups',
      ],
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 49,
      instances: 10,
      features: [
        'Up to 10 instances',
        'Custom names',
        'Secure credentials',
        '24/7 support',
        'Access to all engines',
        'Password rotation',
        'Automatic backups',
        'Advanced monitoring',
        'Guaranteed SLA',
      ],
    },
  ];

  const currentPlan = user?.plan || 'FREE';

  const isPlanCurrent = (planName: string): boolean => {
    return planName.toUpperCase() === currentPlan;
  };

  const handlePlanSelection = (planId: string) => {
    // TODO: Implementar lógica de cambio de plan cuando el backend esté listo
    console.log('Selected plan:', planId);
    alert(`Plan selection for "${planId}" will be implemented with backend integration`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-md sticky top-0 z-50 border-b border-purple-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">N</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Nebula
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-700 hover:text-purple-600 font-semibold transition-colors px-4 py-2 rounded-lg hover:bg-purple-50"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white/80 backdrop-blur-sm min-h-[calc(100vh-73px)] shadow-lg border-r border-purple-100">
          <div className="p-6">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center text-gray-600 hover:text-purple-600 transition-colors mb-6"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </button>
            
            <h2 className="text-lg font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Quick Access
            </h2>
            
            <nav className="space-y-3">
              <button
                onClick={() => navigate('/dashboard/engines')}
                className="w-full text-left px-4 py-4 rounded-xl hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-600 hover:text-white transition-all duration-200 group bg-white shadow-md hover:shadow-xl border border-purple-100"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-3xl group-hover:scale-110 transition-transform">
                    🗄️
                  </span>
                  <div>
                    <div className="font-semibold text-gray-900 group-hover:text-white">
                      Database Engines
                    </div>
                    <div className="text-xs text-gray-600 group-hover:text-purple-100">
                      Manage instances
                    </div>
                  </div>
                </div>
              </button>

              <button
                className="w-full text-left px-4 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white transition-all duration-200 shadow-xl border border-purple-100"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">
                    💎
                  </span>
                  <div>
                    <div className="font-semibold">
                      Subscription Plans
                    </div>
                    <div className="text-xs text-purple-100">
                      Manage your plan
                    </div>
                  </div>
                </div>
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Page Header */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8 border border-purple-100">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
              Subscription Plans
            </h1>
            <p className="text-xl text-gray-600">
              Choose the perfect plan for your needs
            </p>
          </div>

          {/* Current Plan Info */}
          <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl shadow-2xl p-8 mb-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 mb-1">Your Current Plan</p>
                <h2 className="text-4xl font-bold mb-2">{currentPlan}</h2>
                <p className="text-purple-100">
                  {plans.find(p => p.name.toUpperCase() === currentPlan)?.instances || 0} instances available
                </p>
              </div>
              <div className="text-6xl">
                {currentPlan === 'FREE' && '🆓'}
                {currentPlan === 'STANDARD' && '⭐'}
                {currentPlan === 'PREMIUM' && '👑'}
              </div>
            </div>
          </div>

          {/* Plans Grid */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan) => {
                const isCurrent = isPlanCurrent(plan.name);
                
                return (
                  <div
                    key={plan.id}
                    className={`relative rounded-2xl border-2 p-8 transition-all duration-300 ${
                      isCurrent
                        ? 'border-green-500 shadow-2xl bg-gradient-to-br from-green-50 to-emerald-50'
                        : plan.popular
                        ? 'border-primary-500 shadow-xl scale-105 bg-gradient-to-br from-primary-50 to-secondary-50'
                        : 'border-gray-200 hover:border-primary-300 hover:shadow-xl bg-white'
                    }`}
                  >
                    {/* Current Plan Badge */}
                    {isCurrent && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <span className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                          ✓ Current Plan
                        </span>
                      </div>
                    )}

                    {/* Popular Badge */}
                    {!isCurrent && plan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <span className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                          Most Popular
                        </span>
                      </div>
                    )}

                    {/* Plan Name */}
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>

                    {/* Price */}
                    <div className="mb-6">
                      <span className="text-5xl font-bold gradient-text">
                        ${plan.price}
                      </span>
                      <span className="text-gray-600 ml-2">/month</span>
                    </div>

                    {/* Instances */}
                    <div className="mb-6 pb-6 border-b border-gray-200">
                      <p className="text-gray-700 font-semibold">
                        <span className="text-2xl gradient-text">{plan.instances}</span> instances
                      </p>
                    </div>

                    {/* Features */}
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <svg
                            className={`w-5 h-5 mr-3 mt-0.5 flex-shrink-0 ${
                              isCurrent ? 'text-green-600' : 'text-primary-600'
                            }`}
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M5 13l4 4L19 7"></path>
                          </svg>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <button
                      onClick={() => !isCurrent && handlePlanSelection(plan.id)}
                      disabled={isCurrent}
                      className={`block w-full text-center py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                        isCurrent
                          ? 'bg-green-100 text-green-700 cursor-not-allowed'
                          : plan.popular
                          ? 'btn-primary hover:shadow-xl transform hover:-translate-y-0.5'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                    >
                      {isCurrent ? 'Current Plan' : plan.price === 0 ? 'Downgrade' : 'Upgrade'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-purple-100">
            <div className="text-center">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Need Help Choosing?</h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                All plans include access to all database engines, secure credentials, and our standard features. 
                Upgrade anytime to get more instances and premium features.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="p-4 bg-purple-50 rounded-xl">
                  <div className="text-2xl mb-2">🚀</div>
                  <h4 className="font-bold text-gray-900 mb-1">Instant Activation</h4>
                  <p className="text-sm text-gray-600">Upgrades are applied immediately</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl">
                  <div className="text-2xl mb-2">🔒</div>
                  <h4 className="font-bold text-gray-900 mb-1">Secure Payments</h4>
                  <p className="text-sm text-gray-600">Your data is always protected</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl">
                  <div className="text-2xl mb-2">🔄</div>
                  <h4 className="font-bold text-gray-900 mb-1">Flexible Changes</h4>
                  <p className="text-sm text-gray-600">Change plans anytime you need</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PlansPage;
