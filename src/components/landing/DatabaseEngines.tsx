import type { DatabaseEngine } from '../../types';

const DatabaseEngines = () => {
  const engines: DatabaseEngine[] = [
    {
      id: 'mysql',
      name: 'MySQL',
      icon: '🐬',
      description: 'The world\'s most popular open source relational database.',
    },
    {
      id: 'postgresql',
      name: 'PostgreSQL',
      icon: '🐘',
      description: 'Advanced object-relational database management system.',
    },
    {
      id: 'mongodb',
      name: 'MongoDB',
      icon: '🍃',
      description: 'Document-oriented NoSQL database, flexible and scalable.',
    },
    {
      id: 'redis',
      name: 'Redis',
      icon: '⚡',
      description: 'In-memory data structure store, ultra-fast.',
    },
    {
      id: 'sqlserver',
      name: 'SQL Server',
      icon: '🏢',
      description: 'Microsoft\'s enterprise database management system.',
    },
    {
      id: 'cassandra',
      name: 'Cassandra',
      icon: '🌟',
      description: 'Distributed NoSQL database, highly scalable.',
    },
  ];

  return (
    <section id="databases" className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Database engines</span> available
          </h2>
          <p className="text-xl text-gray-600">
            Choose the engine that best fits your project
          </p>
        </div>

        {/* Engines Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {engines.map((engine) => (
            <div
              key={engine.id}
              className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 border-2 border-transparent hover:border-primary-500 group"
            >
              <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                {engine.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                {engine.name}
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                {engine.description}
              </p>
              <div className="inline-flex items-center text-primary-600 font-semibold group-hover:gap-2 transition-all">
                Create instance
                <svg className="w-5 h-5 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DatabaseEngines;
