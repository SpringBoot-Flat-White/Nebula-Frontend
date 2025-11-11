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
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Features</span> that make the difference
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to manage your cloud databases
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="card group hover:scale-105 transition-transform duration-300"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
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
