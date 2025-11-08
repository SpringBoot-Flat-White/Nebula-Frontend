import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Only show options for individual accounts
  const dashboardOptions: DashboardOption[] = user?.userType === 'INDIVIDUAL' ? [
    {
      id: 'engines',
      name: 'Database Engines',
      description: 'Manage your database instances',
      icon: '🗄️',
      route: '/dashboard/engines',
      color: 'from-purple-500 to-blue-500'
    }
  ] : [];

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
        {user?.userType === 'INDIVIDUAL' && (
          <aside className="w-64 bg-white/80 backdrop-blur-sm min-h-[calc(100vh-73px)] shadow-lg border-r border-purple-100">
            <div className="p-6">
              <h2 className="text-lg font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Quick Access
              </h2>
              <nav className="space-y-3">
                {dashboardOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => navigate(option.route)}
                    className="w-full text-left px-4 py-4 rounded-xl hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-600 hover:text-white transition-all duration-200 group bg-white shadow-md hover:shadow-xl border border-purple-100"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl group-hover:scale-110 transition-transform">
                        {option.icon}
                      </span>
                      <div>
                        <div className="font-semibold text-gray-900 group-hover:text-white">
                          {option.name}
                        </div>
                        <div className="text-xs text-gray-600 group-hover:text-purple-100">
                          {option.description}
                        </div>
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
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8 border border-purple-100">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
              Welcome, {user?.fullName}! 👋
            </h1>
            <p className="text-xl text-gray-600">
              This is your dashboard. Here you'll manage your database instances.
            </p>
          </div>

          {/* User Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-purple-100">
              <div className="text-sm text-gray-600 mb-1">Account Type</div>
              <div className="text-2xl font-bold text-gray-900 capitalize">
                {user?.userType}
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-purple-100">
              <div className="text-sm text-gray-600 mb-1">Current Plan</div>
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent capitalize">
                {user?.plan || "FREE"}
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-purple-100">
              <div className="text-sm text-gray-600 mb-1">Email</div>
              <div className="text-lg font-semibold text-gray-900">
                {user?.email}
              </div>
            </div>
          </div>

          {/* Quick Actions - Only for Individual */}
          {user?.userType === 'INDIVIDUAL' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8 border border-purple-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <button
                  onClick={() => navigate('/dashboard/engines')}
                  className="bg-gradient-to-br from-purple-500 to-blue-500 text-white p-6 rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 text-left"
                >
                  <div className="text-4xl mb-3">🗄️</div>
                  <h3 className="font-bold text-xl mb-2">Database Engines</h3>
                  <p className="text-purple-100 text-sm">
                    Create and manage your database instances
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* Coming Soon Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 text-center border border-purple-100">
            <div className="text-6xl mb-4">🚀</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Coming Soon</h2>
            <p className="text-gray-600">
              Instance management features will be implemented here, including:
            </p>
            <ul className="text-left max-w-md mx-auto mt-4 space-y-2">
              <li className="flex items-center text-gray-700">
                <svg className="w-5 h-5 text-purple-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Create database instances
              </li>
              <li className="flex items-center text-gray-700">
                <svg className="w-5 h-5 text-purple-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Manage running instances
              </li>
              <li className="flex items-center text-gray-700">
                <svg className="w-5 h-5 text-purple-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                View credentials and connection info
              </li>
              <li className="flex items-center text-gray-700">
                <svg className="w-5 h-5 text-purple-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
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
