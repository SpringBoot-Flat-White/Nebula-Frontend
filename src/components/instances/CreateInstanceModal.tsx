import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useInstances } from '../../hooks/useInstances';
import { getEngines } from '../../services/instanceService';
import type { Engine, InstanceDetail } from '../../types/database';

interface CreateInstanceModalProps {
  onClose: () => void;
  onSuccess: (instance: InstanceDetail, password: string) => void;
}

const CreateInstanceModal = ({ onClose, onSuccess }: CreateInstanceModalProps) => {
  const { user } = useAuth();
  const { createInstance } = useInstances();
  
  const [engines, setEngines] = useState<Engine[]>([]);
  const [selectedEngineId, setSelectedEngineId] = useState<number | null>(null);
  const [databaseName, setDatabaseName] = useState('');
  const [dbUser, setDbUser] = useState('');
  const [dbPassword, setDbPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const isFree = user?.plan?.toUpperCase() === 'FREE' || !user?.plan;
  const isPremiumOrStandard = user?.plan?.toUpperCase() === 'PREMIUM' || user?.plan?.toUpperCase() === 'STANDARD';

  useEffect(() => {
    loadEngines();
  }, []);

  const loadEngines = async () => {
    try {
      const data = await getEngines();
      setEngines(data);
    } catch {
      setError('Failed to load engines');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEngineId) {
      setError('Please select a database engine');
      return;
    }

    if (!user?.userId) {
      setError('User not authenticated');
      return;
    }

    // Validations for Premium/Standard plans
    if (isPremiumOrStandard) {
      if (!databaseName.trim()) {
        setError('Database name is required');
        return;
      }
      if (!dbUser.trim()) {
        setError('Database username is required');
        return;
      }
      if (dbUser.length > 100) {
        setError('Username must be at most 100 characters');
        return;
      }
      if (dbPassword && dbPassword.length > 255) {
        setError('Password must be at most 255 characters');
        return;
      }
    }

    try {
      setLoading(true);
      setError(null);

      const result = await createInstance({
        user: user.userId,
        engineId: selectedEngineId,
        ...(isPremiumOrStandard && {
          databaseName: databaseName,
          dbUser: dbUser,
          ...(dbPassword && { dbPassword: dbPassword }),
        }),
      });

      // Show success animation
      setShowSuccess(true);
      
      // Wait for animation before showing credentials modal
      setTimeout(() => {
        onSuccess(result.instance, result.password);
      }, 1500);
    } catch (err) {
      // Show user-friendly error messages
      let errorMessage = 'Failed to create instance. Please try again.';
      
      if (err instanceof Error) {
        const message = err.message.toLowerCase();
        
        if (message.includes('limit') || message.includes('maximum')) {
          errorMessage = 'You have reached the maximum number of instances for your plan.';
        } else if (message.includes('network') || message.includes('fetch')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else if (message.includes('unauthorized') || message.includes('authentication')) {
          errorMessage = 'Session expired. Please log in again.';
        } else if (message.includes('invalid') || message.includes('validation')) {
          errorMessage = 'Invalid input. Please check your data and try again.';
        } else if (message.includes('exists') || message.includes('duplicate')) {
          errorMessage = 'A database with this name already exists.';
        } else {
          // Use the error message from backend if it's readable
          errorMessage = err.message.replace(/^Failed to create instance: /, '');
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      {showSuccess ? (
        // Success Animation
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-12 max-w-md w-full text-center">
          <style>{`
            @keyframes scale-in {
              from { transform: scale(0.8); opacity: 0; }
              to { transform: scale(1); opacity: 1; }
            }
            @keyframes bounce-in {
              0% { transform: scale(0); }
              50% { transform: scale(1.1); }
              100% { transform: scale(1); }
            }
            @keyframes check-draw {
              0% { stroke-dashoffset: 100; }
              100% { stroke-dashoffset: 0; }
            }
            .animate-scale-in { animation: scale-in 0.3s ease-out; }
            .animate-bounce-in { animation: bounce-in 0.6s ease-out; }
            .animate-check { 
              stroke-dasharray: 100;
              animation: check-draw 0.5s ease-out 0.3s forwards;
              stroke-dashoffset: 100;
            }
          `}</style>
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 bg-green-100 rounded-full animate-ping"></div>
            <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 rounded-full w-24 h-24 flex items-center justify-center animate-bounce-in">
              <svg className="w-12 h-12 text-white animate-check" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-100 mb-2">Instance Created!</h3>
          <p className="text-gray-300">Your database instance is ready</p>
        </div>
      ) : (
      <div className="bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Create New Instance
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Engine Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-200 mb-3">
                Select Database Engine *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {engines.map((engine) => (
                  <button
                    key={engine.id}
                    type="button"
                    onClick={() => setSelectedEngineId(engine.id)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      selectedEngineId === engine.id
                        ? 'border-purple-500 bg-purple-900/30 shadow-md'
                        : 'border-gray-700 hover:border-purple-500/50 hover:bg-gray-800/50'
                    }`}
                  >
                    <div className="font-semibold text-gray-100">{engine.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Premium/Standard Form Fields */}
            {isPremiumOrStandard && (
              <>
                {/* Database Name */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-200 mb-2">
                    Database Name *
                  </label>
                  <input
                    type="text"
                    value={databaseName}
                    onChange={(e) => setDatabaseName(e.target.value)}
                    placeholder="e.g., my_database"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-gray-100 placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Database Username */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-200 mb-2">
                    Database Username *
                  </label>
                  <input
                    type="text"
                    value={dbUser}
                    onChange={(e) => setDbUser(e.target.value)}
                    placeholder="e.g., admin"
                    maxLength={100}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-gray-100 placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                  <p className="text-xs text-gray-400 mt-1">Maximum 100 characters</p>
                </div>

                {/* Database Password */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-200 mb-2">
                    Database Password
                  </label>
                  <input
                    type="password"
                    value={dbPassword}
                    onChange={(e) => setDbPassword(e.target.value)}
                    placeholder="Enter a secure password (optional)"
                    maxLength={255}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-gray-100 placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-400 mt-1">Optional - Maximum 255 characters</p>
                  <div className="mt-2 bg-amber-900/20 border border-amber-700/50 rounded-lg p-3">
                    <p className="text-xs text-amber-300">
                      <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <strong>Note:</strong> If you already have a user with the same username in your database, 
                      the password will remain the same as long as the username matches.
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-900/20 border border-red-700/50 text-red-300 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Info */}
            <div className="mb-6 bg-purple-900/20 border border-purple-700/50 rounded-lg p-4">
              <p className="text-sm text-purple-300">
                <strong>Note:</strong> Your instance will be created in a Docker container.
                {isFree && ' Credentials will be auto-generated and shown only once after creation.'}
                {isPremiumOrStandard && ' Make sure to save your credentials securely.'}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-6 py-3 border border-gray-700 text-gray-200 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !selectedEngineId}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </span>
                ) : (
                  'Create Instance'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      )}
    </div>
  );
};

export default CreateInstanceModal;
