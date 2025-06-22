import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

const AdminLink = () => {
  const auth = useAuth();
  
  // If no user or not admin, show login link
  if (!auth?.user || !auth?.isAdmin) {
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