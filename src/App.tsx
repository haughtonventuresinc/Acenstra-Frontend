import { Navbar } from './components/Navbar';
import { Hero } from './sections/Hero';
import { CreditRepairPlans } from './sections/CreditRepairPlans';
import { BusinessFunding } from './sections/BusinessFunding';
import { Features } from './sections/Features';
import { Results } from './sections/Results';
import { Testimonials } from './sections/Testimonials';
import { FAQs } from './sections/FAQs';
import { Footer } from './sections/Footer';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Hero />
      <CreditRepairPlans />
      <BusinessFunding />
      <Features />
      <Results />
      <Testimonials />
      <FAQs />
      <Footer />
    </div>
  );
}

export default App;