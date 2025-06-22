'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { ArrowRight, CheckCircle, Mail, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const EmailVerificationPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState<'success' | 'error' | 'pending'>('pending');

  useEffect(() => {
    const handleEmailVerification = async () => {
      const token = searchParams.get('token');
      const type = searchParams.get('type');
      
      if (token && type === 'signup') {
        try {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'signup'
          });

          if (error) {
            console.error('Verification error:', error);
            setVerificationStatus('error');
            toast.error('Email verification failed. Please try again.');
          } else {
            setVerificationStatus('success');
            toast.success('Email verified successfully!');
          }
        } catch (error) {
          console.error('Verification error:', error);
          setVerificationStatus('error');
        }
      } else {
        // If no token, assume they're coming here after successful signup
        setVerificationStatus('success');
      }
      
      setIsVerifying(false);
    };

    handleEmailVerification();
  }, [searchParams]);

  const handleGetStarted = () => {
    router.push('/admin/articles');
  };

  const handleGoHome = () => {
    router.push('/');
  };

  const handleTryAgain = () => {
    router.push('/auth');
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying your email...</p>
        </div>
      </div>
    );
  }

  if (verificationStatus === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Verification Failed</h1>
            <p className="text-gray-600">
              We couldn&apos;t verify your email. Please check the link or try signing up again.
            </p>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <Button onClick={handleGoHome} className="w-full">
                Go to Homepage
              </Button>
              <Button onClick={handleTryAgain} variant="outline" className="w-full">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-2xl border-0 overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-blue-600 h-2"></div>
        
        <CardHeader className="text-center pb-6 pt-8">
          <div className="relative mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-scale-in">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <div className="absolute -top-1 -right-1">
              <Sparkles className="h-6 w-6 text-yellow-500 animate-pulse" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to the Team! 🎉
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Your email has been successfully verified
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-800 font-medium">
              You&apos;re all set to start creating amazing content!
            </p>
          </div>
        </CardHeader>

        <CardContent className="px-8 pb-8">
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <ArrowRight className="h-5 w-5 mr-2 text-blue-600" />
                What&apos;s Next?
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Access your admin dashboard
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Create and publish your first article
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Manage categories and tags
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Monitor your content performance
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={handleGetStarted} 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Start Creating Content
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button 
                onClick={handleGoHome} 
                variant="outline" 
                className="w-full border-gray-300 hover:bg-gray-50"
              >
                Explore the Site First
              </Button>
            </div>

            <div className="text-center pt-4">
              <p className="text-sm text-gray-500">
                Need help getting started? Check out our{' '}
                <Link href="/about" className="text-blue-600 hover:underline">
                  documentation
                </Link>{' '}
                or{' '}
                <Link href="/contact" className="text-blue-600 hover:underline">
                  contact support
                </Link>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailVerificationPage;