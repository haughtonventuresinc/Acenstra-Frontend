import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Hero } from './sections/Hero';
import { CreditRepairPlans } from './sections/CreditRepairPlans';
import { BusinessFunding } from './sections/BusinessFunding';
import { Features } from './sections/Features';
import { Results } from './sections/Results';
import { Testimonials } from './sections/Testimonials';
import { FAQs } from './sections/FAQs';


import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'; // Added
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashboardPage'; // Added
import ApplyFundingPage from './pages/ApplyFundingPage';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

// Component to render the original landing page content
const LandingPageContent = () => (
  <>
    <Hero />
    <CreditRepairPlans />
    <BusinessFunding />
    <Features />
    <Results />
    <Testimonials />
    <FAQs />
  </>
);

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} /> {/* Added Register Route */}
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<ProfilePage />} /> {/* Keeping profile for now */}
            <Route path="/dashboard" element={<DashboardPage />} /> {/* Added Dashboard Route */}
            {/* You can add more protected routes here */}
          </Route>

          {/* Public Route for the landing page */}
          <Route path="/apply-funding" element={<ApplyFundingPage />} />
          <Route 
            path="/"
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPageContent />}
          />

          {/* Catch-all route to redirect to home or a 404 page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;