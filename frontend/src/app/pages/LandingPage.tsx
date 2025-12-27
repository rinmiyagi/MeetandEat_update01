import { HeroSection } from '../components/HeroSection';
import { HowItWorks } from '../components/HowItWorks';
import { Features } from '../components/Features';

import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <Header>
        <nav className="hidden md:flex gap-8 text-sm">
          <a href="#how-it-works" className="text-gray-600 hover:text-orange-600 transition-colors">
            使い方
          </a>
          <a href="#features" className="text-gray-600 hover:text-orange-600 transition-colors">
            特徴
          </a>
        </nav>
      </Header>

      {/* Main Content */}
      <main className="pt-16">
        <HeroSection />
        <div id="how-it-works">
          <HowItWorks />
        </div>
        <div id="features">
          <Features />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}