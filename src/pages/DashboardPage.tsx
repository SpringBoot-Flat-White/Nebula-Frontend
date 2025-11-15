import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useInstances } from '../hooks/useInstances';

interface DashboardOption {
  id: string;
  name: string;
  description: string;
  icon: string;
  route: string;
  color: string;
}

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { instances, canCreateInstance } = useInstances();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getPlanLimit = (): number => {
    const plan = user?.plan?.toUpperCase() || 'FREE';
    switch (plan) {
      case 'FREE': return 2;
      case 'STANDARD': return 5;
      case 'PREMIUM': return 10;
      default: return 2;
    }
  };

  // Only show options for individual accounts
  const dashboardOptions: DashboardOption[] = user?.userType === 'INDIVIDUAL' ? [
    {
      id: 'instances',
      name: 'Database Instances',
      description: 'Manage your database instances',
      icon: '',
      route: '/dashboard/instances',
      color: 'from-purple-500 to-blue-500'
    },
    {
      id: 'engines',
      name: 'Database Engines',
      description: 'View instances by engine type',
      icon: '',
      route: '/dashboard/engines/all',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      id: 'plans',
      name: 'Subscription Plans',
      description: 'View and manage your plan',
      icon: '',
      route: '/dashboard/plans',
      color: 'from-pink-500 to-purple-500'
    },
    {
      id: 'transactions',
      name: 'Transactions',
      description: 'View your payment history',
      icon: '',
      route: '/dashboard/transactions',
      color: 'from-green-500 to-teal-500'
    }
  ] : [];

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

      <div className="flex">
        {/* Sidebar */}
        {user?.userType === 'INDIVIDUAL' && (
          <aside className="w-64 bg-gray-900/95 backdrop-blur-sm min-h-[calc(100vh-73px)] shadow-2xl border-r border-gray-800">
            <div className="p-6">
              <h2 className="text-lg font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Quick Access
              </h2>
              <nav className="space-y-3">
                {dashboardOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => navigate(option.route)}
                    className="w-full text-left px-4 py-4 rounded-xl hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-600 hover:text-white transition-all duration-200 group bg-gray-800/50 shadow-lg hover:shadow-purple-500/50 border border-gray-700 hover:border-purple-500"
                  >
                    <div>
                      <div className="font-semibold text-gray-100 group-hover:text-white">
                        {option.name}
                      </div>
                      <div className="text-xs text-gray-400 group-hover:text-purple-100">
                        {option.description}
                      </div>
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Welcome Section */}
          <div className="bg-gray-900/95 backdrop-blur-sm rounded-2xl shadow-2xl shadow-purple-500/10 p-8 mb-8 border border-gray-800">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
              Welcome, {user?.fullName}!
            </h1>
            <p className="text-xl text-gray-300">
              This is your dashboard. Here you'll manage your database instances.
            </p>
          </div>

          {/* User Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-900/95 backdrop-blur-sm rounded-xl shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 p-6 border border-gray-800 hover:border-gray-700">
              <div className="text-sm text-gray-400 mb-1">Account Type</div>
              <div className="text-2xl font-bold text-gray-100 capitalize">
                {user?.userType}
              </div>
            </div>
            <div className="bg-gray-900/95 backdrop-blur-sm rounded-xl shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 p-6 border border-gray-800 hover:border-gray-700">
              <div className="text-sm text-gray-400 mb-1">Current Plan</div>
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent capitalize">
                {user?.plan || "FREE"}
              </div>
            </div>
            <div className="bg-gray-900/95 backdrop-blur-sm rounded-xl shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 p-6 border border-gray-800 hover:border-gray-700">
              <div className="text-sm text-gray-400 mb-1">Instances Used</div>
              <div className="text-2xl font-bold text-gray-100">
                {instances.length} / {getPlanLimit()}
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                <div
                  className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300 shadow-lg shadow-purple-500/50"
                  style={{ width: `${(instances.length / getPlanLimit()) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Quick Actions - Only for Individual */}
          {user?.userType === 'INDIVIDUAL' && (
            <div className="bg-gray-900/95 backdrop-blur-sm rounded-2xl shadow-2xl shadow-purple-500/10 p-8 mb-8 border border-gray-800">
              <h2 className="text-2xl font-bold text-gray-100 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <button
                  onClick={() => navigate('/dashboard/instances')}
                  className={`p-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 text-left border ${
                    canCreateInstance
                      ? 'bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white border-purple-500 shadow-purple-500/50 hover:shadow-purple-500/70'
                      : 'bg-gray-800 text-gray-500 cursor-not-allowed border-gray-700'
                  }`}
                >
                  <h3 className="font-bold text-xl mb-2">Database Instances</h3>
                  <p className={`text-sm ${canCreateInstance ? 'text-purple-100' : 'text-gray-600'}`}>
                    {canCreateInstance
                      ? 'Create and manage your database instances'
                      : `Limit reached (${instances.length}/${getPlanLimit()})`}
                  </p>
                </button>

                <button
                  onClick={() => navigate('/dashboard/engines/all')}
                  className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-6 rounded-xl hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 text-left border border-blue-500 shadow-blue-500/50 hover:shadow-blue-500/70"
                >
                  <h3 className="font-bold text-xl mb-2">Database Engines</h3>
                  <p className="text-blue-100 text-sm">
                    View and manage instances by engine type
                  </p>
                </button>

                <button
                  onClick={() => navigate('/dashboard/plans')}
                  className="bg-gradient-to-br from-pink-600 to-purple-600 text-white p-6 rounded-xl hover:from-pink-500 hover:to-purple-500 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 text-left border border-pink-500 shadow-pink-500/50 hover:shadow-pink-500/70"
                >
                  <h3 className="font-bold text-xl mb-2">Subscription Plans</h3>
                  <p className="text-purple-100 text-sm">
                    View and manage your subscription plan
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* Coming Soon Section */}
          <div className="bg-gray-900/95 backdrop-blur-sm rounded-2xl shadow-2xl shadow-purple-500/10 p-8 text-center border border-gray-800">
            <h2 className="text-2xl font-bold text-gray-100 mb-2">Coming Soon</h2>
            <p className="text-gray-300">
              Instance management features will be implemented here, including:
            </p>
            <ul className="text-left max-w-md mx-auto mt-4 space-y-2">
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 text-purple-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Create database instances
              </li>
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 text-purple-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Manage running instances
              </li>
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 text-purple-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                View credentials and connection info
              </li>
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 text-purple-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Rotate passwords
              </li>
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
