import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import DatabaseEngines from '../components/landing/DatabaseEngines';
import Pricing from '../components/landing/Pricing';
import CTA from '../components/landing/CTA';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main>
        <Hero />
        <Features />
        <DatabaseEngines />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
