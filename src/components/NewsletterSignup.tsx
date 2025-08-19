
import { AlertCircle, Bell, CheckCircle, Mail, Send, Shield, Users } from 'lucide-react';
import React, { useState } from 'react';

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsSubscribed(true);
      setEmail('');
      
      // Reset success state after 5 seconds
      setTimeout(() => setIsSubscribed(false), 5000);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border border-green-200 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-green-800 mb-2">Welcome to GhNewsMedia!</h3>
        <p className="text-green-700 mb-4">
          You've successfully subscribed to our newsletter. Stay tuned for the latest news and updates!
        </p>
        <div className="flex items-center justify-center space-x-2 text-sm text-green-600">
          <Bell className="w-4 h-4" />
          <span>You'll receive our next update soon</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 rounded-2xl overflow-hidden shadow-2xl">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
      
      <div className="relative z-10 p-6 sm:p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Stay Informed
          </h3>
          <p className="text-blue-100 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
            Get the latest news, breaking updates, and exclusive stories delivered directly to your inbox
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center space-x-3 text-center sm:text-left">
            <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Bell className="w-4 h-4 text-red-400" />
            </div>
            <div>
              <p className="text-white text-sm font-medium">Breaking News</p>
              <p className="text-blue-200 text-xs">First to know</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 text-center sm:text-left">
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Users className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <p className="text-white text-sm font-medium">Exclusive Content</p>
              <p className="text-blue-200 text-xs">Behind the scenes</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 text-center sm:text-left">
            <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4 text-green-400" />
            </div>
            <div>
              <p className="text-white text-sm font-medium">Privacy First</p>
              <p className="text-blue-200 text-xs">Your data is safe</p>
            </div>
          </div>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full px-4 py-4 pl-12 bg-white/10 text-white placeholder-blue-200 rounded-xl border border-white/20 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all duration-200 text-base"
              disabled={isLoading}
            />
            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300" />
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center space-x-2 text-red-300 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-6 py-4 bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Subscribing...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Subscribe Now</span>
              </>
            )}
          </button>
        </form>

        {/* Trust Indicators */}
        <div className="mt-6 text-center">
          <p className="text-blue-200 text-xs">
            🔒 We respect your privacy. Unsubscribe at any time.
          </p>
          <p className="text-blue-200 text-xs mt-1">
            📧 No spam, just quality news content
          </p>
        </div>

        {/* Stats */}
        <div className="mt-6 pt-6 border-t border-white/20">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-white">10K+</p>
              <p className="text-blue-200 text-xs">Subscribers</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">99%</p>
              <p className="text-blue-200 text-xs">Satisfaction</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterSignup;
