import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

const AdminLink = () => {
  // Always call the hook, but handle the error in the component logic
  let authData = null;
  let authError = false;
  
  try {
    authData = useAuth();
  } catch {
    // If useAuth fails (not within AuthProvider), set error flag
    authError = true;
  }

  // If there's an auth error or no user/admin access, show login link
  if (authError || !authData?.user || !authData?.isAdmin) {
    return (
      <Link href="/auth">
        <Button variant="outline" size="sm">
          Admin Login
        </Button>
      </Link>
    );
  }

  return (
    <Link href="/admin">
      <Button variant="outline" size="sm">
        Admin Dashboard
      </Button>
    </Link>
  );
};

export default AdminLink;