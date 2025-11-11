import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useInstances } from '../hooks/useInstances';
import type { InstanceDetail, ContainerStatus } from '../types/database';
import CreateInstanceModal from '../components/instances/CreateInstanceModal';
import CredentialsModal from '../components/instances/CredentialsModal';
import DeleteConfirmModal from '../components/instances/DeleteConfirmModal';

const InstancesPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const {
    instances,
    loading,
    error,
    suspendInstance,
    resumeInstance,
    deleteInstance,
    rotatePassword,
    canCreateInstance,
  } = useInstances();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedInstance, setSelectedInstance] = useState<InstanceDetail | null>(null);
  const [newPassword, setNewPassword] = useState<string>('');
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getStatusColor = (status: ContainerStatus): string => {
    switch (status) {
      case 'RUNNING':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'SUSPENDED':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'CREATING':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'DELETED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleSuspend = async (instance: InstanceDetail) => {
    try {
      setActionLoading(instance.id);
      await suspendInstance(instance.id);
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
    } catch (err) {
      console.error('Error resuming instance:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteClick = (instance: InstanceDetail) => {
    setSelectedInstance(instance);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedInstance) return;
    
    try {
      setActionLoading(selectedInstance.id);
      await deleteInstance(selectedInstance.id);
      setShowDeleteModal(false);
      setSelectedInstance(null);
    } catch (err) {
      console.error('Error deleting instance:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRotatePassword = async (instance: InstanceDetail) => {
    try {
      setActionLoading(instance.id);
      const password = await rotatePassword(instance.id);
      setNewPassword(password);
      setSelectedInstance(instance);
      setShowCredentialsModal(true);
    } catch (err) {
      console.error('Error rotating password:', err);
    } finally {
      setActionLoading(null);
    }
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
                className="w-full text-left px-4 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white transition-all duration-200 shadow-xl border border-purple-100"
              >
                <div className="font-semibold">Database Instances</div>
                <div className="text-xs text-purple-100">Manage instances</div>
              </button>

              <button
                onClick={() => navigate('/dashboard/plans')}
                className="w-full text-left px-4 py-4 rounded-xl hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-600 hover:text-white transition-all duration-200 group bg-white shadow-md hover:shadow-xl border border-purple-100"
              >
                <div className="font-semibold text-gray-900 group-hover:text-white">Subscription Plans</div>
                <div className="text-xs text-gray-600 group-hover:text-purple-100">Manage your plan</div>
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Page Header */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8 border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  Database Instances
                </h1>
                <p className="text-xl text-gray-600">
                  Manage your database instances
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600 mb-1">Instances Used</div>
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  {instances.length} / {getPlanLimit()}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-purple-600 to-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${(instances.length / getPlanLimit()) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Create Instance Button */}
          <div className="mb-6">
            <button
              onClick={() => setShowCreateModal(true)}
              disabled={!canCreateInstance}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg ${
                canCreateInstance
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 hover:shadow-xl transform hover:-translate-y-0.5'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {canCreateInstance ? '+ Create New Instance' : `Limit Reached (Upgrade Plan)`}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Loading State */}
          {loading && instances.length === 0 && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-12 text-center border border-purple-100">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading instances...</p>
            </div>
          )}

          {/* Instances List */}
          {!loading && instances.length === 0 && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-12 text-center border border-purple-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No instances yet</h3>
              <p className="text-gray-600 mb-6">
                Create your first database instance to get started
              </p>
            </div>
          )}

          {instances.length > 0 && (
            <div className="grid grid-cols-1 gap-6">
              {instances.map((instance) => (
                <div
                  key={instance.id}
                  className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-purple-100"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold text-gray-900">{instance.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(instance.status)}`}>
                          {instance.status}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">
                        <span className="font-semibold">{instance.engine.name}</span>
                      </p>
                      <p className="text-sm text-gray-500">
                        Created: {new Date(instance.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Connection Info */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Connection Details</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">Host:</span>
                        <span className="ml-2 font-mono font-semibold text-gray-900">
                          {instance.credentials?.host}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Port:</span>
                        <span className="ml-2 font-mono font-semibold text-gray-900">
                          {instance.credentials?.port}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Database:</span>
                        <span className="ml-2 font-mono font-semibold text-gray-900">
                          {instance.credentials?.database}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Username:</span>
                        <span className="ml-2 font-mono font-semibold text-gray-900">
                          {instance.credentials?.username}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-wrap">
                    {instance.status === 'RUNNING' && (
                      <button
                        onClick={() => handleSuspend(instance)}
                        disabled={actionLoading === instance.id}
                        className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {actionLoading === instance.id ? 'Suspending...' : 'Suspend'}
                      </button>
                    )}
                    
                    {instance.status === 'SUSPENDED' && (
                      <button
                        onClick={() => handleResume(instance)}
                        disabled={actionLoading === instance.id}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {actionLoading === instance.id ? 'Resuming...' : 'Resume'}
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleRotatePassword(instance)}
                      disabled={actionLoading === instance.id || instance.status !== 'RUNNING'}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {actionLoading === instance.id ? 'Rotating...' : 'Rotate Password'}
                    </button>
                    
                    <button
                      onClick={() => handleDeleteClick(instance)}
                      disabled={actionLoading === instance.id}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateInstanceModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={(instance, password) => {
            setShowCreateModal(false);
            setSelectedInstance(instance);
            setNewPassword(password);
            setShowCredentialsModal(true);
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

      {showDeleteModal && selectedInstance && (
        <DeleteConfirmModal
          instanceName={selectedInstance.name}
          onConfirm={handleDeleteConfirm}
          onCancel={() => {
            setShowDeleteModal(false);
            setSelectedInstance(null);
          }}
          loading={actionLoading === selectedInstance.id}
        />
      )}
    </div>
  );
};

export default InstancesPage;
