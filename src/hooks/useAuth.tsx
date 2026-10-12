import { supabase } from '@/integrations/supabase/client';
import { AuthError, Session, User } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, name?: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  userRole: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ROLE_CACHE_KEY = 'gp-role';

const readCachedRole = (userId: string): string | null => {
  try {
    const raw = sessionStorage.getItem(ROLE_CACHE_KEY);
    if (!raw) return null;
    const cached = JSON.parse(raw) as { userId?: string; role?: string };
    return cached.userId === userId && cached.role ? cached.role : null;
  } catch {
    return null;
  }
};

const writeCachedRole = (userId: string, role: string | null) => {
  try {
    if (role) sessionStorage.setItem(ROLE_CACHE_KEY, JSON.stringify({ userId, role }));
    else sessionStorage.removeItem(ROLE_CACHE_KEY);
  } catch {
    /* storage unavailable */
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [roleUserId, setRoleUserId] = useState<string | null>(null);
  const roleRequest = useRef<string | null>(null);

  useEffect(() => {
    const resolveRole = async (userId: string) => {
      if (roleRequest.current === userId) return;
      roleRequest.current = userId;

      const cached = readCachedRole(userId);
      if (cached) {
        setUserRole(cached);
        setRoleUserId(userId);
      }

      let role = 'editor';
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', userId)
          .single();
        if (error) console.error('Error fetching user role:', error);
        role = data?.role || 'editor';
      } catch (error) {
        console.error('Error in fetchUserRole:', error);
      }

      if (roleRequest.current !== userId) return;
      writeCachedRole(userId, role);
      setUserRole(role);
      setRoleUserId(userId);
    };

    const applySession = (next: Session | null) => {
      setSession(next);
      setUser(next?.user ?? null);
      if (next?.user) {
        void resolveRole(next.user.id);
      } else {
        if (roleRequest.current) writeCachedRole(roleRequest.current, null);
        roleRequest.current = null;
        setUserRole(null);
        setRoleUserId(null);
      }
      setSessionLoading(false);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, next) => {
      applySession(next);
    });

    supabase.auth.getSession().then(({ data: { session: initial } }) => {
      applySession(initial);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loading = sessionLoading || (!!user && roleUserId !== user.id);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Successfully signed in!');
      }
      
      return { error };
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error('An unexpected error occurred');
      return { error: null };
    }
  };

  const signUp = async (email: string, password: string, name?: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: name ? { name } : undefined
        }
      });
      
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Check your email for the confirmation link!');
      }
      
      return { error };
    } catch (error) {
      console.error('Sign up error:', error);
      toast.error('An unexpected error occurred');
      return { error: null };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Successfully signed out!');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Error signing out');
    }
  };

  const isAdmin = userRole === 'admin' || userRole === 'editor';

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signIn,
      signUp,
      signOut,
      isAdmin,
      userRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};