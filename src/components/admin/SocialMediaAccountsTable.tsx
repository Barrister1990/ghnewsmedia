
import React, { useState } from 'react';
import { Edit, Trash2, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import EditAccountDialog from './EditAccountDialog';

interface SocialMediaAccount {
  id: string;
  platform: string;
  handle: string;
  followers_count: number;
}

interface SocialMediaAccountsTableProps {
  accounts: SocialMediaAccount[];
  onRefresh: () => void;
}

const SocialMediaAccountsTable = ({ accounts, onRefresh }: SocialMediaAccountsTableProps) => {
  const [editingAccount, setEditingAccount] = useState<SocialMediaAccount | null>(null);

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook': return Facebook;
      case 'twitter': return Twitter;
      case 'instagram': return Instagram;
      case 'youtube': return Youtube;
      default: return Twitter;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('social_media_accounts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Account deleted successfully');
      onRefresh();
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Failed to delete account');
    }
  };

  if (accounts.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-gray-500">No social media accounts found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Social Media Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Platform</TableHead>
                <TableHead>Handle</TableHead>
                <TableHead>Followers</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.map((account) => {
                const Icon = getPlatformIcon(account.platform);
                return (
                  <TableRow key={account.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Icon className="w-4 h-4" />
                        <span>{account.platform}</span>
                      </div>
                    </TableCell>
                    <TableCell>{account.handle}</TableCell>
                    <TableCell>{account.followers_count.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingAccount(account)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Account</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this social media account? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(account.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <EditAccountDialog
        account={editingAccount}
        open={!!editingAccount}
        onOpenChange={(open) => !open && setEditingAccount(null)}
        onSuccess={() => {
          setEditingAccount(null);
          onRefresh();
        }}
      />
    </>
  );
};

export default SocialMediaAccountsTable;
