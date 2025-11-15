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
import CheckoutPage from './pages/CheckoutPage';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailure from './pages/PaymentFailure';
import TransactionsPage from './pages/TransactionsPage';
import OAuthCallbackPage from './pages/OAuthCallbackPage';
import CompleteProfilePage from './pages/CompleteProfilePage';

function App() {
  return (
    <AuthProvider>
      <InstanceProvider>
        <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/auth/callback" element={<OAuthCallbackPage />} />
          <Route path="/complete-profile" element={<CompleteProfilePage />} />
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
            path="/dashboard/transactions" 
            element={
              <ProtectedRoute>
                <TransactionsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/checkout" 
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/payment/success" 
            element={
              <ProtectedRoute>
                <PaymentSuccess />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/payment/failure" 
            element={
              <ProtectedRoute>
                <PaymentFailure />
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

