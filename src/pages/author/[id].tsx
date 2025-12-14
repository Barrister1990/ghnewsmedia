
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import NewsCard from '@/components/NewsCard';
import ScrollToTop from '@/components/ScrollToTop';
import BreadcrumbSEO from '@/components/SEO/BreadcrumbSEO';
import SEOHead from '@/components/SEO/SEOHead';
import { supabase } from '@/integrations/supabase/client';
import { Author, NewsArticle } from '@/types/news';
import { generateMetaTitle, truncateDescription } from '@/utils/seo';
import { Facebook, Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

// This function transforms article data from Supabase to the app's NewsArticle type.
const transformToNewsArticle = (article: any): NewsArticle => {
  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt || '',
    content: article.content,
    featuredImage: article.featured_image || 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=400&fit=crop',
    author: {
      id: article.author_id || '',
      name: article.author_name || 'Unknown Author',
      bio: '',
      avatar: article.author_avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      title: '',
      social: {}
    },
    category: {
      id: article.category_id || '',
      name: article.category_name || 'General',
      slug: article.category_name?.toLowerCase().replace(/\s+/g, '-') || 'general',
      description: '',
      color: article.category_color || '#3B82F6',
      icon: article.category_icon || '📰',
      updated_at: article.updated_at
    },
    tags: article.tag_names || [],
    publishedAt: article.published_at || article.created_at,
    updatedAt: article.updated_at,
    readTime: article.read_time,
    views: article.views,
    reactions: { likes: 0, hearts: 0, laughs: 0, angry: 0 },
    comments: [],
    featured: article.featured,
    trending: article.trending
  };
};

const AuthorPage = () => {
   const router = useRouter();
  const { id } = router.query;
  const [author, setAuthor] = useState<Author | null>(null);
  const [authorArticles, setAuthorArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const authorId = Array.isArray(id) ? id[0] : id;
    if (!authorId) {
      setLoading(false);
      setError("Author ID is missing.");
      return;
    }

    const fetchAuthorData = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: authorData, error: authorError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authorId)
          .single();

        if (authorError && authorError.code !== 'PGRST116') { // PGRST116 is 'not found'
          throw authorError;
        }

        if (authorData) {
          const formattedAuthor: Author = {
            id: authorData.id,
            name: authorData.name || 'GhNewsMedia Author',
            bio: authorData.bio || 'No biography available.',
            avatar: authorData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(authorData.name || 'G N')}&background=random`,
            title: authorData.title || 'Journalist',
            social: {
              twitter: authorData.twitter || undefined,
              facebook: authorData.facebook || undefined,
              linkedin: authorData.linkedin || undefined,
            },
          };
          setAuthor(formattedAuthor);

          const { data: articlesData, error: articlesError } = await supabase
            .from('articles_with_details')
            .select('*')
            .eq('author_id', authorId)
            .eq('status', 'published')
            .order('published_at', { ascending: false, nullsFirst: false });

          if (articlesError) {
            throw articlesError;
          }
          
          const transformedArticles = (articlesData || []).map(transformToNewsArticle);
          setAuthorArticles(transformedArticles);
        } else {
          setAuthor(null);
        }
      } catch (err:any) {
        console.error("Error fetching author data:", err);
        setError(err.message || 'An unknown error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchAuthorData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading author details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-gray-600 mb-8">Could not load author details: {error}</p>
          <Link href="/" className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  if (!author) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <SEOHead
          title="Author Not Found - GhNewsMedia"
          description="The author you're looking for could not be found. Browse our team of journalists and their latest articles."
          canonical="https://ghnewsmedia.com/404"
        />
        <div className="text-center p-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Author Not Found</h1>
          <p className="text-gray-600 mb-8">Sorry, the author you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/" className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const breadcrumbItems = [
    { name: 'Home', url: 'https://ghnewsmedia.com' },
    { name: 'Authors', url: 'https://ghnewsmedia.com/authors' },
    { name: author.name }
  ];

  const authorStructuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": author.name,
    "jobTitle": author.title,
    "description": author.bio,
    "image": author.avatar,
    "url": `https://ghnewsmedia.com/author/${author.id}`,
    "worksFor": {
      "@type": "Organization",
      "name": "GH News"
    },
    "sameAs": [
      ...(author.social.twitter ? [`https://twitter.com/${author.social.twitter.replace('@', '')}`] : []),
      ...(author.social.facebook ? [`https://facebook.com/${author.social.facebook}`] : []),
      ...(author.social.linkedin ? [`https://linkedin.com/in/${author.social.linkedin}`] : [])
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title={generateMetaTitle(`${author.name} - ${author.title}`, 'Author')}
        description={truncateDescription(`Read articles by ${author.name}, ${author.title} at GH News. ${author.bio}`)}
        canonical={`https://ghnewsmedia.com/author/${author.id}`}
        image={author.avatar}
        tags={[author.name, 'journalist', 'Ghana news', 'author', author.title]}
        structuredData={authorStructuredData}
      />
      
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <BreadcrumbSEO items={breadcrumbItems} />
        
        {/* Author Profile */}
        <div className="bg-white rounded-xl p-8 mb-12 shadow-sm">
          <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-8">
            <img
              src={author.avatar}
              alt={author.name}
              className="w-32 h-32 rounded-full object-cover mx-auto md:mx-0"
              onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(author.name)}&background=random` }}
            />
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {author.name}
              </h1>
              <p className="text-accent font-medium text-lg mb-4">
                {author.title}
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {author.bio}
              </p>
              
              {/* Social Links */}
              <div className="flex justify-center md:justify-start space-x-4">
                {author.social.twitter && (
                  <a
                    href={`https://twitter.com/${author.social.twitter.replace('@', '')}`}
                    className="flex items-center space-x-2 text-blue-500 hover:text-blue-600 transition-colors"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <Twitter className="w-5 h-5" />
                    <span>{author.social.twitter}</span>
                  </a>
                )}
                {author.social.facebook && (
                  <a
                    href={`https://facebook.com/${author.social.facebook}`}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <Facebook className="w-5 h-5" />
                    <span>Facebook</span>
                  </a>
                )}
                {author.social.linkedin && (
                  <a
                    href={`https://linkedin.com/in/${author.social.linkedin}`}
                    className="flex items-center space-x-2 text-blue-700 hover:text-blue-800 transition-colors"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <Linkedin className="w-5 h-5" />
                    <span>LinkedIn</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Author's Articles */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Articles by {author.name}
            </h2>
            <span className="text-gray-600">
              {authorArticles.length} articles
            </span>
          </div>
          
          {authorArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {authorArticles.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                No articles found by this author yet.
              </p>
            </div>
          )}
        </section>
      </main>
      
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default AuthorPage;
