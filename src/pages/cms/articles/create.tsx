import ArticleEditor from '@/components/admin/ArticleEditor';
import ArticlePreview from '@/components/admin/ArticlePreview';
import ContentAnalytics from '@/components/admin/ContentAnalytics';
import ImageUpload from '@/components/admin/ImageUpload';
import PublishingWorkflow from '@/components/admin/PublishingWorkflow';
import SEOManager from '@/components/admin/SEOManager';
import TagSelector from '@/components/admin/TagSelector';
import CMSLayout from '@/components/cms/CMSLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { BarChart, Eye, EyeOff, FileText, Save, Search, Send } from 'lucide-react';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const articleSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  excerpt: z.string().min(1, 'Excerpt is required').max(500, 'Excerpt must be less than 500 characters'),
  content: z.string().min(1, 'Content is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens'),
  category_id: z.string().min(1, 'Category is required'),
  featured_image: z.string().optional(),
  featured: z.boolean(),
  trending: z.boolean(),
  read_time: z.number().min(1, 'Read time must be at least 1 minute')
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
}

const CMSCreateArticle = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [seoData, setSeoData] = useState<SEOData | null>(null);
  const [activeTab, setActiveTab] = useState('content');

  const form = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: '',
      excerpt: '',
      content: '',
      slug: '',
      category_id: '',
      featured_image: '',
      featured: false,
      trending: false,
      read_time: 5
    }
  });

  React.useEffect(() => {
    fetchCategories();
  }, []);

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
      toast.error('Failed to fetch categories');
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (title: string) => {
    form.setValue('title', title);
    if (!form.getValues('slug')) {
      form.setValue('slug', generateSlug(title));
    }
  };

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  };

  const handleContentChange = (content: string) => {
    form.setValue('content', content);
    const readTime = calculateReadTime(content);
    form.setValue('read_time', readTime);
  };

  const handleSEOChange = (newSEOData: SEOData) => {
    setSeoData(newSEOData);
  };

  const handleSchedulePublish = (date: string) => {
    toast.info(`Article will be saved as draft (editors cannot schedule publishing)`);
  };

  const onSubmit = async (data: ArticleFormData) => {
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Force status to be 'draft' for editors
      const articleData = {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt || null,
        content: data.content,
        featured_image: data.featured_image || null,
        author_id: user.id,
        category_id: data.category_id,
        status: 'draft' as const, // Properly typed as const
        featured: data.featured,
        trending: data.trending,
        read_time: data.read_time,
        published_at: null
      };

      const { data: article, error } = await supabase
        .from('articles')
        .insert(articleData)
        .select()
        .single();

      if (error) throw error;

      if (selectedTags.length > 0 && article) {
        const tagInserts = selectedTags.map(tagId => ({
          article_id: article.id,
          tag_id: tagId
        }));

        const { error: tagError } = await supabase
          .from('article_tags')
          .insert(tagInserts);

        if (tagError) console.error('Error adding tags:', tagError);
      }

      toast.success('Article saved as draft successfully!');
      router.push('/cms/articles');
    } catch (error) {
      console.error('Error creating article:', error);
      toast.error('Failed to save article');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentCategory = categories.find(cat => cat.id === form.getValues('category_id'));
  const formValues = form.getValues();

  return (
    <CMSLayout>
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Article</h1>
          <p className="text-gray-600">Write and publish a professional news article</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => setPreviewMode(!previewMode)}
            className="flex items-center space-x-2"
          >
            {previewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>{previewMode ? 'Edit' : 'Preview'}</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push('/cms/articles')}
          >
            Cancel
          </Button>
        </div>
      </div>

      {/* Editor Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800 text-sm">
          <strong>Note:</strong> As an editor, your articles will be saved as drafts. 
          They need to be published by an administrator.
        </p>
      </div>

      {previewMode ? (
        <ArticlePreview
          title={formValues.title}
          excerpt={formValues.excerpt}
          content={formValues.content}
          featuredImage={formValues.featured_image}
          category={currentCategory}
          readTime={formValues.read_time}
        />
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                        <CardDescription>Write your article content with support for images and video embeds</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Title</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter article title..."
                                  {...field}
                                  onChange={(e) => {
                                    field.onChange(e);
                                    handleTitleChange(e.target.value);
                                  }}
                                  className="text-xl font-semibold"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="slug"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>URL Slug</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="article-url-slug"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                This will be the URL path for your article
                              </FormDescription>
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
                                <Textarea
                                  placeholder="Brief description of the article..."
                                  className="min-h-[100px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                A short summary that appears in article previews
                              </FormDescription>
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
                                <ArticleEditor
                                  content={field.value}
                                  onChange={(content) => {
                                    field.onChange(content);
                                    handleContentChange(content);
                                  }}
                                  placeholder="Start writing your article..."
                                />
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
                      title={form.getValues('title')}
                      excerpt={form.getValues('excerpt')}
                      content={form.getValues('content')}
                      slug={form.getValues('slug')}
                      category={currentCategory?.name || ''}
                      onSEOChange={handleSEOChange}
                    />
                  </TabsContent>

                  <TabsContent value="analytics">
                    <ContentAnalytics
                      content={form.getValues('content')}
                      title={form.getValues('title')}
                      category={currentCategory?.name || ''}
                    />
                  </TabsContent>

                  <TabsContent value="publish">
                    <div className="space-y-6">
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-yellow-800 text-sm">
                          <strong>Editor Note:</strong> Articles will be saved as drafts and require administrator approval for publishing.
                        </p>
                      </div>
                      <PublishingWorkflow
                        status="draft"
                        onStatusChange={() => {}} // Disabled for editors
                        onSchedulePublish={handleSchedulePublish}
                        seoScore={seoData ? 85 : 0}
                        contentScore={form.getValues('content').split(' ').length > 300 ? 85 : 45}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Publishing Options */}
                <Card>
                  <CardHeader>
                    <CardTitle>Publishing</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Status</label>
                      <div className="p-2 bg-gray-100 rounded border">
                        <span className="text-sm text-gray-600">Draft (Editor Mode)</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Editors can only save articles as drafts
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <FormField
                        control={form.control}
                        name="featured"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel>Featured Article</FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <FormField
                        control={form.control}
                        name="trending"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel>Trending</FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="read_time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Read Time (minutes)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                            />
                          </FormControl>
                          <FormDescription>
                            Auto-calculated based on content length
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Category */}
                <Card>
                  <CardHeader>
                    <CardTitle>Category</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="category_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Featured Image */}
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
                              placeholder="Upload featured image"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Tags */}
                <Card>
                  <CardHeader>
                    <CardTitle>Tags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TagSelector
                      selectedTags={selectedTags}
                      onChange={setSelectedTags}
                    />
                  </CardContent>
                </Card>

                {/* Actions */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {isSubmitting ? 'Saving...' : 'Save as Draft'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </Form>
      )}
    </div>
    </CMSLayout>
  );
};

export default CMSCreateArticle;
