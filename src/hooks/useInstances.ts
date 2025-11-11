import { useContext } from 'react';
import { InstanceContext } from '../context/InstanceContext';

export const useInstances = () => {
  const context = useContext(InstanceContext);
  if (context === undefined) {
    throw new Error('useInstances must be used within an InstanceProvider');
  }
  return context;
};
