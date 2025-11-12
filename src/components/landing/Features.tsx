import type { Feature } from '../../types';

const Features = () => {
  const features: Feature[] = [
    {
      id: '1',
      title: 'Instant Deployment',
      description: 'Create database instances in seconds. Docker containers ready to use.',
      icon: '',
    },
    {
      id: '2',
      title: 'Secure Credentials',
      description: 'Automatic credential generation. Encrypted passwords and rotation available.',
      icon: '',
    },
    {
      id: '3',
      title: 'Multi-Engine',
      description: 'Support for MySQL, PostgreSQL, MongoDB, Redis, Cassandra and SQL Server.',
      icon: '',
    },
    {
      id: '4',
      title: 'Complete Management',
      description: 'Suspend, resume, delete or rotate passwords from your dashboard.',
      icon: '',
    },
    {
      id: '5',
      title: 'Flexible Plans',
      description: 'From free plan to Premium. Scale according to your needs.',
      icon: '',
    },
    {
      id: '6',
      title: 'High Availability',
      description: 'Dedicated VPS with 24/7 monitoring. Your data always available.',
      icon: '',
    },
  ];

  return (
    <section id="features" className="py-20 bg-gradient-to-br from-black via-gray-900 to-slate-900">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Features</span> <span className="text-gray-100">that make the difference</span>
          </h2>
          <p className="text-xl text-gray-300">
            Everything you need to manage your cloud databases
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 p-8 border border-gray-800 hover:border-purple-500/50 group hover:scale-105"
            >
              <h3 className="text-xl font-bold text-gray-100 mb-3 group-hover:text-purple-400 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
