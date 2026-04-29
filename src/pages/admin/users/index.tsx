
import AdminLayout from '@/components/admin/AdminLayout';
import { AnimatedLoading } from '@/components/admin/AnimatedLoading';
import { ADMIN_PANEL_CARD, AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { UserPen, UserPlus, UserRound } from 'lucide-react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
interface UserProfile {
  id: string;
  name: string;
  bio?: string | null;
  avatar?: string | null; // Changed from string | undefined to string | null
  title?: string | null;  // Also changed this to match database schema
  created_at: string;
  user_roles?: {
    role: 'admin' | 'editor' | 'moderator' | 'user';
  }[];
}

const UsersManagement = () => {
  const router = useRouter();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // First get all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Then get all user roles
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Combine the data manually
      const usersWithRoles = profiles?.map(profile => ({
        ...profile,
        user_roles: userRoles?.filter(role => role.user_id === profile.id) || []
      })) || [];

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: 'admin' | 'editor' | 'moderator' | 'user') => {
    try {
      // First, remove existing role
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      // Then, add new role
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: newRole
        });

      if (error) throw error;
      toast.success('User role updated successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  };

  const getUserRole = (user: UserProfile): 'admin' | 'editor' | 'moderator' | 'user' => {
    return user.user_roles?.[0]?.role || 'user';
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-rose-100 text-rose-900 border-rose-200/80';
      case 'editor':
        return 'bg-sky-100 text-sky-900 border-sky-200/80';
      case 'moderator':
        return 'bg-violet-100 text-violet-900 border-violet-200/80';
      case 'user':
        return 'bg-stone-100 text-stone-800 border-stone-200/80';
      default:
        return 'bg-stone-100 text-stone-800 border-stone-200/80';
    }
  };

  if (loading) {
    return (
        <AdminLayout>
      <AnimatedLoading />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
    <div className="space-y-8 pb-4">
      <AdminPageHeader
        title="Users"
        description="Manage accounts, roles, and profile details for people who can access the site or CMS."
        actions={
          <Button
            onClick={() => router.push('/admin/users/create')}
            className="w-full gap-2 sm:w-auto"
          >
            <UserPlus className="h-4 w-4" />
            Add user
          </Button>
        }
      />

      <Card className={cn(ADMIN_PANEL_CARD)}>
        <CardHeader>
          <CardTitle className="text-lg">Directory ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                         <AvatarImage src={user.avatar ?? undefined} />
                        <AvatarFallback className="bg-muted">
                          <UserRound className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        {user.bio && (
                          <p className="text-sm text-gray-500 truncate max-w-md">
                            {user.bio}
                          </p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.title || 'No title'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn('border font-medium capitalize', getRoleColor(getUserRole(user)))}>
                      {getUserRole(user)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2 flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="shrink-0"
                        onClick={() => router.push(`/admin/users/${user.id}`)}
                      >
                        <UserPen className="h-4 w-4 mr-1" />
                        Details
                      </Button>
                      <Select
                        value={getUserRole(user)}
                        onValueChange={(newRole: 'admin' | 'editor' | 'moderator' | 'user') => handleRoleChange(user.id, newRole)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="moderator">Moderator</SelectItem>
                          <SelectItem value="editor">Editor</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
    </AdminLayout>
  );
};

export default UsersManagement;
