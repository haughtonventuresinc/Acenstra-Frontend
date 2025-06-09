import { Button } from '../components/Button';
import { DollarSign, BadgeCheck, Clock, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function BusinessFunding() {
  const navigate = useNavigate();
  return (
    <section id="business-funding" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            GET THE BUSINESS FUNDING YOU NEED
          </h2>
          <p className="text-xl text-gray-600">
            We'll help you get real business funding — and you don't pay until you're approved
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="feature-card">
            <DollarSign size={32} className="text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">FLEXIBLE FUNDING</h3>
            <p className="text-gray-600">
              Access $10k to $500k+ in business funding with competitive rates
            </p>
          </div>
          <div className="feature-card">
            <BadgeCheck size={32} className="text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">HIGH APPROVAL RATE</h3>
            <p className="text-gray-600">
              90% approval rate for qualified businesses
            </p>
          </div>
          <div className="feature-card">
            <Clock size={32} className="text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">FAST PROCESS</h3>
            <p className="text-gray-600">
              Get funded in as little as 72 hours after approval
            </p>
          </div>
        </div>

        <div className="text-center">
          <Button 
            size="lg" 
            variant="primary" 
            className="font-bold uppercase transform hover:scale-105 transition-transform" 
            onClick={() => navigate('/apply-funding')}
          >
            <FileText size={20} className="mr-2" /> APPLY FOR FUNDING
          </Button>
        </div>
      </div>
    </section>
  );
}