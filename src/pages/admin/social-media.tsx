
import AddAccountDialog from '@/components/admin/AddAccountDialog';
import AddPostDialog from '@/components/admin/AddPostDialog';
import AdminLayout from '@/components/admin/AdminLayout';
import { AnimatedLoading } from '@/components/admin/AnimatedLoading';
import SocialMediaAccountsTable from '@/components/admin/SocialMediaAccountsTable';
import SocialMediaPostsTable from '@/components/admin/SocialMediaPostsTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSocialMediaData } from '@/hooks/useSocialMediaData';
import { Plus } from 'lucide-react';
import { useState } from 'react';

const SocialMediaManagement = () => {
  const { accounts, posts, loading, error, refetch } = useSocialMediaData();
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [showAddPost, setShowAddPost] = useState(false);

  if (loading) {
    return (
        <AdminLayout>
      <AnimatedLoading />
      </AdminLayout>
    );
  }

  if (error) {
    return (
        <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Social Media Management</h1>
          <p className="text-gray-600 text-sm lg:text-base">Manage your social media accounts and posts</p>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-red-600 mb-4">Failed to load social media data</p>
              <Button onClick={refetch}>Try Again</Button>
            </div>
          </CardContent>
        </Card>
      </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Social Media Management</h1>
          <p className="text-gray-600 text-sm lg:text-base">Manage your social media accounts and posts</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {accounts.map((account) => (
          <Card key={account.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{account.platform}</CardTitle>
              <CardDescription className="text-xs">{account.handle}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{account.followers_count.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">followers</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="accounts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
          <TabsTrigger value="posts">Posts</TabsTrigger>
        </TabsList>

        <TabsContent value="accounts" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Social Media Accounts</h2>
            <Button onClick={() => setShowAddAccount(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Account
            </Button>
          </div>
          <SocialMediaAccountsTable accounts={accounts} onRefresh={refetch} />
        </TabsContent>

        <TabsContent value="posts" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Social Media Posts</h2>
            <Button onClick={() => setShowAddPost(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Post
            </Button>
          </div>
          <SocialMediaPostsTable posts={posts} accounts={accounts} onRefresh={refetch} />
        </TabsContent>
      </Tabs>

      <AddAccountDialog 
        open={showAddAccount} 
        onOpenChange={setShowAddAccount}
        onSuccess={() => {
          setShowAddAccount(false);
          refetch();
        }}
      />

      <AddPostDialog 
        open={showAddPost} 
        onOpenChange={setShowAddPost}
        accounts={accounts}
        onSuccess={() => {
          setShowAddPost(false);
          refetch();
        }}
      />
    </div>
    </AdminLayout>
  );
};

export default SocialMediaManagement;
