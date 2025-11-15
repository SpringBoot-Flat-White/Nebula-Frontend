import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getTransactions } from '../services/transactionService';
import type { Transaction } from '../types';

interface DashboardOption {
  id: string;
  name: string;
  description: string;
  icon: string;
  route: string;
  color: string;
}

const TransactionsPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        const data = await getTransactions();
        setTransactions(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError('Failed to load transactions. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'PENDING':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'FAILED':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'PAUSED':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'PENDING':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        );
      case 'FAILED':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

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
                    className={`w-full text-left px-4 py-4 rounded-xl transition-all duration-200 group shadow-lg border ${
                      option.id === 'transactions'
                        ? 'bg-gradient-to-r from-green-600 to-teal-600 text-white shadow-green-500/50 border-green-500'
                        : 'hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-600 hover:text-white bg-gray-800/50 hover:shadow-purple-500/50 border-gray-700 hover:border-purple-500'
                    }`}
                  >
                    <div>
                      <div className={`font-semibold ${option.id === 'transactions' ? 'text-white' : 'text-gray-100 group-hover:text-white'}`}>
                        {option.name}
                      </div>
                      <div className={`text-xs ${option.id === 'transactions' ? 'text-green-100' : 'text-gray-400 group-hover:text-purple-100'}`}>
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
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
              Transaction History
            </h1>
            <p className="text-gray-400">View all your payment transactions and their status</p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-6 mb-6">
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-red-400">{error}</p>
              </div>
            </div>
          )}

          {/* Transactions Table */}
          {!isLoading && !error && (
            <>
              {transactions.length === 0 ? (
                <div className="bg-gray-900/95 backdrop-blur-sm rounded-2xl shadow-2xl shadow-purple-500/10 p-12 text-center border border-gray-800">
                  <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">No Transactions Yet</h3>
                  <p className="text-gray-400 mb-6">You haven't made any payments yet.</p>
                  <button
                    onClick={() => navigate('/dashboard/plans')}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-purple-500 hover:to-blue-500 transition-all duration-300 shadow-lg shadow-purple-500/50"
                  >
                    View Plans
                  </button>
                </div>
              ) : (
                <div className="bg-gray-900/95 backdrop-blur-sm rounded-2xl shadow-2xl shadow-purple-500/10 border border-gray-800 overflow-hidden">
                  {/* Desktop Table View */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-800/50 border-b border-gray-700">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            Plan
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800">
                        {transactions.map((transaction) => (
                          <tr key={transaction.id} className="hover:bg-gray-800/30 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-semibold text-gray-200">
                                {transaction.planName}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-semibold text-gray-200">
                                {formatAmount(transaction.amount)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(transaction.status)}`}>
                                {getStatusIcon(transaction.status)}
                                <span>{transaction.status}</span>
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-400">
                                {formatDate(transaction.createdAt)}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card View */}
                  <div className="md:hidden divide-y divide-gray-800">
                    {transactions.map((transaction) => (
                      <div key={transaction.id} className="p-6 hover:bg-gray-800/30 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-200 mb-1">
                              {transaction.planName}
                            </h3>
                          </div>
                          <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(transaction.status)}`}>
                            {getStatusIcon(transaction.status)}
                            <span>{transaction.status}</span>
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="text-xl font-bold text-gray-200">
                            {formatAmount(transaction.amount)}
                          </div>
                          <div className="text-sm text-gray-400">
                            {formatDate(transaction.createdAt)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default TransactionsPage;
