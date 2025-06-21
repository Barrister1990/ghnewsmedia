
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

const AdminLink = () => {
  // Add error handling for when component is used outside AuthProvider
  let authData;
  try {
    authData = useAuth();
  } catch (error) {
    // If useAuth fails (not within AuthProvider), show login link
    return (
      <Link href="/auth">
        <Button variant="outline" size="sm">
          Admin Login
        </Button>
      </Link>
    );
  }

  const { isAdmin, user } = authData;

  if (!user || !isAdmin) {
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
