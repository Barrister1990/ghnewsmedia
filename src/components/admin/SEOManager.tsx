
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, Check, Eye, Plus, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface SEOManagerProps {
  title: string;
  excerpt: string;
  content: string;
  slug: string;
  category: string;
  onSEOChange: (seoData: SEOData) => void;
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

const SEOManager: React.FC<SEOManagerProps> = ({
  title,
  excerpt,
  content,
  slug,
  category,
  onSEOChange
}) => {
  const [seoData, setSEOData] = useState<SEOData>({
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
    }
  });

  const [keywordInput, setKeywordInput] = useState('');
  const [seoScore, setSeoScore] = useState(0);
  const [seoChecks, setSeoChecks] = useState<Array<{name: string, passed: boolean, message: string}>>([]);

  useEffect(() => {
    // Auto-generate SEO data from article content
    const autoSEOData = {
      metaTitle: title ? `${title} | ${category} | GhNewsMedia` : '',
      metaDescription: excerpt || extractFirstSentence(content),
      ogTitle: title || '',
      ogDescription: excerpt || extractFirstSentence(content),
      twitterTitle: title || '',
      twitterDescription: excerpt || extractFirstSentence(content),
      canonicalUrl: slug ? `https://ghnewsmedia.com/news/${slug}` : '',
      schema: {
        headline: title || '',
        description: excerpt || extractFirstSentence(content),
        keywords: seoData.keywords.join(', ')
      },
      keywords: seoData.keywords,
      focusKeyword: seoData.focusKeyword
    };

    setSEOData(autoSEOData);
    onSEOChange(autoSEOData);
  }, [title, excerpt, content, slug, category]);

  useEffect(() => {
    calculateSEOScore();
  }, [seoData, content, title]);

  const extractFirstSentence = (text: string): string => {
    const sentences = text.split(/[.!?]+/);
    return sentences[0] ? sentences[0].substring(0, 160).trim() + '...' : '';
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !seoData.keywords.includes(keywordInput.trim())) {
      const newKeywords = [...seoData.keywords, keywordInput.trim()];
      const updatedSEO = { ...seoData, keywords: newKeywords };
      setSEOData(updatedSEO);
      onSEOChange(updatedSEO);
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword: string) => {
    const newKeywords = seoData.keywords.filter(k => k !== keyword);
    const updatedSEO = { ...seoData, keywords: newKeywords };
    setSEOData(updatedSEO);
    onSEOChange(updatedSEO);
  };

  const calculateSEOScore = () => {
    const checks = [
      {
        name: 'Meta Title Length',
        passed: seoData.metaTitle.length >= 30 && seoData.metaTitle.length <= 60,
        message: 'Meta title should be 30-60 characters'
      },
      {
        name: 'Meta Description Length',
        passed: seoData.metaDescription.length >= 120 && seoData.metaDescription.length <= 160,
        message: 'Meta description should be 120-160 characters'
      },
      {
        name: 'Focus Keyword in Title',
        passed: seoData.focusKeyword ? title.toLowerCase().includes(seoData.focusKeyword.toLowerCase()) : false,
        message: 'Focus keyword should appear in the title'
      },
      {
        name: 'Focus Keyword in Content',
        passed: seoData.focusKeyword ? content.toLowerCase().includes(seoData.focusKeyword.toLowerCase()) : false,
        message: 'Focus keyword should appear in content'
      },
      {
        name: 'Keywords Count',
        passed: seoData.keywords.length >= 3 && seoData.keywords.length <= 10,
        message: 'Should have 3-10 keywords'
      },
      {
        name: 'Content Length',
        passed: content.split(' ').length >= 300,
        message: 'Content should have at least 300 words'
      },
      {
        name: 'Headings Structure',
        passed: content.includes('#') || content.includes('##'),
        message: 'Content should include proper heading structure'
      }
    ];

    setSeoChecks(checks);
    const score = Math.round((checks.filter(check => check.passed).length / checks.length) * 100);
    setSeoScore(score);
  };

  const getSEOScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const updateSEOField = (field: string, value: string) => {
    const updatedSEO = { ...seoData, [field]: value };
    setSEOData(updatedSEO);
    onSEOChange(updatedSEO);
  };

  return (
    <div className="space-y-6">
      {/* SEO Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>SEO Analysis</span>
            <span className={`text-2xl font-bold ${getSEOScoreColor(seoScore)}`}>
              {seoScore}%
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {seoChecks.map((check, index) => (
              <div key={index} className="flex items-center space-x-2">
                {check.passed ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600" />
                )}
                <span className={check.passed ? 'text-green-700' : 'text-red-700'}>
                  {check.name}
                </span>
                <span className="text-sm text-gray-500">- {check.message}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Meta Tags */}
      <Card>
        <CardHeader>
          <CardTitle>Meta Tags</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="metaTitle">Meta Title</Label>
            <Input
              id="metaTitle"
              value={seoData.metaTitle}
              onChange={(e) => updateSEOField('metaTitle', e.target.value)}
              placeholder="Enter meta title..."
              maxLength={60}
            />
            <p className="text-xs text-gray-500 mt-1">
              {seoData.metaTitle.length}/60 characters
            </p>
          </div>

          <div>
            <Label htmlFor="metaDescription">Meta Description</Label>
            <Textarea
              id="metaDescription"
              value={seoData.metaDescription}
              onChange={(e) => updateSEOField('metaDescription', e.target.value)}
              placeholder="Enter meta description..."
              maxLength={160}
              rows={3}
            />
            <p className="text-xs text-gray-500 mt-1">
              {seoData.metaDescription.length}/160 characters
            </p>
          </div>

          <div>
            <Label htmlFor="canonicalUrl">Canonical URL</Label>
            <Input
              id="canonicalUrl"
              value={seoData.canonicalUrl}
              onChange={(e) => updateSEOField('canonicalUrl', e.target.value)}
              placeholder="https://ghnewsmedia.com/news/article-slug"
            />
          </div>
        </CardContent>
      </Card>

      {/* Keywords */}
      <Card>
        <CardHeader>
          <CardTitle>Keywords & Focus</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="focusKeyword">Focus Keyword</Label>
            <Input
              id="focusKeyword"
              value={seoData.focusKeyword}
              onChange={(e) => updateSEOField('focusKeyword', e.target.value)}
              placeholder="Enter primary focus keyword..."
            />
            <p className="text-xs text-gray-500 mt-1">
              Main keyword this article should rank for
            </p>
          </div>

          <div>
            <Label>Additional Keywords</Label>
            <div className="flex space-x-2 mb-2">
              <Input
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                placeholder="Add keyword..."
                onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
              />
              <Button onClick={addKeyword} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {seoData.keywords.map((keyword, index) => (
                <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                  <span>{keyword}</span>
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => removeKeyword(keyword)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Media */}
      <Card>
        <CardHeader>
          <CardTitle>Social Media Preview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Open Graph (Facebook)</Label>
            <div className="space-y-2">
              <Input
                value={seoData.ogTitle}
                onChange={(e) => updateSEOField('ogTitle', e.target.value)}
                placeholder="Open Graph title..."
              />
              <Textarea
                value={seoData.ogDescription}
                onChange={(e) => updateSEOField('ogDescription', e.target.value)}
                placeholder="Open Graph description..."
                rows={2}
              />
            </div>
          </div>

          <Separator />

          <div>
            <Label>Twitter Card</Label>
            <div className="space-y-2">
              <Input
                value={seoData.twitterTitle}
                onChange={(e) => updateSEOField('twitterTitle', e.target.value)}
                placeholder="Twitter title..."
              />
              <Textarea
                value={seoData.twitterDescription}
                onChange={(e) => updateSEOField('twitterDescription', e.target.value)}
                placeholder="Twitter description..."
                rows={2}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye className="w-4 h-4" />
            <span>Search Preview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="text-blue-600 text-lg font-medium hover:underline cursor-pointer">
              {seoData.metaTitle || title}
            </h3>
            <p className="text-green-700 text-sm">
              {seoData.canonicalUrl || `https://ghnewsmedia.com/news/${slug}`}
            </p>
            <p className="text-gray-600 text-sm mt-1">
              {seoData.metaDescription || excerpt}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SEOManager;
