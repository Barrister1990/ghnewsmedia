import { DashLogo } from '@/components/shell/DashLogo';
import { DashScreen } from '@/components/shell/DashShell';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, ArrowRight, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

const homeForRole = (role: string | null) =>
  role === 'admin' ? '/admin' : role === 'editor' ? '/cms' : '/';

const safeReturnUrl = (value: unknown, role: string | null): string | null => {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) return null;
  if (value.startsWith('/admin')) return role === 'admin' ? value : null;
  if (value.startsWith('/cms')) return role === 'editor' ? value : null;
  return null;
};

const AuthPage = () => {
  const { signIn, user, userRole, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || loading || !router.isReady) return;
    router.replace(safeReturnUrl(router.query.returnUrl, userRole) ?? homeForRole(userRole));
  }, [user, userRole, loading, router]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSigningIn(true);
    try {
      const { error: signInError } = await signIn(email.trim(), password);
      if (signInError) setError(signInError.message);
    } finally {
      setSigningIn(false);
    }
  };

  if (user) {
    return <DashScreen busy />;
  }

  return (
    <div className="gp-dash min-h-screen bg-white text-dash-ink">
      <Head>
        <title>Sign in · Ghana Point Newsroom</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <header className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" aria-label="Ghana Point homepage">
          <DashLogo className="h-7" />
        </Link>
        <Link
          href="/"
          className="inline-flex h-10 items-center gap-1.5 rounded-full border border-dash-ink px-4 text-sm font-bold transition-colors hover:bg-dash-ink hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to site
        </Link>
      </header>

      <main className="mx-auto grid max-w-7xl gap-12 px-5 pb-16 pt-6 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-center lg:gap-16 lg:pt-10">
        <section>
          <span className="inline-flex items-center gap-2 rounded-full bg-dash-mint px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-dash-teal-deep">
            <span className="h-2 w-2 rounded-full bg-dash-teal-dark" aria-hidden />
            Newsroom &amp; Admin
          </span>
          <h1 className="mt-5 text-[2.6rem] font-black leading-[1.02] sm:text-6xl">
            Publish the stories Ghana is talking about.
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-dash-muted">
            Sign in to write, edit and publish on Ghana Point. Admins land in the Admin dashboard, editors in the Newsroom.
          </p>

          <form
            onSubmit={handleSignIn}
            className="mt-8 max-w-lg rounded-3xl border border-dash-line bg-white p-6 shadow-[0_24px_60px_-30px_rgba(11,15,18,0.25)] sm:p-8"
          >
            <div className="space-y-5">
              <div>
                <label htmlFor="email" className="text-sm font-bold">
                  Email
                </label>
                <div className="relative mt-2">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-dash-muted" aria-hidden />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@ghanapoint.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    className="h-12 w-full rounded-full border border-input bg-white pl-11 pr-4 text-[15px] outline-none transition-shadow placeholder:text-dash-muted/70 focus:border-dash-teal-dark focus:ring-4 focus:ring-dash-teal/25"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="text-sm font-bold">
                  Password
                </label>
                <div className="relative mt-2">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-dash-muted" aria-hidden />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="h-12 w-full rounded-full border border-input bg-white pl-11 pr-12 text-[15px] outline-none transition-shadow placeholder:text-dash-muted/70 focus:border-dash-teal-dark focus:ring-4 focus:ring-dash-teal/25"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-dash-muted hover:bg-dash-mist hover:text-dash-ink"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error ? (
                <p role="alert" className="rounded-2xl bg-dash-rose px-4 py-3 text-sm font-medium text-red-700">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={signingIn || loading}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-dash-teal-dark text-[15px] font-bold text-white transition-colors hover:bg-dash-teal-deep disabled:opacity-60"
              >
                {signingIn ? 'Signing in…' : 'Sign in'}
                {!signingIn ? <ArrowRight className="h-4 w-4" aria-hidden /> : null}
              </button>
            </div>
            <p className="mt-5 text-center text-xs text-dash-muted">
              Need an account? Ask a Ghana Point administrator to invite you.
            </p>
          </form>
        </section>

        <section aria-hidden className="hidden lg:block">
          <div className="grid grid-cols-6 gap-4">
            <div className="col-span-4 row-span-2 rounded-3xl bg-dash-ink p-6 text-white">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold">Draft · Politics</span>
                <span className="rounded-full bg-dash-teal px-3 py-1 text-xs font-bold text-dash-ink">Ready</span>
              </div>
              <div className="mt-5 aspect-[16/9] rounded-2xl bg-gradient-to-br from-dash-teal via-[#4fd1c5] to-[#2b6cb0]" />
              <div className="mt-5 space-y-2.5">
                <div className="h-4 w-11/12 rounded-full bg-white/90" />
                <div className="h-4 w-8/12 rounded-full bg-white/90" />
                <div className="h-3 w-full rounded-full bg-white/20" />
                <div className="h-3 w-10/12 rounded-full bg-white/20" />
              </div>
            </div>
            <div className="col-span-2 flex flex-col justify-between rounded-3xl bg-dash-yellow p-5">
              <span className="text-xs font-bold uppercase tracking-wider">Featured image</span>
              <p className="text-3xl font-black leading-none">1200×675</p>
            </div>
            <div className="col-span-2 flex flex-col justify-between rounded-3xl bg-dash-lilac p-5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5b45c4]">Indexed</span>
              <div className="flex items-end gap-1.5">
                {[40, 65, 50, 85, 70, 100].map((h, i) => (
                  <span key={i} className="w-full rounded-t-md bg-[#7c66f0]" style={{ height: `${h * 0.6}px` }} />
                ))}
              </div>
            </div>
            <div className="col-span-3 rounded-3xl bg-dash-mint p-5">
              <span className="text-xs font-bold uppercase tracking-wider text-dash-teal-deep">Google News</span>
              <p className="mt-3 text-2xl font-black leading-tight">Sitemaps, schema &amp; WebSub, done for you.</p>
            </div>
            <div className="col-span-3 rounded-3xl bg-dash-peach p-5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#c2410c]">Workflow</span>
              <div className="mt-4 flex flex-wrap gap-2">
                {['Write', 'Review', 'Publish'].map((step, i) => (
                  <span key={step} className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm font-bold">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-dash-ink text-[10px] text-white">
                      {i + 1}
                    </span>
                    {step}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-dash-ink py-6 text-white/60">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <DashLogo tone="light" className="h-5" />
          <p>© {new Date().getFullYear()} Ghana Point. Newsroom access is for invited staff only.</p>
        </div>
      </footer>
    </div>
  );
};

export default AuthPage;
