import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import { Sparkles, FileText, AlertCircle } from 'lucide-react';
import { analyzeCreditReport } from '../services/authService'; // Import the analyzeCreditReport function
import { AxiosError } from 'axios'; // Import AxiosError for specific error handling
import CreditAnalysisResult from '../components/CreditAnalysisResult'; // Import the new component

const DashboardPage: React.FC = () => {
  const [creditReportText, setCreditReportText] = useState('');
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const { user, token } = useAuth(); // Get token from useAuth
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const queryParams = new URLSearchParams(location.search);
  const currentSection = queryParams.get('section') || 'profile'; // Default to 'home'

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setFileName(file.name);
    setError(null);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setCreditReportText(content);
    };
    reader.onerror = () => {
      setError('Failed to read the file. Please try again.');
    };
    reader.readAsText(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleAnalyzeReport = async () => {
    if (!creditReportText.trim()) {
      setError('Please upload your credit report or paste the text.');
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
            
            {!analysisResult ? (
              <div className="space-y-6">
                {/* Step 1: Upload Section */}
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                  <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                    <span className="bg-blue-700 text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2 text-sm">1</span>
                    Upload Your Credit Report
                  </h3>
                  
                  {/* Hidden file input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                    accept=".txt,.pdf,.doc,.docx"
                  />
                  
                  <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-blue-300 rounded-lg bg-white cursor-pointer hover:bg-blue-50 transition-colors" onClick={handleUploadClick}>
                    <FileText size={48} className="text-blue-500 mb-3" />
                    <p className="text-blue-700 font-medium mb-1">Click to upload your credit report</p>
                    <p className="text-sm text-gray-500">Accepts TXT, PDF, DOC, DOCX files</p>
                  </div>
                  
                  {fileName && (
                    <div className="mt-3 p-3 bg-blue-100 rounded-lg flex items-center">
                      <FileText size={20} className="text-blue-700 mr-2" />
                      <span className="text-blue-800 font-medium">{fileName}</span>
                    </div>
                  )}
                </div>
                
                {/* Step 2: Paste Section */}
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                    <span className="bg-gray-600 text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2 text-sm">2</span>
                    Or Paste Your Credit Report Text
                  </h3>
                  
                  <textarea
                    className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm"
                    placeholder="Paste your credit report text here..."
                    value={creditReportText}
                    onChange={(e) => setCreditReportText(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                
                {/* Step 3: Analyze Button */}
                <div className="pt-4">
                  <button
                    onClick={handleAnalyzeReport}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 border border-transparent text-lg font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all shadow-lg disabled:opacity-50"
                  >
                    <Sparkles size={24} className="mr-2" /> {isLoading ? 'Analyzing Your Report...' : 'Analyze My Credit Report'}
                  </button>
                  
                  <p className="text-center text-sm text-gray-500 mt-3">
                    Your report will be analyzed instantly using our advanced AI technology
                  </p>
                </div>
                
                {error && (
                  <div className="mt-4 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg flex items-start">
                    <AlertCircle size={20} className="mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Error</p>
                      <p className="text-sm">{error}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-blue-800">Your Credit Analysis</h3>
                  <button
                    onClick={() => {
                      setAnalysisResult(null);
                      setCreditReportText('');
                      setFileName(null);
                    }}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Start New Analysis
                  </button>
                </div>
                
                <CreditAnalysisResult analysisResult={analysisResult} />
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
            <p className="text-center text-gray-600 mb-4">
              This section displays all your funding and credit repair applications submitted through Acenstra.
            </p>
            <p className="text-center text-gray-600 mb-4">
              You can track the status of each application, view approval details, and monitor progress.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-center text-blue-700 font-medium">No applications submitted yet.</p>
              <p className="text-center text-blue-600 text-sm mt-2">Your application details and statuses will appear here once you submit your first application.</p>
            </div>
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
