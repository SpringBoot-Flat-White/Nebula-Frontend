import { Link } from 'react-router-dom';
import type { PricingPlan } from '../../types';

const Pricing = () => {
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
      price: 2000,
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
      price: 3000,
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

  return (
    <section id="pricing" className="py-20 bg-gradient-to-br from-black via-gray-900 to-slate-900">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Plans</span> <span className="text-gray-100">for every need</span>
          </h2>
          <p className="text-xl text-gray-300">
            Start free and scale when you need
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl border-2 p-8 transition-all duration-300 backdrop-blur-sm ${
                plan.popular
                  ? 'border-purple-500 shadow-2xl shadow-purple-500/30 scale-105 bg-gradient-to-br from-purple-900/30 to-blue-900/30'
                  : 'border-gray-800 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/20 bg-gray-900/80'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg shadow-purple-500/50">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan Name */}
              <h3 className="text-2xl font-bold text-gray-100 mb-2">{plan.name}</h3>

              {/* Price */}
              <div className="mb-6">
                <span className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  ${plan.price.toLocaleString('es-CO')}
                </span>
                <span className="text-gray-400 ml-2">COP/month</span>
              </div>

              {/* Instances */}
              <div className="mb-6 pb-6 border-b border-gray-700">
                <p className="text-gray-300 font-semibold">
                  <span className="text-2xl bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">{plan.instances}</span> instances
                </p>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg
                      className="w-5 h-5 text-purple-400 mr-3 mt-0.5 flex-shrink-0"
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

              {/* CTA Button */}
              <Link
                to="/register"
                className={`block w-full text-center py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                  plan.popular
                    ? 'btn-primary shadow-lg shadow-purple-500/50'
                    : 'bg-gray-800 text-gray-100 hover:bg-gray-700 border border-gray-700'
                }`}
              >
                {plan.price === 0 ? 'Get Started Free' : 'Get Started'}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
