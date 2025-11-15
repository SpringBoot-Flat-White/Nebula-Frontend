import { useEffect, useRef, useState } from 'react';
import type { Feature } from '../../types';

const Features = () => {
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

  const featureIcons = ['⚡', '🔒', '🚀', '⚙️', '📈', '🌐'];

  return (
    <section ref={sectionRef} id="features" className="py-20 bg-gradient-to-br from-black via-gray-900 to-slate-900 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-purple-900/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Features</span>{' '}
            <span className="text-gray-100">that make the difference</span>
          </h2>
          <p className="text-xl text-gray-300">
            Everything you need to manage your cloud databases
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className={`bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-2xl hover:shadow-purple-500/30 transition-all duration-500 p-8 border border-gray-800 hover:border-purple-500/50 group hover:scale-105 hover:-translate-y-2 card-3d ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{
                transitionDelay: isVisible ? `${index * 100}ms` : '0ms'
              }}
            >
              {/* Icon with animation */}
              <div className="text-5xl mb-4 transform transition-all duration-300 group-hover:scale-125 group-hover:rotate-12">
                {featureIcons[index]}
              </div>
              
              <h3 className="text-xl font-bold text-gray-100 mb-3 group-hover:text-purple-400 transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                {feature.description}
              </p>

              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
