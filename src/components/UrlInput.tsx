import React, { useState } from 'react';
import { Scan, Shield, Zap, BarChart3, Eye } from 'lucide-react';

interface UrlInputProps {
  onStartScan: (url: string) => void;
}

const UrlInput: React.FC<UrlInputProps> = ({ onStartScan }) => {
  const [url, setUrl] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);

  const validateUrl = (input: string): boolean => {
    try {
      const urlPattern = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
      return urlPattern.test(input);
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateUrl(url)) {
      setIsValid(false);
      return;
    }
    
    if (!consentChecked) {
      alert('Please confirm that you have permission to scan this website.');
      return;
    }
    
    setIsLoading(true);
    try {
      await onStartScan(url);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    setIsValid(validateUrl(newUrl) || newUrl === '');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-100 dark:from-secondary-900 dark:to-secondary-800 p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-4">
            <Scan className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
            Website AI Scanner
          </h1>
          <p className="text-lg text-secondary-600 dark:text-secondary-400 max-w-2xl mx-auto">
            Advanced AI-powered website analysis with comprehensive scanning, 
            SEO audit, accessibility checks, and performance insights
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="card p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg mb-4">
              <Zap className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="font-semibold text-secondary-900 dark:text-secondary-100 mb-2">Lightning Fast</h3>
            <p className="text-sm text-secondary-600 dark:text-secondary-400">
              Optimized scanning with concurrent processing and intelligent caching
            </p>
          </div>
          
          <div className="card p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg mb-4">
              <Eye className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="font-semibold text-secondary-900 dark:text-secondary-100 mb-2">AI Analysis</h3>
            <p className="text-sm text-secondary-600 dark:text-secondary-400">
              Advanced AI insights for SEO, accessibility, and performance optimization
            </p>
          </div>
          
          <div className="card p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg mb-4">
              <BarChart3 className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="font-semibold text-secondary-900 dark:text-secondary-100 mb-2">Detailed Reports</h3>
            <p className="text-sm text-secondary-600 dark:text-secondary-400">
              Comprehensive reports with actionable recommendations and export options
            </p>
          </div>
          
          <div className="card p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg mb-4">
              <Shield className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="font-semibold text-secondary-900 dark:text-secondary-100 mb-2">Privacy First</h3>
            <p className="text-sm text-secondary-600 dark:text-secondary-400">
              No data storage without consent. Your scans remain private and secure
            </p>
          </div>
        </div>

        {/* Input Form */}
        <div className="card p-8 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-6 text-center">
            Start Your Website Analysis
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Website URL
              </label>
              <div className="relative">
                <input
                  type="url"
                  id="url"
                  value={url}
                  onChange={handleUrlChange}
                  placeholder="https://example.com"
                  className={`input-field ${!isValid ? 'border-red-500' : ''}`}
                  required
                />
                {!isValid && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    Please enter a valid URL (e.g., https://example.com)
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="consent"
                checked={consentChecked}
                onChange={(e) => setConsentChecked(e.target.checked)}
                className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                required
              />
              <label htmlFor="consent" className="text-sm text-secondary-600 dark:text-secondary-400">
                I confirm that I have permission to scan this website and understand that the analysis will be performed according to the website's robots.txt policies.
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading || !url || !isValid || !consentChecked}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Starting Scan...</span>
                </>
              ) : (
                <>
                  <Scan className="w-5 h-5" />
                  <span>Start Scan</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-secondary-500 dark:text-secondary-400">
          <p>Built with modern web technologies • Respects robots.txt • Privacy-focused</p>
        </div>
      </div>
    </div>
  );
};

export default UrlInput;