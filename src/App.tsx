import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Hero } from './sections/Hero';
import { VideoTutorialSection } from './sections/VideoTutorialSection';
import { CreditRepairPlans } from './sections/CreditRepairPlans';
import { BusinessFunding } from './sections/BusinessFunding';
import { Features } from './sections/Features';
import { Results } from './sections/Results';
import { Testimonials } from './sections/Testimonials';
import { FAQs } from './sections/FAQs';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashboardPage';
import ApplyFundingPage from './pages/ApplyFundingPage';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

// Admin imports
import { AdminAuthProvider } from './context/AdminAuthContext';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProtectedRoute from './components/AdminProtectedRoute';

// Component to render the original landing page content
const LandingPageContent = () => (
  <>
    <Hero />
    <VideoTutorialSection />
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
    <Routes>
      {/* Admin Routes - no Navbar, wrapped in AdminAuthProvider */}
      <Route
        path="/admin/*"
        element={
          <AdminAuthProvider>
            <Routes>
              <Route path="/login" element={<AdminLoginPage />} />
              <Route element={<AdminProtectedRoute />}>
                <Route path="/dashboard" element={<AdminDashboardPage />} />
              </Route>
              <Route path="*" element={<Navigate to="/admin/login" replace />} />
            </Routes>
          </AdminAuthProvider>
        }
      />

      {/* Main Site Routes */}
      <Route
        path="/*"
        element={
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                </Route>

                {/* Public Routes */}
                <Route path="/apply-funding" element={<ApplyFundingPage />} />
                <Route
                  path="/"
                  element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPageContent />}
                />

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        }
      />
    </Routes>
  );
}

export default App;
