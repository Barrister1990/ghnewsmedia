
import AddAccountDialog from '@/components/admin/AddAccountDialog';
import AddPostDialog from '@/components/admin/AddPostDialog';
import AdminLayout from '@/components/admin/AdminLayout';
import { AnimatedLoading } from '@/components/admin/AnimatedLoading';
import { ADMIN_PANEL_CARD, AdminPageHeader } from '@/components/admin/AdminPageHeader';
import SocialMediaAccountsTable from '@/components/admin/SocialMediaAccountsTable';
import SocialMediaPostsTable from '@/components/admin/SocialMediaPostsTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSocialMediaData } from '@/hooks/useSocialMediaData';
import { cn } from '@/lib/utils';
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
        <div className="space-y-8 pb-4">
          <AdminPageHeader
            title="Social media"
            description="Accounts and scheduled or published posts connected to your channels."
          />
          <Card className={cn(ADMIN_PANEL_CARD)}>
            <CardContent className="p-8">
              <div className="text-center">
                <p className="mb-4 text-rose-700">Could not load social data.</p>
                <Button onClick={refetch}>Try again</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
    <div className="space-y-8 pb-4">
      <AdminPageHeader
        title="Social media"
        description="Track follower snapshots and manage linked accounts and posts."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {accounts.map((account) => (
          <Card key={account.id} className={cn(ADMIN_PANEL_CARD)}>
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
        <TabsList className="inline-flex h-auto gap-1 rounded-2xl border border-stone-200 bg-stone-50/90 p-1">
          <TabsTrigger value="accounts" className="rounded-xl px-4 py-2">
            Accounts
          </TabsTrigger>
          <TabsTrigger value="posts" className="rounded-xl px-4 py-2">
            Posts
          </TabsTrigger>
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
