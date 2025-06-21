
import React, { useState } from 'react';
import { Mail, Check, X } from 'lucide-react';

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (email.includes('@')) {
      setStatus('success');
      setMessage('Successfully subscribed! Check your email for confirmation.');
      setEmail('');
    } else {
      setStatus('error');
      setMessage('Please enter a valid email address.');
    }

    setTimeout(() => {
      setStatus('idle');
      setMessage('');
    }, 3000);
  };

  return (
    <div className="bg-gradient-to-r from-primary to-accent text-white rounded-xl p-6 shadow-lg">
      <div className="text-center mb-4">
        <div className="flex justify-center mb-3">
          <div className="bg-white bg-opacity-20 p-3 rounded-full">
            <Mail className="w-6 h-6" />
          </div>
        </div>
        <h3 className="text-xl font-bold mb-2">Stay Informed</h3>
        <p className="text-white/90 text-sm">
          Get breaking news and exclusive stories delivered to your inbox daily
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
            disabled={status === 'loading'}
          />
          {status === 'success' && (
            <Check className="absolute right-3 top-3.5 w-5 h-5 text-green-500" />
          )}
          {status === 'error' && (
            <X className="absolute right-3 top-3.5 w-5 h-5 text-red-500" />
          )}
        </div>
        
        <button
          type="submit"
          disabled={status === 'loading' || !email}
          className="w-full bg-white text-primary font-medium py-3 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? 'Subscribing...' : 'Subscribe Now'}
        </button>
      </form>

      {message && (
        <div className={`mt-3 text-sm text-center ${
          status === 'success' ? 'text-green-200' : 'text-red-200'
        }`}>
          {message}
        </div>
      )}

      <div className="mt-4 text-center text-xs text-white/70">
        Join 50,000+ readers • Unsubscribe anytime • No spam, ever
      </div>
    </div>
  );
};

export default NewsletterSignup;
