
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
  seoData: SEOData;
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
  additional_keywords: string[];
}

const SEOManager: React.FC<SEOManagerProps> = ({
  title,
  excerpt,
  content,
  slug,
  category,
  seoData,
  onSEOChange
}) => {
  const [keywordInput, setKeywordInput] = useState('');
  const [additionalKeywordInput, setAdditionalKeywordInput] = useState('');
  const [seoScore, setSeoScore] = useState(0);
  const [seoChecks, setSeoChecks] = useState<Array<{name: string, passed: boolean, message: string}>>([]);

  useEffect(() => {
    const newSeoData = { ...seoData };
    let hasChanged = false;

    // Auto-generate meta title if empty
    if (!newSeoData.metaTitle && title) {
      newSeoData.metaTitle = `${title} | ${category} | GhNewsMedia`;
      hasChanged = true;
    }

    // Auto-generate meta description if empty
    if (!newSeoData.metaDescription && (excerpt || content)) {
      newSeoData.metaDescription = excerpt || extractFirstSentence(content);
      hasChanged = true;
    }

    // Auto-generate Open Graph title if empty
    if (!newSeoData.ogTitle && title) {
      newSeoData.ogTitle = title;
      hasChanged = true;
    }

    // Auto-generate Open Graph description if empty
    if (!newSeoData.ogDescription && (excerpt || content)) {
      newSeoData.ogDescription = excerpt || extractFirstSentence(content);
      hasChanged = true;
    }

    // Auto-generate Twitter title if empty
    if (!newSeoData.twitterTitle && title) {
      newSeoData.twitterTitle = title;
      hasChanged = true;
    }

    // Auto-generate Twitter description if empty
    if (!newSeoData.twitterDescription && (excerpt || content)) {
      newSeoData.twitterDescription = excerpt || extractFirstSentence(content);
      hasChanged = true;
    }

    // Auto-generate canonical URL if empty
    if (!newSeoData.canonicalUrl && slug) {
      newSeoData.canonicalUrl = `https://ghnewsmedia.com/news/${slug}`;
      hasChanged = true;
    }

    // Update schema data
    newSeoData.schema = {
      headline: title || '',
      description: excerpt || extractFirstSentence(content),
      keywords: newSeoData.keywords.join(', ')
    };

    // Only trigger change if there are actual changes
    if (hasChanged) {
      onSEOChange(newSeoData);
    }
  }, [title, excerpt, content, slug, category, seoData.metaTitle, seoData.metaDescription, seoData.ogTitle, seoData.ogDescription, seoData.twitterTitle, seoData.twitterDescription, seoData.canonicalUrl]);

  useEffect(() => {
    calculateSEOScore();
  }, [seoData, content, title]);

  const extractFirstSentence = (text: string): string => {
    const sentences = text.split(/[.!?]+/);
    return sentences[0] ? sentences[0].substring(0, 160).trim() + '...' : '';
  };

  const calculateKeywordDensity = (keyword: string, content: string): number => {
    if (!keyword || !content) return 0;
    const keywordRegex = new RegExp(keyword.toLowerCase(), 'gi');
    const matches = content.toLowerCase().match(keywordRegex);
    const wordCount = content.split(/\s+/).length;
    return matches ? Math.round((matches.length / wordCount) * 100 * 100) / 100 : 0;
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !seoData.keywords.includes(keywordInput.trim())) {
      onSEOChange({ ...seoData, keywords: [...seoData.keywords, keywordInput.trim()] });
      setKeywordInput('');
    }
  };

  const addAdditionalKeyword = () => {
    if (additionalKeywordInput.trim() && !seoData.additional_keywords.includes(additionalKeywordInput.trim())) {
      onSEOChange({ ...seoData, additional_keywords: [...seoData.additional_keywords, additionalKeywordInput.trim()] });
      setAdditionalKeywordInput('');
    }
  };

  const removeKeyword = (keyword: string) => {
    onSEOChange({ ...seoData, keywords: seoData.keywords.filter(k => k !== keyword) });
  };

  const removeAdditionalKeyword = (keyword: string) => {
    onSEOChange({ ...seoData, additional_keywords: seoData.additional_keywords.filter(k => k !== keyword) });
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

  const updateSEOField = (field: keyof SEOData, value: any) => {
    onSEOChange({ ...seoData, [field]: value });
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
              className={`${
                seoData.metaTitle.length < 30 || seoData.metaTitle.length > 60
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : seoData.metaTitle.length >= 30 && seoData.metaTitle.length <= 60
                  ? 'border-green-300 focus:border-green-500 focus:ring-green-500'
                  : ''
              }`}
            />
            <div className="flex justify-between items-center mt-1">
              <p className={`text-xs ${
                seoData.metaTitle.length < 30 || seoData.metaTitle.length > 60
                  ? 'text-red-500'
                  : seoData.metaTitle.length >= 30 && seoData.metaTitle.length <= 60
                  ? 'text-green-600'
                  : 'text-gray-500'
              }`}>
                {seoData.metaTitle.length}/60 characters
              </p>
              {seoData.metaTitle.length > 0 && (
                <span className={`text-xs px-2 py-1 rounded ${
                  seoData.metaTitle.length < 30 || seoData.metaTitle.length > 60
                    ? 'bg-red-100 text-red-700'
                    : seoData.metaTitle.length >= 30 && seoData.metaTitle.length <= 60
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {seoData.metaTitle.length < 30 ? 'Too Short' : 
                   seoData.metaTitle.length > 60 ? 'Too Long' : 'Perfect'}
                </span>
              )}
            </div>
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
              className={`${
                seoData.metaDescription.length < 120 || seoData.metaDescription.length > 160
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : seoData.metaDescription.length >= 120 && seoData.metaDescription.length <= 160
                  ? 'border-green-300 focus:border-green-500 focus:ring-green-500'
                  : ''
              }`}
            />
            <div className="flex justify-between items-center mt-1">
              <p className={`text-xs ${
                seoData.metaDescription.length < 120 || seoData.metaDescription.length > 160
                  ? 'text-red-500'
                  : seoData.metaDescription.length >= 120 && seoData.metaDescription.length <= 160
                  ? 'text-green-600'
                  : 'text-gray-500'
              }`}>
                {seoData.metaDescription.length}/160 characters
              </p>
              {seoData.metaDescription.length > 0 && (
                <span className={`text-xs px-2 py-1 rounded ${
                  seoData.metaDescription.length < 120 || seoData.metaDescription.length > 160
                    ? 'bg-red-100 text-red-700'
                    : seoData.metaDescription.length >= 120 && seoData.metaDescription.length <= 160
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {seoData.metaDescription.length < 120 ? 'Too Short' : 
                   seoData.metaDescription.length > 160 ? 'Too Long' : 'Perfect'}
                </span>
              )}
            </div>
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
              className={`${
                seoData.focusKeyword && !title.toLowerCase().includes(seoData.focusKeyword.toLowerCase())
                  ? 'border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500'
                  : seoData.focusKeyword && title.toLowerCase().includes(seoData.focusKeyword.toLowerCase())
                  ? 'border-green-300 focus:border-green-500 focus:ring-green-500'
                  : ''
              }`}
            />
            <div className="mt-1 space-y-1">
              <p className="text-xs text-gray-500">
                Main keyword this article should rank for
              </p>
              {seoData.focusKeyword && (
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      title.toLowerCase().includes(seoData.focusKeyword.toLowerCase())
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {title.toLowerCase().includes(seoData.focusKeyword.toLowerCase())
                        ? '✓ In Title'
                        : '⚠ Not in Title'}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      content.toLowerCase().includes(seoData.focusKeyword.toLowerCase())
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {content.toLowerCase().includes(seoData.focusKeyword.toLowerCase())
                        ? '✓ In Content'
                        : '⚠ Not in Content'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Keyword density: {calculateKeywordDensity(seoData.focusKeyword, content)}%
                  </p>
                </div>
              )}
            </div>
          </div>

          <div>
            <Label>Keywords</Label>
            <div className="flex space-x-2 mb-2">
              <Input
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                placeholder="Add keyword..."
                onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                className="flex-1"
              />
              <Button type="button" onClick={addKeyword} size="sm" disabled={!keywordInput.trim()}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs text-gray-500">
                {seoData.keywords.length}/10 keywords
              </p>
              {seoData.keywords.length > 0 && (
                <span className={`text-xs px-2 py-1 rounded ${
                  seoData.keywords.length < 3
                    ? 'bg-red-100 text-red-700'
                    : seoData.keywords.length >= 3 && seoData.keywords.length <= 10
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {seoData.keywords.length < 3 ? 'Too Few' : 
                   seoData.keywords.length > 10 ? 'Too Many' : 'Good Range'}
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {seoData.keywords.map((keyword, index) => (
                <Badge key={index} variant="secondary" className="flex items-center space-x-1 hover:bg-gray-200 transition-colors">
                  <span>{keyword}</span>
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-red-600"
                    onClick={() => removeKeyword(keyword)}
                  />
                </Badge>
              ))}
              {seoData.keywords.length === 0 && (
                <p className="text-sm text-gray-400 italic">No keywords added yet</p>
              )}
            </div>
          </div>

          <div>
            <Label>Additional Keywords</Label>
            <div className="flex space-x-2 mb-2">
              <Input
                value={additionalKeywordInput}
                onChange={(e) => setAdditionalKeywordInput(e.target.value)}
                placeholder="Add additional keyword..."
                onKeyPress={(e) => e.key === 'Enter' && addAdditionalKeyword()}
                className="flex-1"
              />
              <Button type="button" onClick={addAdditionalKeyword} size="sm" disabled={!additionalKeywordInput.trim()}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs text-gray-500">
                {seoData.additional_keywords.length} additional keywords
              </p>
              {seoData.additional_keywords.length > 0 && (
                <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700">
                  Supporting Keywords
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {seoData.additional_keywords.map((keyword, index) => (
                <Badge key={index} variant="outline" className="flex items-center space-x-1 hover:bg-blue-50 transition-colors">
                  <span>{keyword}</span>
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-red-600"
                    onClick={() => removeAdditionalKeyword(keyword)}
                  />
                </Badge>
              ))}
              {seoData.additional_keywords.length === 0 && (
                <p className="text-sm text-gray-400 italic">No additional keywords added yet</p>
              )}
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
              <div>
                <Input
                  value={seoData.ogTitle}
                  onChange={(e) => updateSEOField('ogTitle', e.target.value)}
                  placeholder="Open Graph title..."
                  maxLength={60}
                  className={`${
                    seoData.ogTitle.length > 60
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : ''
                  }`}
                />
                <p className={`text-xs mt-1 ${
                  seoData.ogTitle.length > 60 ? 'text-red-500' : 'text-gray-500'
                }`}>
                  {seoData.ogTitle.length}/60 characters
                </p>
              </div>
              <div>
                <Textarea
                  value={seoData.ogDescription}
                  onChange={(e) => updateSEOField('ogDescription', e.target.value)}
                  placeholder="Open Graph description..."
                  rows={2}
                  maxLength={160}
                  className={`${
                    seoData.ogDescription.length > 160
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : ''
                  }`}
                />
                <p className={`text-xs mt-1 ${
                  seoData.ogDescription.length > 160 ? 'text-red-500' : 'text-gray-500'
                }`}>
                  {seoData.ogDescription.length}/160 characters
                </p>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <Label>Twitter Card</Label>
            <div className="space-y-2">
              <div>
                <Input
                  value={seoData.twitterTitle}
                  onChange={(e) => updateSEOField('twitterTitle', e.target.value)}
                  placeholder="Twitter title..."
                  maxLength={60}
                  className={`${
                    seoData.twitterTitle.length > 60
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : ''
                  }`}
                />
                <p className={`text-xs mt-1 ${
                  seoData.twitterTitle.length > 60 ? 'text-red-500' : 'text-gray-500'
                }`}>
                  {seoData.twitterTitle.length}/60 characters
                </p>
              </div>
              <div>
                <Textarea
                  value={seoData.twitterDescription}
                  onChange={(e) => updateSEOField('twitterDescription', e.target.value)}
                  placeholder="Twitter description..."
                  rows={2}
                  maxLength={160}
                  className={`${
                    seoData.twitterDescription.length > 160
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : ''
                  }`}
                />
                <p className={`text-xs mt-1 ${
                  seoData.twitterDescription.length > 160 ? 'text-red-500' : 'text-gray-500'
                }`}>
                  {seoData.twitterDescription.length}/160 characters
                </p>
              </div>
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
              {seoData.metaTitle || title || 'Your article title will appear here...'}
            </h3>
            <p className="text-green-700 text-sm">
              {seoData.canonicalUrl || `https://ghnewsmedia.com/news/${slug}` || 'https://ghnewsmedia.com/news/...'}
            </p>
            <p className="text-gray-600 text-sm mt-1">
              {seoData.metaDescription || excerpt || 'Your meta description will appear here...'}
            </p>
            {seoData.keywords.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {seoData.keywords.slice(0, 5).map((keyword, index) => (
                  <span key={index} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {keyword}
                  </span>
                ))}
                {seoData.keywords.length > 5 && (
                  <span className="text-xs text-gray-500">+{seoData.keywords.length - 5} more</span>
                )}
              </div>
            )}
          </div>
          <div className="mt-3 text-xs text-gray-500">
            <p>This is how your article will appear in search results</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SEOManager;
