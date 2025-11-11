import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { InstanceProvider } from './context/InstanceContext';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import InstancesPage from './pages/InstancesPage';
import EnginesPage from './pages/EnginesPage';
import PlansPage from './pages/PlansPage';

function App() {
  return (
    <AuthProvider>
      <InstanceProvider>
        <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/plans" 
            element={
              <ProtectedRoute>
                <PlansPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/instances" 
            element={
              <ProtectedRoute>
                <InstancesPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/engines" 
            element={
              <ProtectedRoute>
                <EnginesPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/engines/:engineId" 
            element={
              <ProtectedRoute>
                <EnginesPage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
      </InstanceProvider>
    </AuthProvider>
  );
}

export default App;

