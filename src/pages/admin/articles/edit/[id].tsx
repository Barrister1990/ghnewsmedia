import AdminLayout from '@/components/admin/AdminLayout';
import { AnimatedLoading } from '@/components/admin/AnimatedLoading';
import ArticlePreview from '@/components/admin/ArticlePreview';
import ContentAnalytics from '@/components/admin/ContentAnalytics';
import ImageUpload from '@/components/admin/ImageUpload';
import PublishingWorkflow from '@/components/admin/PublishingWorkflow';
import SEOManager from '@/components/admin/SEOManager';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Eye, EyeOff, Save } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

// Dynamically import TiptapEditor to prevent SSR issues
const TiptapEditor = dynamic(
  () => import('@/components/admin/TiptapEditor'),
  {
    ssr: false,
    loading: () => (
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="min-h-[400px] bg-gray-50 flex items-center justify-center">
          <div className="text-gray-500">Loading Tiptap Editor...</div>
        </div>
      </div>
    ),
  }
);

const articleSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  excerpt: z.string().min(1, 'Excerpt is required').max(500, 'Excerpt must be less than 500 characters'),
  content: z.string().min(1, 'Content is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens'),
  category_id: z.string().min(1, 'Category is required'),
  featured_image: z.string().optional(),
  featured_image_credit: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']),
  featured: z.boolean(),
  trending: z.boolean(),
  read_time: z.number().min(1, 'Read time must be at least 1 minute'),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  additional_keywords: z.array(z.string()).optional(),
  focus_keyword: z.string().optional()
});

type ArticleFormData = z.infer<typeof articleSchema>;

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
  additional_keywords: string[];
}

const EditArticle = () => {
  const router = useRouter();
  const { id } = router.query;
  const articleId = id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [seoData, setSeoData] = useState<SEOData>({
    metaTitle: '',
    metaDescription: '',
    keywords: [],
    focusKeyword: '',
    ogTitle: '',
    ogDescription: '',
    twitterTitle: '',
    twitterDescription: '',
    canonicalUrl: '',
    schema: {
      headline: '',
      description: '',
      keywords: ''
    },
    additional_keywords: []
  });
  const [activeTab, setActiveTab] = useState('content');
  const [previewMode, setPreviewMode] = useState(false);

  const form = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: '',
      excerpt: '',
      content: '',
      slug: '',
      category_id: '',
      featured_image: '',
      featured_image_credit: '',
      status: 'draft',
      featured: false,
      trending: false,
      read_time: 5,
      meta_title: '',
      meta_description: '',
      keywords: [],
      additional_keywords: [],
      focus_keyword: ''
    }
  });

  const featuredImageCredit = form.watch('featured_image_credit');

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
      const articleData = data as any;
      const transformedData = {
        ...articleData,
        excerpt: articleData.excerpt || '',
        featured_image: articleData.featured_image || '',
        featured_image_credit: articleData.featured_image_credit || '',
        meta_title: articleData.meta_title || '',
        meta_description: articleData.meta_description || '',
        keywords: articleData.keywords || [],
        additional_keywords: articleData.additional_keywords || [],
        focus_keyword: articleData.focus_keyword || ''
      };
      form.reset(transformedData);
      setSeoData({
        metaTitle: transformedData.meta_title,
        metaDescription: transformedData.meta_description,
        keywords: transformedData.keywords,
        focusKeyword: transformedData.focus_keyword,
        ogTitle: '',
        ogDescription: '',
        twitterTitle: '',
        twitterDescription: '',
        canonicalUrl: '',
        schema: {
          headline: '',
          description: '',
          keywords: ''
        },
        additional_keywords: transformedData.additional_keywords
      });
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

  const handleSEOChange = (newSEOData: SEOData) => {
    setSeoData(newSEOData);
    form.setValue('meta_title', newSEOData.metaTitle);
    form.setValue('meta_description', newSEOData.metaDescription);
    form.setValue('keywords', newSEOData.keywords);
    form.setValue('additional_keywords', newSEOData.additional_keywords);
    form.setValue('focus_keyword', newSEOData.focusKeyword);
  };

  const handleSchedulePublish = (date: string) => {
    toast.success(`Article scheduled for publication on ${new Date(date).toLocaleString()}`);
  };

  const handleSave = async (data: ArticleFormData) => {
    setSaving(true);

    try {
      const { error } = await supabase
        .from('articles')
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .eq('id', articleId);

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
    return (
      <AdminLayout>
        <AnimatedLoading />
      </AdminLayout>
    );
  }

  const currentCategory = categories.find(cat => cat.id === form.watch('category_id'));

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
            <Button onClick={form.handleSubmit(handleSave)} disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>

        {previewMode ? (
          <ArticlePreview
            title={form.getValues('title')}
            excerpt={form.getValues('excerpt')}
            content={form.getValues('content')}
            featuredImage={form.getValues('featured_image')}
            category={currentCategory}
            readTime={form.getValues('read_time')}
          />
        ) : (
          <Form {...form}>
            <form 
              onSubmit={form.handleSubmit(handleSave)} 
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
              onKeyDown={(e) => {
                // Prevent form submission on Enter key when editor might be focused
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                  e.preventDefault();
                }
              }}
            >
              {/* Main Content */}
              <div className="lg:col-span-2">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="seo">SEO</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    <TabsTrigger value="publish">Publish</TabsTrigger>
                  </TabsList>

                  <TabsContent value="content">
                    <Card>
                      <CardHeader>
                        <CardTitle>Article Content</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Title</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="excerpt"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Excerpt</FormLabel>
                              <FormControl>
                                <Textarea {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="content"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Content</FormLabel>
                              <FormControl>
                                <TiptapEditor content={field.value} onChange={field.onChange} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="seo">
                    <SEOManager
                      title={form.watch('title')}
                      excerpt={form.watch('excerpt')}
                      content={form.watch('content')}
                      slug={form.watch('slug')}
                      category={currentCategory?.name || ''}
                      seoData={seoData}
                      onSEOChange={handleSEOChange}
                    />
                  </TabsContent>

                  <TabsContent value="analytics">
                    <ContentAnalytics
                      content={form.watch('content')}
                      title={form.watch('title')}
                      category={currentCategory?.name || ''}
                    />
                  </TabsContent>

                  <TabsContent value="publish">
                    <PublishingWorkflow
                      status={form.watch('status')}
                      onStatusChange={(status) => form.setValue('status', status)}
                      onSchedulePublish={handleSchedulePublish}
                      seoScore={85} // Replace with actual score
                      contentScore={75} // Replace with actual score
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
                    <FormField
                      control={form.control}
                      name="category_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="draft">Draft</SelectItem>
                              <SelectItem value="published">Published</SelectItem>
                              <SelectItem value="archived">Archived</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="featured"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <FormLabel>Featured</FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="trending"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <FormLabel>Trending</FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Featured Image</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="featured_image"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <ImageUpload
                              value={field.value}
                              onChange={field.onChange}
                              credit={featuredImageCredit}
                              onCreditChange={(credit) => form.setValue('featured_image_credit', credit)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>
            </form>
          </Form>
        )}
      </div>
    </AdminLayout>
  );
};

export default EditArticle;
