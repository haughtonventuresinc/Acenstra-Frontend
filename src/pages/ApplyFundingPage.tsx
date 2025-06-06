import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface FundingFormData {
  name: string;
  email: string;
  phone: string;
  businessName: string;
  fundingAmount: string;
  hasBusinessEntity: string;
  creditScore: string;
  creditReport: File | null;
}

const initialForm: FundingFormData = {
  name: '',
  email: '',
  phone: '',
  businessName: '',
  fundingAmount: '',
  hasBusinessEntity: '',
  creditScore: '',
  creditReport: null,
};

const ApplyFundingPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState<FundingFormData>({
    ...initialForm,
    ...(user ? { email: user.email } : {}),
  });
  const [step, setStep] = useState<'form' | 'prompt' | 'thanks'>('form');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const { name, value } = target;
    const files = (target as HTMLInputElement).files;
    setForm(f => ({
      ...f,
      [name]: files && files.length > 0 ? files[0] : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!isAuthenticated) {
      setStep('prompt');
      return;
    }
    await submitApplication();
  };

  const submitApplication = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          // FormData.append expects string or Blob (File)
          data.append(key, value as string | Blob);
        }
      });
      const res = await fetch('/api/apply-funding', {
        method: 'POST',
        body: data,
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to submit application');
      setStep('thanks');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Submission failed');
      } else {
        setError('Submission failed');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Prompt for login/signup or guest
  const handlePrompt = (action: 'login' | 'signup' | 'guest') => {
    if (action === 'login') {
      navigate('/login', { state: { from: '/apply-funding' } });
    } else if (action === 'signup') {
      navigate('/register', { state: { from: '/apply-funding' } });
    } else {
      submitApplication();
    }
  };

  if (step === 'thanks') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 font-sans relative overflow-hidden pt-24 sm:pt-28 px-2">
        <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-10 max-w-lg w-full text-center border border-blue-100">
          <h2 className="text-2xl font-bold mb-4 text-blue-800">Thank you for applying!</h2>
          <p className="mb-4">Your funding application has been received. We'll review it and contact you soon.</p>
          <button className="mt-4 px-6 py-2 rounded bg-blue-600 text-white font-semibold" onClick={() => navigate('/')}>Return Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 font-sans px-2 pt-28 pb-8 overflow-auto">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
      <div className="relative z-10 bg-white/90 rounded-3xl shadow-2xl p-0 max-w-2xl w-full border border-blue-100 flex flex-col justify-center">
        {/* Gradient header */}
        <div className="rounded-t-3xl bg-gradient-to-r from-blue-600 to-blue-800 py-8 px-8 text-center shadow-xl">
          <h1 className="text-4xl font-extrabold text-white tracking-widest drop-shadow-lg mb-1">APPLY FOR FUNDING</h1>
          <p className="text-blue-100 text-lg font-medium">Business & Personal Funding Application</p>
        </div>
        <div className="px-3 py-6 sm:px-12 sm:py-10">
        {step === 'prompt' ? (
          <div className="text-center">
            <p className="mb-6 text-blue-700 font-semibold">Create an account or log in to track your application and get updates.</p>
            <div className="flex flex-col gap-3">
              <button onClick={() => handlePrompt('signup')} className="px-6 py-2 rounded-lg bg-blue-800 text-white font-semibold shadow hover:bg-blue-900 transition">Sign Up</button>
              <button onClick={() => handlePrompt('login')} className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition">Log In</button>
              <button onClick={() => handlePrompt('guest')} className="px-6 py-2 rounded-lg border border-blue-600 text-blue-800 font-semibold shadow hover:bg-blue-50 transition">Submit as Guest</button>
            </div>
            <button className="mt-6 text-sm text-blue-600 underline" onClick={() => setStep('form')}>Back to Form</button>
          </div>
        ) : (
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
          {/* Left column (first half of fields) */}
          <div className="flex flex-col gap-5 md:pr-6">
            <div>
              <label className="block text-sm font-semibold text-blue-900 mb-1">Name</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5Zm0 2c-3.314 0-10 1.657-10 5v3h20v-3c0-3.343-6.686-5-10-5Z"/></svg>
                </span>
                <input type="text" name="name" value={form.name} onChange={handleChange} className="pl-10 pr-4 py-3 block w-full rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition shadow-sm bg-blue-50 text-blue-900 placeholder-blue-400" placeholder="Your full name" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-900 mb-1">Email</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M2 6l10 7 10-7"/><rect width="20" height="14" x="2" y="6" stroke="currentColor" strokeWidth="2" rx="2"/></svg>
                </span>
                <input type="email" name="email" value={form.email} onChange={handleChange} className="pl-10 pr-4 py-3 block w-full rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition shadow-sm bg-blue-50 text-blue-900 placeholder-blue-400" placeholder="you@email.com" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-900 mb-1">Phone</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M22 16.92V19a2 2 0 0 1-2.18 2A19.72 19.72 0 0 1 3 5.18 2 2 0 0 1 5 3h2.09a2 2 0 0 1 2 1.72c.13.81.35 1.6.66 2.36a2 2 0 0 1-.45 2.11L8.09 10.91a16 16 0 0 0 6.01 6.01l1.72-1.72a2 2 0 0 1 2.11-.45c.76.31 1.55.53 2.36.66A2 2 0 0 1 22 16.92Z"/></svg>
                </span>
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} className="pl-10 pr-4 py-3 block w-full rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition shadow-sm bg-blue-50 text-blue-900 placeholder-blue-400" placeholder="(555) 555-5555" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-900 mb-1">Business Name</label>
              <input type="text" name="businessName" value={form.businessName} onChange={handleChange} className="py-3 px-4 block w-full rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition shadow-sm bg-blue-50 text-blue-900 placeholder-blue-400" placeholder="Business (optional)" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-900 mb-1">Funding Amount Needed</label>
              <input type="text" name="fundingAmount" value={form.fundingAmount} onChange={handleChange} className="py-3 px-4 block w-full rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition shadow-sm bg-blue-50 text-blue-900 placeholder-blue-400" placeholder="$10,000" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-900 mb-1">Do you have a business entity?</label>
              <select name="hasBusinessEntity" value={form.hasBusinessEntity} onChange={handleChange} className="py-3 px-4 block w-full rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition shadow-sm bg-blue-50 text-blue-900" required>
                <option value="">Select...</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-900 mb-1">Credit Score Range</label>
              <select name="creditScore" value={form.creditScore} onChange={handleChange} className="py-3 px-4 block w-full rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition shadow-sm bg-blue-50 text-blue-900" required>
                <option value="">Select...</option>
                <option value="below600">Below 600</option>
                <option value="600-699">600-699</option>
                <option value="700-749">700-749</option>
                <option value="750plus">750+</option>
              </select>
            </div>
          </div>
          {/* Right column (second half of fields) */}
          <div className="flex flex-col gap-5 md:pl-6">
            <div>
              <label className="block text-sm font-semibold text-blue-900 mb-1">Upload Credit Report</label>
              <input type="file" name="creditReport" accept=".pdf,.jpg,.jpeg,.png" onChange={handleChange} className="py-3 px-4 block w-full rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition shadow-sm bg-blue-50 text-blue-900 file:bg-blue-100 file:border-none file:rounded file:px-4 file:py-2 file:text-blue-800 file:font-semibold" required />
            </div>
            <div className="flex-1 flex flex-col justify-end">
              {error && <div className="text-red-600 text-sm font-semibold text-center mt-3">{error}</div>}
              <button type="submit" className="w-full py-3 px-4 rounded-xl text-white text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 focus:ring-2 focus:ring-blue-600 transition shadow-lg mt-2 flex items-center justify-center gap-2" disabled={submitting}>
                {submitting && <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>}
                {submitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </div>
        </form>
        )}
        </div>
      </div>
    </div>
  );
};

export default ApplyFundingPage;
