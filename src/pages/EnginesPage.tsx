import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useInstances } from '../hooks/useInstances';
import type { InstanceDetail, ContainerStatus } from '../types/database';
import CreateInstanceModal from '../components/instances/CreateInstanceModal';
import CredentialsModal from '../components/instances/CredentialsModal';
import { getInstances, getInstancesByEngine } from '../services/instanceService';

interface DatabaseEngine {
  id: string;
  backendId: number | null; // ID used in backend API
  name: string;
  description: string;
  color: string;
  icon: string;
}

const engines: DatabaseEngine[] = [
  {
    id: 'all',
    backendId: null, // null means get all instances
    name: 'All Engines',
    description: 'View all database instances',
    color: 'from-purple-600 to-blue-600',
    icon: ''
  },
  {
    id: 'mysql',
    backendId: 1,
    name: 'MySQL',
    description: 'Open-source relational database',
    color: 'from-blue-500 to-blue-600',
    icon: ''
  },
  {
    id: 'postgres',
    backendId: 2,
    name: 'PostgreSQL',
    description: 'Advanced open-source database',
    color: 'from-indigo-500 to-blue-500',
    icon: ''
  },
  {
    id: 'sqlserver',
    backendId: 3,
    name: 'SQL Server',
    description: 'Microsoft enterprise database',
    color: 'from-red-500 to-red-600',
    icon: ''
  },
  {
    id: 'mongodb',
    backendId: 4,
    name: 'MongoDB',
    description: 'Document-oriented NoSQL database',
    color: 'from-green-500 to-green-600',
    icon: ''
  },
  {
    id: 'redis',
    backendId: 5,
    name: 'Redis',
    description: 'In-memory data structure store',
    color: 'from-red-600 to-orange-500',
    icon: ''
  },
  {
    id: 'cassandra',
    backendId: 6,
    name: 'Cassandra',
    description: 'Distributed NoSQL database',
    color: 'from-purple-500 to-pink-500',
    icon: ''
  }
];

const EnginesPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { engineId } = useParams();
  const { suspendInstance, resumeInstance, deleteInstance } = useInstances();

  const [instances, setInstances] = useState<InstanceDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [selectedInstance, setSelectedInstance] = useState<InstanceDetail | null>(null);
  const [newPassword, setNewPassword] = useState<string>('');
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  // Load instances when component mounts or engineId changes
  useEffect(() => {
    const loadInstances = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Default to 'all' if no engineId is provided
        const currentEngineId = engineId || 'all';
        const selectedEngine = engines.find(e => e.id === currentEngineId);
        
        if (!selectedEngine) {
          setError('Invalid engine selected');
          return;
        }

        // If 'all' is selected, get all instances, otherwise filter by engine
        const data = selectedEngine.backendId === null
          ? await getInstances()
          : await getInstancesByEngine(selectedEngine.backendId);
        
        setInstances(data);
      } catch (err) {
        console.error('Error loading instances:', err);
        setError(err instanceof Error ? err.message : 'Failed to load instances');
      } finally {
        setLoading(false);
      }
    };

    loadInstances();
  }, [engineId]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getStatusColor = (status: ContainerStatus): string => {
    switch (status) {
      case 'RUNNING':
        return 'bg-green-900/50 text-green-400 border-green-700';
      case 'SUSPENDED':
        return 'bg-yellow-900/50 text-yellow-400 border-yellow-700';
      case 'CREATING':
        return 'bg-blue-900/50 text-blue-400 border-blue-700';
      case 'DELETED':
        return 'bg-red-900/50 text-red-400 border-red-700';
      default:
        return 'bg-gray-800 text-gray-400 border-gray-700';
    }
  };

  const handleSuspend = async (instance: InstanceDetail) => {
    try {
      setActionLoading(instance.id);
      await suspendInstance(instance.id);
      // Reload instances after action
      const currentEngineId = engineId || 'all';
      const selectedEngine = engines.find(e => e.id === currentEngineId);
      const data = selectedEngine?.backendId === null
        ? await getInstances()
        : await getInstancesByEngine(selectedEngine!.backendId);
      setInstances(data);
    } catch (err) {
      console.error('Error suspending instance:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleResume = async (instance: InstanceDetail) => {
    try {
      setActionLoading(instance.id);
      await resumeInstance(instance.id);
      // Reload instances after action
      const currentEngineId = engineId || 'all';
      const selectedEngine = engines.find(e => e.id === currentEngineId);
      const data = selectedEngine?.backendId === null
        ? await getInstances()
        : await getInstancesByEngine(selectedEngine!.backendId);
      setInstances(data);
    } catch (err) {
      console.error('Error resuming instance:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (instance: InstanceDetail) => {
    if (!confirm(`Are you sure you want to delete "${instance.databaseName}"?`)) return;
    
    try {
      setActionLoading(instance.id);
      await deleteInstance(instance.id);
      // Reload instances after action
      const currentEngineId = engineId || 'all';
      const selectedEngine = engines.find(e => e.id === currentEngineId);
      const data = selectedEngine?.backendId === null
        ? await getInstances()
        : await getInstancesByEngine(selectedEngine!.backendId);
      setInstances(data);
    } catch (err) {
      console.error('Error deleting instance:', err);
    } finally {
      setActionLoading(null);
    }
  };

  // Default to 'all' if no engineId is provided
  const currentEngineId = engineId || 'all';
  const selectedEngine = engines.find(e => e.id === currentEngineId);

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
        <aside className="w-64 bg-gray-900/95 backdrop-blur-sm min-h-[calc(100vh-73px)] shadow-2xl border-r border-gray-800">
          <div className="p-6">
            <div className="mb-6">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center text-gray-400 hover:text-purple-400 transition-colors mb-4"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Dashboard
              </button>
              <h2 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
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
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/50'
                      : 'hover:bg-gray-800 text-gray-300 border border-gray-800'
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
              <div className="bg-gray-900/95 backdrop-blur-sm rounded-2xl shadow-2xl shadow-purple-500/10 p-8 mb-8 border border-gray-800">
                <div className="flex items-center space-x-4 mb-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${selectedEngine.color} rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/50`}>
                    <span className="text-white font-bold text-2xl">{selectedEngine.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                      {selectedEngine.name}
                    </h1>
                    <p className="text-gray-300 text-lg">{selectedEngine.description}</p>
                  </div>
                </div>
              </div>

              {/* Instances Section */}
              <div className="bg-gray-900/95 backdrop-blur-sm rounded-2xl shadow-2xl shadow-purple-500/10 p-8 border border-gray-800">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    {selectedEngine.id === 'all' ? 'All Your Instances' : `Your ${selectedEngine.name} Instances`}
                  </h2>
                  <button 
                    onClick={() => setShowCreateModal(true)}
                    className="px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg shadow-purple-500/50 transform bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 hover:shadow-xl hover:-translate-y-0.5"
                  >
                    + Create Instance
                  </button>
                </div>

                {loading ? (
                  /* Loading State */
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                    <p className="text-gray-300">Loading instances...</p>
                  </div>
                ) : error ? (
                  /* Error State */
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                ) : instances.length === 0 ? (
                  /* Empty State */
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-700">
                      <svg className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">No instances yet</h3>
                    <p className="text-gray-300 mb-6">
                      {selectedEngine && selectedEngine.id === 'all' 
                        ? 'Create your first database instance to get started'
                        : `Create your first ${selectedEngine?.name} instance to get started`
                      }
                    </p>
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="inline-flex items-center px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg shadow-purple-500/50 bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      + Create Your First Instance
                    </button>
                  </div>
                ) : (
                  /* Instance List */
                  <div className="space-y-4">
                    {instances.map((instance) => (
                      <div
                        key={instance.id}
                        className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-xl font-bold text-white">{instance.databaseName}</h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${instance.status ? getStatusColor(instance.status as ContainerStatus) : 'bg-gray-800 text-gray-400 border-gray-700'}`}>
                                {instance.status || 'UNKNOWN'}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
                              <div>
                                <span className="font-semibold text-gray-300">Engine:</span> {instance.engineName}
                              </div>
                              <div>
                                <span className="font-semibold">Port:</span> {instance.containerPort}
                              </div>
                              <div>
                                <span className="font-semibold">Host:</span> {instance.containerIp}
                              </div>
                              <div>
                                <span className="font-semibold">Created:</span> {new Date(instance.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex space-x-2 ml-4">
                            {instance.status === 'RUNNING' ? (
                              <button
                                onClick={() => handleSuspend(instance)}
                                disabled={actionLoading === instance.id}
                                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                              >
                                {actionLoading === instance.id ? 'Suspending...' : 'Suspend'}
                              </button>
                            ) : instance.status === 'SUSPENDED' ? (
                              <button
                                onClick={() => handleResume(instance)}
                                disabled={actionLoading === instance.id}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                              >
                                {actionLoading === instance.id ? 'Resuming...' : 'Resume'}
                              </button>
                            ) : null}
                            
                            <button
                              onClick={() => handleDelete(instance)}
                              disabled={actionLoading === instance.id || instance.status === 'DELETED'}
                              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                            >
                              {actionLoading === instance.id ? 'Deleting...' : 'Delete'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Coming Soon Features or All Engines Overview */}
              {selectedEngine.id === 'all' ? (
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <h3 className="col-span-full text-2xl font-bold text-gray-100 mb-2">Available Database Engines</h3>
                  {engines.slice(1).map((engine) => (
                    <button
                      key={engine.id}
                      onClick={() => navigate(`/dashboard/engines/${engine.id}`)}
                      className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-purple-500/30 hover:shadow-xl hover:border-purple-500/50 transition-all hover:scale-105 text-left group"
                    >
                      <div className="flex items-center space-x-4 mb-3">
                        <div className={`w-12 h-12 bg-gradient-to-br ${engine.color} rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                          <span className="text-white font-bold text-xl">{engine.name.charAt(0)}</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-100 text-lg">{engine.name}</h4>
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm">{engine.description}</p>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-purple-500/30 hover:shadow-xl hover:border-purple-500/50 transition-shadow">
                    <h3 className="font-bold text-gray-100 mb-2">Instance Management</h3>
                    <p className="text-gray-300 text-sm">Start, stop, and configure your database instances</p>
                  </div>
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-purple-500/30 hover:shadow-xl hover:border-purple-500/50 transition-shadow">
                    <h3 className="font-bold text-gray-100 mb-2">Credentials</h3>
                    <p className="text-gray-300 text-sm">View and manage connection credentials securely</p>
                  </div>
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-purple-500/30 hover:shadow-xl hover:border-purple-500/50 transition-shadow">
                    <h3 className="font-bold text-gray-100 mb-2">Monitoring</h3>
                    <p className="text-gray-300 text-sm">Track performance and usage metrics</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl p-12 text-center border border-purple-500/30">
              <h2 className="text-3xl font-bold text-gray-100 mb-3">Select a Database Engine</h2>
              <p className="text-gray-300 text-lg">
                Choose a database engine from the sidebar to manage your instances
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateInstanceModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={async (instance, password) => {
            setSelectedInstance(instance);
            setNewPassword(password);
            setShowCreateModal(false);
            setShowCredentialsModal(true);
            // Reload instances after creating a new one
            try {
              const currentEngineId = engineId || 'all';
              const selectedEngine = engines.find(e => e.id === currentEngineId);
              const data = selectedEngine?.backendId === null
                ? await getInstances()
                : await getInstancesByEngine(selectedEngine!.backendId);
              setInstances(data);
            } catch (err) {
              console.error('Error reloading instances:', err);
            }
          }}
        />
      )}

      {showCredentialsModal && selectedInstance && (
        <CredentialsModal
          instance={selectedInstance}
          password={newPassword}
          onClose={() => {
            setShowCredentialsModal(false);
            setSelectedInstance(null);
            setNewPassword('');
          }}
        />
      )}
    </div>
  );
};

export default EnginesPage;
