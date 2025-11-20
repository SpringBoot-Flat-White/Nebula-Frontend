import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import DatabaseEngines from '../components/landing/DatabaseEngines';
import Statistics from '../components/landing/Statistics';
import Pricing from '../components/landing/Pricing';
import CTA from '../components/landing/CTA';

const LandingPage = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return null; // Or a loading spinner
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main>
        <Hero />
        <Features />
        <DatabaseEngines />
        <Statistics />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
