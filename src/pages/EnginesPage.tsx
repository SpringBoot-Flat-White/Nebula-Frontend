import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface DatabaseEngine {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
}

const engines: DatabaseEngine[] = [
  {
    id: 'all',
    name: 'All Engines',
    description: 'View all database instances',
    color: 'from-purple-600 to-blue-600',
    icon: ''
  },
  {
    id: 'mysql',
    name: 'MySQL',
    description: 'Open-source relational database',
    color: 'from-blue-500 to-blue-600',
    icon: ''
  },
  {
    id: 'sqlserver',
    name: 'SQL Server',
    description: 'Microsoft enterprise database',
    color: 'from-red-500 to-red-600',
    icon: ''
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    description: 'Advanced open-source database',
    color: 'from-indigo-500 to-blue-500',
    icon: ''
  },
  {
    id: 'redis',
    name: 'Redis',
    description: 'In-memory data structure store',
    color: 'from-red-600 to-orange-500',
    icon: ''
  },
  {
    id: 'cassandra',
    name: 'Cassandra',
    description: 'Distributed NoSQL database',
    color: 'from-purple-500 to-pink-500',
    icon: ''
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    description: 'Document-oriented NoSQL database',
    color: 'from-green-500 to-green-600',
    icon: ''
  }
];

const EnginesPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { engineId } = useParams();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Default to 'all' if no engineId is provided
  const currentEngineId = engineId || 'all';
  const selectedEngine = engines.find(e => e.id === currentEngineId);

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
            <div className="mb-6">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center text-gray-600 hover:text-purple-600 transition-colors mb-4"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Dashboard
              </button>
              <h2 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Database Engines
              </h2>
            </div>
            <nav className="space-y-2">
              {engines.map((engine) => (
                <button
                  key={engine.id}
                  onClick={() => navigate(`/dashboard/engines/${engine.id}`)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                    currentEngineId === engine.id
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                      : 'hover:bg-purple-50 text-gray-700'
                  }`}
                >
                  <span className="font-medium">{engine.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {selectedEngine ? (
            <div>
              {/* Engine Header */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8 border border-purple-100">
                <div className="flex items-center space-x-4 mb-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${selectedEngine.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <span className="text-white font-bold text-2xl">{selectedEngine.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      {selectedEngine.name}
                    </h1>
                    <p className="text-gray-600 text-lg">{selectedEngine.description}</p>
                  </div>
                </div>
              </div>

              {/* Instances Section */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-purple-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedEngine.id === 'all' ? 'All Your Instances' : `Your ${selectedEngine.name} Instances`}
                  </h2>
                  {selectedEngine.id !== 'all' && (
                    <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                      + Create Instance
                    </button>
                  )}
                </div>

                {/* Empty State */}
                <div className="text-center py-12">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No instances yet</h3>
                  <p className="text-gray-600 mb-6">
                    {selectedEngine.id === 'all' 
                      ? 'Create your first database instance to get started'
                      : `Create your first ${selectedEngine.name} instance to get started`
                    }
                  </p>
                </div>
              </div>

              {/* Coming Soon Features or All Engines Overview */}
              {selectedEngine.id === 'all' ? (
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <h3 className="col-span-full text-2xl font-bold text-gray-900 mb-2">Available Database Engines</h3>
                  {engines.slice(1).map((engine) => (
                    <button
                      key={engine.id}
                      onClick={() => navigate(`/dashboard/engines/${engine.id}`)}
                      className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-purple-100 hover:shadow-xl transition-all hover:scale-105 text-left group"
                    >
                      <div className="flex items-center space-x-4 mb-3">
                        <div className={`w-12 h-12 bg-gradient-to-br ${engine.color} rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                          <span className="text-white font-bold text-xl">{engine.name.charAt(0)}</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-lg">{engine.name}</h4>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm">{engine.description}</p>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-purple-100 hover:shadow-xl transition-shadow">
                    <h3 className="font-bold text-gray-900 mb-2">Instance Management</h3>
                    <p className="text-gray-600 text-sm">Start, stop, and configure your database instances</p>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-purple-100 hover:shadow-xl transition-shadow">
                    <h3 className="font-bold text-gray-900 mb-2">Credentials</h3>
                    <p className="text-gray-600 text-sm">View and manage connection credentials securely</p>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-purple-100 hover:shadow-xl transition-shadow">
                    <h3 className="font-bold text-gray-900 mb-2">Monitoring</h3>
                    <p className="text-gray-600 text-sm">Track performance and usage metrics</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-12 text-center border border-purple-100">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Select a Database Engine</h2>
              <p className="text-gray-600 text-lg">
                Choose a database engine from the sidebar to manage your instances
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default EnginesPage;
