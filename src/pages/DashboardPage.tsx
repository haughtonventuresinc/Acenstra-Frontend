import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { analyzeCreditReport } from '../services/authService'; // Import the analyzeCreditReport function
import { AxiosError } from 'axios'; // Import AxiosError for specific error handling

const DashboardPage: React.FC = () => {
  const [creditReportText, setCreditReportText] = useState('');
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, token } = useAuth(); // Get token from useAuth
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const currentSection = queryParams.get('section') || 'profile'; // Default to 'home'

  const handleAnalyzeReport = async () => {
    if (!creditReportText.trim()) {
      setError('Please paste your credit report text.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    if (!token) {
      setError('Authentication token not found. Please log in again.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await analyzeCreditReport(creditReportText);
      setAnalysisResult(response.analysis);
    } catch (error: unknown) {
      console.error('Error analyzing report:', error);
      if (error instanceof AxiosError) {
        if (error.response && error.response.data && typeof error.response.data.error === 'string') {
          setError(error.response.data.error);
        } else {
          setError(error.message || 'An API error occurred. Please try again.');
        }
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderSectionContent = () => {
    switch (currentSection) {
      case 'ai_analyzer':
        return (
          <div className="bg-white rounded-3xl shadow-xl p-8 mt-8 border border-blue-100">
            <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">Credit Report Analyzer</h2>
            <textarea
              className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm"
              placeholder="Paste your credit report text here..."
              value={creditReportText}
              onChange={(e) => setCreditReportText(e.target.value)}
              disabled={isLoading}
            />
            <button
              onClick={handleAnalyzeReport}
              disabled={isLoading}
              className="mt-4 w-full flex items-center justify-center gap-2 px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all shadow-md disabled:opacity-50"
            >
              <Sparkles size={20} className="mr-2" /> {isLoading ? 'Analyzing...' : 'Analyze Report'}
            </button>

            {error && (
              <div className="mt-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-lg text-sm">
                {error}
              </div>
            )}

            {analysisResult && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-blue-800 mb-3">Analysis Result:</h3>
                <pre className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap text-sm border border-gray-200">
                  {analysisResult}
                </pre>
              </div>
            )}
          </div>
        );
      case 'profile':
        return (
          <div className="bg-white rounded-3xl shadow-xl p-8 mt-8 border border-blue-100">
            <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">My Profile</h2>
            <div className="text-center text-lg md:text-xl text-blue-700 font-semibold mb-4">
              {isLoading ? 'Loading email...' : (user?.email || 'Could not load email')}
            </div>
            <p className="text-center text-gray-600">Additional profile information and settings can be displayed here.</p>
            {/* You can add profile editing form or display user info here */}
          </div>
        );
      case 'applications':
        return (
          <div className="bg-white rounded-3xl shadow-xl p-8 mt-8 border border-blue-100">
            <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">My Applications</h2>
            <p className="text-center text-gray-600">Application details and statuses will be displayed here.</p>
            {/* You can list applications or provide links to application forms */}
          </div>
        );
      default: // This will now effectively be the 'profile' section if no query param is present
        // Or handle unknown sections, perhaps redirect to profile or show a 404-like message for dashboard sections
        return (
          <div className="bg-white rounded-3xl shadow-xl p-8 mt-8 border border-blue-100">
            <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">My Profile</h2>
             <div className="text-center text-lg md:text-xl text-blue-700 font-semibold mb-4">
              {isLoading ? 'Loading email...' : (user?.email || 'Could not load email')}
            </div>
            <p className="text-center text-gray-600">Additional profile information and settings can be displayed here.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans" style={{ paddingLeft: '16rem' }}>
      <div className="w-full max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {renderSectionContent()}
      </div>
    </div>
  );
};

export default DashboardPage;
