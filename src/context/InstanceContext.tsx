import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { InstanceDetail, CreateInstanceRequest } from '../types/database';
import * as instanceService from '../services/instanceService';
import { useAuth } from './AuthContext';

interface InstanceContextType {
  instances: InstanceDetail[];
  loading: boolean;
  error: string | null;
  refreshInstances: () => Promise<void>;
  createInstance: (request: CreateInstanceRequest) => Promise<{ instance: InstanceDetail; password: string }>;
  suspendInstance: (id: number) => Promise<void>;
  resumeInstance: (id: number) => Promise<void>;
  deleteInstance: (id: number) => Promise<void>;
  rotatePassword: (id: number) => Promise<string>;
  canCreateInstance: boolean;
}

// Exportar el contexto para uso en hooks
export const InstanceContext = createContext<InstanceContextType | undefined>(undefined);

export const InstanceProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [instances, setInstances] = useState<InstanceDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get plan limits
  const getPlanLimit = (): number => {
    const plan = user?.plan?.toUpperCase() || 'FREE';
    switch (plan) {
      case 'FREE':
        return 2;
      case 'STANDARD':
        return 5;
      case 'PREMIUM':
        return 10;
      default:
        return 2;
    }
  };

  const canCreateInstance = instances.length < getPlanLimit();

  // Load instances on mount
  useEffect(() => {
    if (user) {
      refreshInstances();
    }
  }, [user]);

  const refreshInstances = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await instanceService.getInstances();
      setInstances(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load instances');
      console.error('Error loading instances:', err);
    } finally {
      setLoading(false);
    }
  };

  const createInstance = async (request: CreateInstanceRequest): Promise<{ instance: InstanceDetail; password: string }> => {
    try {
      setLoading(true);
      setError(null);

      // Check if user can create more instances
      if (!canCreateInstance) {
        throw new Error(`You have reached the limit of ${getPlanLimit()} instances for your plan`);
      }

      const response = await instanceService.createInstance(request);

      // Add new instance to list
      setInstances((prev: InstanceDetail[]) => [...prev, response.instance as InstanceDetail]);

      return {
        instance: response.instance as InstanceDetail,
        password: response.credentials.password || '',
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create instance');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const suspendInstance = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const updatedInstance = await instanceService.suspendInstance(id);

      // Update instance in list
      setInstances((prev) =>
        prev.map((inst) => (inst.id === id ? updatedInstance : inst))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to suspend instance');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resumeInstance = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const updatedInstance = await instanceService.resumeInstance(id);

      // Update instance in list
      setInstances((prev) =>
        prev.map((inst) => (inst.id === id ? updatedInstance : inst))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resume instance');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteInstance = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await instanceService.deleteInstance(id);

      // Remove instance from list
      setInstances((prev) => prev.filter((inst) => inst.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete instance');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const rotatePassword = async (id: number): Promise<string> => {
    try {
      setLoading(true);
      setError(null);
      const response = await instanceService.rotatePassword(id);

      return response.newPassword;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to rotate password');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <InstanceContext.Provider
      value={{
        instances,
        loading,
        error,
        refreshInstances,
        createInstance,
        suspendInstance,
        resumeInstance,
        deleteInstance,
        rotatePassword,
        canCreateInstance,
      }}
    >
      {children}
    </InstanceContext.Provider>
  );
};
