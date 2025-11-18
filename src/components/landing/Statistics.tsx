import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { getStatsToday, getStatsTotal, getStatsByEngine } from '../../services/statsService';
import type { StatsByEngine } from '../../services/statsService';

const COLORS = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

const Statistics = () => {
  const [todayCount, setTodayCount] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [engineStats, setEngineStats] = useState<StatsByEngine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [today, total, byEngine] = await Promise.all([
          getStatsToday(),
          getStatsTotal(),
          getStatsByEngine(),
        ]);

        setTodayCount(today.count);
        setTotalCount(total.count);
        setEngineStats(byEngine);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-black to-purple-950/20">
        <div className="container mx-auto px-6">
          <div className="text-center text-purple-400">Loading statistics...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-black to-purple-950/20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Real-Time</span> Statistics
          </h2>
          <p className="text-gray-400 text-lg">
            Discover how many developers are already using Nebula
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Total Databases Card */}
          <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8 shadow-2xl hover:shadow-purple-500/20 transition-all duration-300">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/20 rounded-full mb-4">
                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
              </div>
              <h3 className="text-gray-400 text-sm font-medium mb-2">Total Databases</h3>
              <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-2">
                {totalCount}
              </p>
              <p className="text-gray-500 text-sm">Active instances</p>
            </div>
          </div>

          {/* Today's Databases Card */}
          <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8 shadow-2xl hover:shadow-purple-500/20 transition-all duration-300">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-500/20 rounded-full mb-4">
                <svg className="w-8 h-8 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-gray-400 text-sm font-medium mb-2">Created Today</h3>
              <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-600 mb-2">
                {todayCount}
              </p>
              <p className="text-gray-500 text-sm">New instances</p>
            </div>
          </div>

          {/* Databases by Engine - Pie Chart */}
          <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8 shadow-2xl hover:shadow-purple-500/20 transition-all duration-300">
            <h3 className="text-white text-lg font-semibold mb-4 text-center">By Database Engine</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={engineStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  animationBegin={0}
                  animationDuration={800}
                >
                  {engineStats.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    borderRadius: '8px',
                    color: 'white',
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(_value, entry) => {
                    const payload = entry.payload as StatsByEngine;
                    const total = engineStats.reduce((sum, s) => sum + s.count, 0);
                    const percent = ((payload.count / total) * 100).toFixed(0);
                    return `${payload.engineName}: ${percent}%`;
                  }}
                  wrapperStyle={{ color: '#9ca3af', fontSize: '14px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart - Full Width */}
        <div className="mt-8 bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8 shadow-2xl">
          <h3 className="text-white text-xl font-semibold mb-6 text-center">Database Distribution by Engine</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={engineStats}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 92, 246, 0.1)" />
              <XAxis
                dataKey="engineName"
                stroke="#9ca3af"
                tick={{ fill: '#9ca3af' }}
              />
              <YAxis
                stroke="#9ca3af"
                tick={{ fill: '#9ca3af' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: '8px',
                  color: 'white',
                }}
              />
              <Legend
                wrapperStyle={{ color: '#9ca3af' }}
              />
              <Bar
                dataKey="count"
                fill="url(#colorGradient)"
                radius={[8, 8, 0, 0]}
                animationBegin={0}
                animationDuration={800}
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1} />
                  <stop offset="100%" stopColor="#ec4899" stopOpacity={1} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
};

export default Statistics;
