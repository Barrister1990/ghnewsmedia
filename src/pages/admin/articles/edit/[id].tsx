
import AdminLayout from '@/components/admin/AdminLayout';
import ArticleEditor from '@/components/admin/ArticleEditor';
import ArticlePreview from '@/components/admin/ArticlePreview';
import ContentAnalytics from '@/components/admin/ContentAnalytics';
import ImageUpload from '@/components/admin/ImageUpload';
import PublishingWorkflow from '@/components/admin/PublishingWorkflow';
import SEOManager from '@/components/admin/SEOManager';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, BarChart, Eye, EyeOff, FileText, Save, Search, Send } from 'lucide-react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  featured_image?: string;
  category_id: string;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  trending: boolean;
  read_time: number;
}

interface Category {
  id: string;
  name: string;
  color: string;
}

interface SEOData {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  focusKeyword: string;
  ogTitle: string;
  ogDescription: string;
  twitterTitle: string;
  twitterDescription: string;
  canonicalUrl: string;
  schema: {
    headline: string;
    description: string;
    keywords: string;
  };
}

const EditArticle = () => {
const router = useRouter();
const { id } = router.query;

const articleId = id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [seoData, setSeoData] = useState<SEOData | null>(null);
  const [activeTab, setActiveTab] = useState('content');
  const [previewMode, setPreviewMode] = useState(false);
  
  const [article, setArticle] = useState<Article>({
    id: '',
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image: '',
    category_id: '',
    status: 'draft',
    featured: false,
    trending: false,
    read_time: 5
  });

  useEffect(() => {
    if (id) {
      fetchArticle();
    }
    fetchCategories();
  }, [id]);

  const fetchArticle = async () => {
    if (!id) return;
    
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', articleId)
        .single();

      if (error) throw error;
      setArticle(data);
    } catch (error) {
      console.error('Error fetching article:', error);
      toast.error('Failed to fetch article');
      router.push('/admin/articles');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, color')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  };

  const handleSEOChange = (newSEOData: SEOData) => {
    setSeoData(newSEOData);
  };

  const handleSchedulePublish = (date: string) => {
    toast.success(`Article scheduled for publication on ${new Date(date).toLocaleString()}`);
  };

  const handleSave = async () => {
    if (!article.title.trim() || !article.content.trim() || !article.category_id) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSaving(true);
    
    try {
      const slug = generateSlug(article.title);
      const readTime = calculateReadTime(article.content);
      
      const { error } = await supabase
        .from('articles')
        .update({
          title: article.title,
          slug,
          excerpt: article.excerpt,
          content: article.content,
          featured_image: article.featured_image,
          category_id: article.category_id,
          status: article.status,
          featured: article.featured,
          trending: article.trending,
          read_time: readTime,
          updated_at: new Date().toISOString()
        })
        .eq('id', article.id);

      if (error) throw error;
      
      toast.success('Article updated successfully');
      router.push('/admin/articles');
    } catch (error) {
      console.error('Error updating article:', error);
      toast.error('Failed to update article');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse">Loading article...</div>;
  }

  const currentCategory = categories.find(cat => cat.id === article.category_id);

  return (
    <AdminLayout>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => router.push('/admin/articles')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Articles
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Article</h1>
            <p className="text-gray-600">Update article content and settings</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => setPreviewMode(!previewMode)}
          >
            {previewMode ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {previewMode ? 'Edit' : 'Preview'}
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {previewMode ? (
        <ArticlePreview
          title={article.title}
          excerpt={article.excerpt || ''}
          content={article.content}
          featuredImage={article.featured_image}
          category={currentCategory}
          readTime={article.read_time}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="content" className="flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>Content</span>
                </TabsTrigger>
                <TabsTrigger value="seo" className="flex items-center space-x-2">
                  <Search className="w-4 h-4" />
                  <span>SEO</span>
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center space-x-2">
                  <BarChart className="w-4 h-4" />
                  <span>Analytics</span>
                </TabsTrigger>
                <TabsTrigger value="publish" className="flex items-center space-x-2">
                  <Send className="w-4 h-4" />
                  <span>Publish</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Article Content</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={article.title}
                        onChange={(e) => setArticle({ ...article, title: e.target.value })}
                        placeholder="Enter article title"
                        className="text-xl font-semibold"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="excerpt">Excerpt</Label>
                      <Input
                        id="excerpt"
                        value={article.excerpt || ''}
                        onChange={(e) => setArticle({ ...article, excerpt: e.target.value })}
                        placeholder="Brief description of the article"
                      />
                    </div>

                    <div>
                      <Label>Content</Label>
                      <ArticleEditor
                        content={article.content}
                        onChange={(content) => setArticle({ ...article, content })}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="seo">
                <SEOManager
                  title={article.title}
                  excerpt={article.excerpt || ''}
                  content={article.content}
                  slug={article.slug}
                  category={currentCategory?.name || ''}
                  onSEOChange={handleSEOChange}
                />
              </TabsContent>

              <TabsContent value="analytics">
                <ContentAnalytics
                  content={article.content}
                  title={article.title}
                  category={currentCategory?.name || ''}
                />
              </TabsContent>

              <TabsContent value="publish">
                <PublishingWorkflow
                  status={article.status}
                  onStatusChange={(status) => setArticle({ ...article, status })}
                  onSchedulePublish={handleSchedulePublish}
                  seoScore={seoData ? 85 : 0}
                  contentScore={article.content.split(' ').length > 300 ? 85 : 45}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Article Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Category *</Label>
                  <Select
                    value={article.category_id}
                    onValueChange={(value) => setArticle({ ...article, category_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center space-x-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: category.color }}
                            />
                            <span>{category.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Status</Label>
                  <Select
                    value={article.status}
                    onValueChange={(value: 'draft' | 'published' | 'archived') => 
                      setArticle({ ...article, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="featured">Featured Article</Label>
                  <Switch
                    id="featured"
                    checked={article.featured}
                    onCheckedChange={(checked) => setArticle({ ...article, featured: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="trending">Trending</Label>
                  <Switch
                    id="trending"
                    checked={article.trending}
                    onCheckedChange={(checked) => setArticle({ ...article, trending: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Featured Image</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  value={article.featured_image}
                  onChange={(url) => setArticle({ ...article, featured_image: url })}
                  placeholder="Upload or enter featured image URL"
                />
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full">
                  <Eye className="w-4 h-4 mr-2" />
                  View Live Article
                </Button>
                <Button variant="outline" className="w-full">
                  Duplicate Article
                </Button>
                <Button variant="destructive" className="w-full">
                  Delete Article
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
    </AdminLayout>
  );
};

export default EditArticle;
