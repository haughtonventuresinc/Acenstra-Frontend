import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { Rocket, Users, FileText } from 'lucide-react';

export function Hero() {
  const navigate = useNavigate();
  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 pt-32 pb-40">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8">
            REPAIR YOUR CREDIT.{' '}
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              FUND YOUR FUTURE.
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed">
            We help individuals and businesses transform their financial future through
            expert credit repair and flexible funding solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="primary" // Explicitly primary
              className="transform hover:scale-105 transition-transform font-bold uppercase"
              onClick={() => document.getElementById('tutorial')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Rocket size={20} className="mr-2" /> GET STARTED NOW
            </Button>
            <Button 
              size="lg" 
              variant="secondary"
              className="transform hover:scale-105 transition-transform"
              onClick={() => document.getElementById('testimonials')?.scrollIntoView()}
            >
              <Users size={20} className="mr-2" /> SEE SUCCESS STORIES
            </Button>
            <Button
              size="lg"
              variant="primary" // Use primary variant prop
              className="transform hover:scale-105 transition-transform font-bold uppercase" // Keep font-bold and uppercase if desired on top of variant
              onClick={() => navigate('/apply-funding')}
            >
              <FileText size={20} className="mr-2" /> APPLY FOR FUNDING
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}