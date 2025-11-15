import { useEffect, useRef, useState } from 'react';
import type { DatabaseEngine } from '../../types';

const DatabaseEngines = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    const currentSection = sectionRef.current;
    if (currentSection) {
      observer.observe(currentSection);
    }

    return () => {
      if (currentSection) {
        observer.unobserve(currentSection);
      }
    };
  }, []);

  const engines: DatabaseEngine[] = [
    {
      id: 'mysql',
      name: 'MySQL',
      icon: '',
      description: 'The world\'s most popular open source relational database.',
    },
    {
      id: 'postgresql',
      name: 'PostgreSQL',
      icon: '',
      description: 'Advanced object-relational database management system.',
    },
    {
      id: 'mongodb',
      name: 'MongoDB',
      icon: '',
      description: 'Document-oriented NoSQL database, flexible and scalable.',
    },
    {
      id: 'redis',
      name: 'Redis',
      icon: '',
      description: 'In-memory data structure store, ultra-fast.',
    },
    {
      id: 'sqlserver',
      name: 'SQL Server',
      icon: '',
      description: 'Microsoft\'s enterprise database management system.',
    },
    {
      id: 'cassandra',
      name: 'Cassandra',
      icon: '',
      description: 'Distributed NoSQL database, highly scalable.',
    },
  ];

  const engineColors = [
    'from-blue-500 to-blue-600',
    'from-indigo-500 to-blue-500',
    'from-green-500 to-green-600',
    'from-red-600 to-orange-500',
    'from-red-500 to-red-600',
    'from-purple-500 to-pink-500',
  ];

  return (
    <section ref={sectionRef} id="databases" className="py-20 bg-gradient-to-br from-slate-900 via-gray-900 to-black relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:64px_64px]"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Database engines</span>{' '}
            <span className="text-gray-100">available</span>
          </h2>
          <p className="text-xl text-gray-300">
            Choose the engine that best fits your project
          </p>
        </div>

        {/* Engines Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {engines.map((engine, index) => (
            <div
              key={engine.id}
              className={`bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-2xl hover:shadow-purple-500/40 transition-all duration-500 p-8 border-2 border-gray-800 hover:border-purple-500 group cursor-pointer card-3d ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
              }`}
              style={{
                transitionDelay: isVisible ? `${index * 100}ms` : '0ms'
              }}
            >
              {/* Database icon placeholder with gradient */}
              <div className={`w-16 h-16 bg-gradient-to-br ${engineColors[index]} rounded-xl flex items-center justify-center mb-6 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                <span className="text-3xl font-bold text-white">{engine.name.charAt(0)}</span>
              </div>

              <h3 className="text-2xl font-bold text-gray-100 mb-3 group-hover:text-purple-400 transition-colors">
                {engine.name}
              </h3>
              
              <p className="text-gray-400 leading-relaxed mb-6 group-hover:text-gray-300 transition-colors">
                {engine.description}
              </p>
              
              <div className="inline-flex items-center text-purple-400 font-semibold transition-all duration-300 group-hover:gap-2">
                <span>Create instance</span>
                <svg className="w-5 h-5 ml-1 transform transition-transform duration-300 group-hover:translate-x-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                </svg>
              </div>

              {/* Animated border on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/0 via-purple-500/20 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DatabaseEngines;
