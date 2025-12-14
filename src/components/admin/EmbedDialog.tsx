import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Code, Eye, Globe, Instagram, Link, Twitter, Youtube } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

// Declare Twitter and Instagram widgets global
declare global {
  interface Window {
    twttr?: {
      widgets: {
        load: () => void;
      };
    };
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
  }
}

interface EmbedDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (embedCode: string) => void;
}

const EmbedDialog: React.FC<EmbedDialogProps> = ({ isOpen, onClose, onInsert }) => {
  const [embedCode, setEmbedCode] = useState('');
  const [embedType, setEmbedType] = useState<'manual' | 'youtube' | 'vimeo' | 'url' | 'twitter' | 'instagram'>('manual');
  const [url, setUrl] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  // Auto-detect embed type when embedCode changes
  useEffect(() => {
    if (embedCode.includes('twitter-tweet') || embedCode.includes('blockquote class="twitter-tweet"')) {
      setEmbedType('twitter');
    } else if (embedCode.includes('instagram-media') || embedCode.includes('blockquote class="instagram-media"')) {
      setEmbedType('instagram');
    } else if (embedCode.includes('youtube.com') || embedCode.includes('youtu.be')) {
      setEmbedType('youtube');
    } else if (embedCode.includes('vimeo.com')) {
      setEmbedType('vimeo');
    } else if (embedCode.includes('<iframe') || embedCode.includes('<script')) {
      setEmbedType('manual');
    } else if (embedCode.trim() && !embedCode.includes('<')) {
      setEmbedType('url');
    }
  }, [embedCode]);

  const handleInsert = () => {
    if (!embedCode.trim()) {
      toast.error('Please paste the embed code or URL');
      return;
    }

    let finalEmbedCode = embedCode;

    // Convert YouTube URL to embed code if needed
    if (embedType === 'youtube' && !embedCode.includes('<iframe')) {
      const videoId = extractYouTubeId(embedCode);
      if (videoId) {
        finalEmbedCode = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
      }
    }

    // Convert Vimeo URL to embed code if needed
    if (embedType === 'vimeo' && !embedCode.includes('<iframe')) {
      const vimeoId = embedCode.match(/vimeo\.com\/(\d+)/)?.[1];
      if (vimeoId) {
        finalEmbedCode = `<iframe width="560" height="315" src="https://player.vimeo.com/video/${vimeoId}" title="Vimeo video player" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
      }
    }

    // Auto-detect iframe and set embed type
    if (embedCode.includes('<iframe')) {
      setEmbedType('manual');
      finalEmbedCode = embedCode;
    }

    onInsert(finalEmbedCode);
    setEmbedCode('');
    setUrl('');
    onClose();
    toast.success('Embed content inserted successfully');
  };

  const extractYouTubeId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/v\/([^&\n?#]+)/,
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl);
    setEmbedCode(newUrl);
  };

  const renderPreview = () => {
    if (!embedCode.trim()) {
      return (
        <div className="bg-gray-100 p-4 rounded-lg border border-gray-200 text-center">
          <p className="text-gray-500 text-sm">Enter embed code or URL to see preview</p>
        </div>
      );
    }

    // Twitter embed preview
    if (embedCode.includes('twitter-tweet') || embedCode.includes('blockquote class="twitter-tweet"')) {
      // Extract blockquote HTML - handle both with and without script tag
      const blockquoteMatch = embedCode.match(/<blockquote[^>]*class=["']twitter-tweet["'][^>]*>([\s\S]*?)<\/blockquote>/);
      if (blockquoteMatch) {
        const blockquoteHTML = blockquoteMatch[0];
        const blockquoteProps: Record<string, string> = {};
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = blockquoteHTML;
        const blockquote = tempDiv.querySelector('blockquote');
        
        if (blockquote) {
          Array.from(blockquote.attributes).forEach(attr => {
            blockquoteProps[attr.name] = attr.value;
          });
          
          return (
            <div className="my-4" style={{ width: '100%' }}>
              <div 
                className="twitter-embed-wrapper"
                style={{ 
                  maxWidth: '100%',
                  width: '100%',
                  overflow: 'hidden',
                  margin: '0 auto',
                  padding: '0'
                }}
              >
                <blockquote 
                  {...blockquoteProps}
                  style={{ margin: 0, width: '100%', maxWidth: '100%' }}
                  dangerouslySetInnerHTML={{ __html: blockquote.innerHTML }}
                />
              </div>
            </div>
          );
        }
      }
    }

    // Instagram embed preview
    if (embedCode.includes('instagram-media') || embedCode.includes('blockquote class="instagram-media"')) {
      // Extract blockquote HTML - handle both with and without script tag
      const blockquoteMatch = embedCode.match(/<blockquote[^>]*class=["']instagram-media["'][^>]*>([\s\S]*?)<\/blockquote>/);
      if (blockquoteMatch) {
        const blockquoteHTML = blockquoteMatch[0];
        const blockquoteProps: Record<string, string> = {};
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = blockquoteHTML;
        const blockquote = tempDiv.querySelector('blockquote');
        
        if (blockquote) {
          Array.from(blockquote.attributes).forEach(attr => {
            blockquoteProps[attr.name] = attr.value;
          });
          
          return (
            <div className="my-4" style={{ width: '100%' }}>
              <div 
                className="instagram-embed-wrapper"
                style={{ 
                  maxWidth: '100%',
                  width: '100%',
                  overflow: 'hidden',
                  margin: '0 auto',
                  display: 'flex',
                  justifyContent: 'center',
                  padding: '0'
                }}
              >
                <blockquote 
                  {...blockquoteProps}
                  style={{ margin: 0, maxWidth: '540px', width: '100%', minWidth: '326px' }}
                  dangerouslySetInnerHTML={{ __html: blockquote.innerHTML }}
                />
              </div>
            </div>
          );
        }
      }
    }

    // Check if it's a YouTube iframe
    if (embedCode.includes('youtube.com/embed/')) {
      const videoId = extractYouTubeId(embedCode);
      if (videoId) {
        return (
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video preview"
              className="absolute top-0 left-0 w-full h-full rounded-lg border border-gray-200"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        );
      }
    }

    // Check if it's a Vimeo iframe
    if (embedCode.includes('player.vimeo.com/video/')) {
      const vimeoId = embedCode.match(/vimeo\.com\/video\/(\d+)/)?.[1];
      if (vimeoId) {
        return (
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              src={`https://player.vimeo.com/video/${vimeoId}`}
              title="Vimeo video preview"
              className="absolute top-0 left-0 w-full h-full rounded-lg border border-gray-200"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          </div>
        );
      }
    }

    // Generic iframe preview
    if (embedCode.includes('<iframe')) {
      const srcMatch = embedCode.match(/src=["']([^"']+)["']/);
      const src = srcMatch ? srcMatch[1] : '';
      
      if (src) {
        const widthMatch = embedCode.match(/width=["']([^"']+)["']/);
        const heightMatch = embedCode.match(/height=["']([^"']+)["']/);
        const width = widthMatch ? parseInt(widthMatch[1]) : 560;
        const height = heightMatch ? parseInt(heightMatch[1]) : 315;
        const aspectRatio = (height / width) * 100;

        return (
          <div className="relative w-full" style={{ paddingBottom: `${aspectRatio}%` }}>
            <iframe
              src={src}
              title="Embed preview"
              className="absolute top-0 left-0 w-full h-full rounded-lg border border-gray-200"
              frameBorder="0"
              allowFullScreen
            />
          </div>
        );
      }
    }

    // URL preview
    if (embedCode.includes('http') && !embedCode.includes('<')) {
      return (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-blue-700 text-sm">
            <strong>URL:</strong> {embedCode}
          </p>
          <p className="text-blue-600 text-xs mt-1">
            This will be converted to a clickable link
          </p>
        </div>
      );
    }

    return (
      <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
        <p className="text-gray-600 text-sm">Preview not available for this content type</p>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-lg max-h-[90vh] overflow-y-auto p-3 sm:p-6" style={{ maxWidth: '95vw', boxSizing: 'border-box' }}>
        <DialogHeader className="pr-6 sm:pr-0">
          <DialogTitle className="text-base sm:text-lg">Embed Content</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Paste the HTML embed code from sources like Twitter, Facebook, Instagram, etc.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 overflow-x-hidden w-full" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
          {/* Embed Type Tabs */}
          <div className="flex space-x-0.5 sm:space-x-1 border-b overflow-x-auto overflow-y-hidden w-full" style={{ scrollbarWidth: 'thin', WebkitOverflowScrolling: 'touch', maxWidth: '100%', boxSizing: 'border-box' }}>
            <button
              onClick={() => setEmbedType('youtube')}
              className={`px-2 py-2 text-xs font-medium rounded-t-lg transition-colors whitespace-nowrap flex-shrink-0 ${
                embedType === 'youtube'
                  ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Youtube className="w-3 h-3 inline mr-1" />
              <span className="sm:hidden">YT</span>
              <span className="hidden sm:inline">YouTube</span>
            </button>
            <button
              onClick={() => setEmbedType('vimeo')}
              className={`px-2 py-2 text-xs font-medium rounded-t-lg transition-colors whitespace-nowrap flex-shrink-0 ${
                embedType === 'vimeo'
                  ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Globe className="w-3 h-3 inline mr-1" />
              <span className="sm:hidden">VM</span>
              <span className="hidden sm:inline">Vimeo</span>
            </button>
            <button
              onClick={() => setEmbedType('twitter')}
              className={`px-2 py-2 text-xs font-medium rounded-t-lg transition-colors whitespace-nowrap flex-shrink-0 ${
                embedType === 'twitter'
                  ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Twitter className="w-3 h-3 inline mr-1" />
              <span className="sm:hidden">TW</span>
              <span className="hidden sm:inline">Twitter</span>
            </button>
            <button
              onClick={() => setEmbedType('instagram')}
              className={`px-2 py-2 text-xs font-medium rounded-t-lg transition-colors whitespace-nowrap flex-shrink-0 ${
                embedType === 'instagram'
                  ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Instagram className="w-3 h-3 inline mr-1" />
              <span className="sm:hidden">IG</span>
              <span className="hidden sm:inline">Instagram</span>
            </button>
            <button
              onClick={() => setEmbedType('url')}
              className={`px-2 py-2 text-xs font-medium rounded-t-lg transition-colors whitespace-nowrap flex-shrink-0 ${
                embedType === 'url'
                  ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Link className="w-3 h-3 inline mr-1" />
              <span>URL</span>
            </button>
            <button
              onClick={() => setEmbedType('manual')}
              className={`px-2 py-2 text-xs font-medium rounded-t-lg transition-colors whitespace-nowrap flex-shrink-0 ${
                embedType === 'manual'
                  ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Code className="w-3 h-3 inline mr-1" />
              <span className="sm:hidden">Code</span>
              <span className="hidden sm:inline">Manual</span>
            </button>
          </div>

          {/* YouTube Tab */}
          {embedType === 'youtube' && (
            <div className="space-y-3 w-full">
              <div className="w-full">
                <Label htmlFor="youtube-url">YouTube URL</Label>
                <input
                  id="youtube-url"
                  type="url"
                  value={url}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full max-w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ maxWidth: '100%' }}
                />
              </div>
              <div className="text-sm text-gray-600">
                <p>Supported formats:</p>
                <ul className="list-disc list-inside ml-2 text-xs">
                  <li>https://www.youtube.com/watch?v=VIDEO_ID</li>
                  <li>https://youtu.be/VIDEO_ID</li>
                  <li>https://www.youtube.com/embed/VIDEO_ID</li>
                </ul>
              </div>
            </div>
          )}

          {/* Vimeo Tab */}
          {embedType === 'vimeo' && (
            <div className="space-y-3 w-full">
              <div className="w-full">
                <Label htmlFor="vimeo-url">Vimeo URL</Label>
                <input
                  id="vimeo-url"
                  type="url"
                  value={url}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder="https://vimeo.com/VIDEO_ID"
                  className="w-full max-w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ maxWidth: '100%' }}
                />
              </div>
              <div className="text-sm text-gray-600">
                <p>Supported format:</p>
                <p className="text-xs">https://vimeo.com/VIDEO_ID</p>
              </div>
            </div>
          )}

          {/* Twitter Tab */}
          {embedType === 'twitter' && (
            <div className="space-y-3 w-full">
              <div className="w-full">
                <Label htmlFor="twitter-embed">Twitter Embed Code</Label>
                <Textarea
                  id="twitter-embed"
                  value={embedCode}
                  onChange={(e) => setEmbedCode(e.target.value)}
                  placeholder='<blockquote class="twitter-tweet">...</blockquote><script async src="https://platform.twitter.com/widgets.js"></script>'
                  className="min-h-[150px] font-mono text-xs sm:text-sm w-full max-w-full overflow-x-auto"
                  style={{ wordBreak: 'break-word', overflowWrap: 'break-word', maxWidth: '100%', width: '100%' }}
                />
              </div>
              <div className="text-sm text-gray-600">
                <p>Paste the Twitter embed code (blockquote + script tag) from Twitter&apos;s embed option.</p>
                <p className="text-xs mt-1">Tip: Click the three dots on any tweet → Embed Tweet → Copy the code</p>
              </div>
            </div>
          )}

          {/* Instagram Tab */}
          {embedType === 'instagram' && (
            <div className="space-y-3">
              <div>
                <Label htmlFor="instagram-embed">Instagram Embed Code</Label>
                <Textarea
                  id="instagram-embed"
                  value={embedCode}
                  onChange={(e) => setEmbedCode(e.target.value)}
                  placeholder='<blockquote class="instagram-media">...</blockquote><script async src="//www.instagram.com/embed.js"></script>'
                  className="min-h-[150px] font-mono text-xs sm:text-sm w-full max-w-full overflow-x-auto"
                  style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
                />
              </div>
              <div className="text-sm text-gray-600">
                <p>Paste the Instagram embed code (blockquote + script tag) from Instagram&apos;s embed option.</p>
                <p className="text-xs mt-1">Tip: Click the three dots on any Instagram post → Embed → Copy the code</p>
              </div>
            </div>
          )}

          {/* URL Tab */}
          {embedType === 'url' && (
            <div className="space-y-3 w-full">
              <div className="w-full">
                <Label htmlFor="url-input">URL</Label>
                <input
                  id="url-input"
                  type="url"
                  value={url}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full max-w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ maxWidth: '100%' }}
                />
              </div>
              <div className="text-sm text-gray-600">
                <p>Enter any URL to create a clickable link</p>
              </div>
            </div>
          )}

          {/* Manual Tab */}
          {embedType === 'manual' && (
            <div className="space-y-3 w-full">
              <div className="w-full">
                <Label htmlFor="embed-code">Embed Code</Label>
                <Textarea
                  id="embed-code"
                  value={embedCode}
                  onChange={(e) => setEmbedCode(e.target.value)}
                  placeholder='<iframe src="..."></iframe> or <script>...</script>'
                  className="min-h-[150px] font-mono text-xs sm:text-sm w-full max-w-full overflow-x-auto"
                  style={{ wordBreak: 'break-word', overflowWrap: 'break-word', maxWidth: '100%', width: '100%' }}
                />
              </div>
              <div className="text-sm text-gray-600">
                <p>Paste HTML embed code from Twitter, Facebook, Instagram, etc.</p>
              </div>
            </div>
          )}

          {/* Preview Toggle */}
          <div className="flex items-center justify-between w-full">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center space-x-2 text-xs sm:text-sm"
            >
              <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{showPreview ? 'Hide Preview' : 'Show Preview'}</span>
              <span className="sm:hidden">{showPreview ? 'Hide' : 'Preview'}</span>
            </Button>
          </div>

          {/* Preview Section */}
          {showPreview && (
            <div className="border-t pt-4 overflow-x-hidden w-full" style={{ maxWidth: '100%' }}>
              <Label className="text-xs sm:text-sm font-medium mb-2 block">Preview</Label>
              <div className="bg-gray-50 rounded-lg p-2 sm:p-4 overflow-x-hidden w-full" style={{ maxWidth: '100%' }}>
                <style jsx global>{`
                  .twitter-embed-wrapper {
                    max-width: 100%;
                    width: 100%;
                    overflow: hidden;
                    margin: 0 auto;
                  }
                  
                  .twitter-embed-wrapper blockquote.twitter-tweet {
                    margin: 0 !important;
                    max-width: 100% !important;
                    width: 100% !important;
                  }
                  
                  .instagram-embed-wrapper {
                    max-width: 100%;
                    width: 100%;
                    overflow: hidden;
                    margin: 0 auto;
                    display: flex;
                    justify-content: center;
                  }
                  
                  .instagram-embed-wrapper blockquote.instagram-media {
                    margin: 0 !important;
                    max-width: 540px !important;
                    width: 100% !important;
                    min-width: 326px !important;
                  }
                  
                  @media (max-width: 640px) {
                    .twitter-embed-wrapper {
                      width: 100% !important;
                      max-width: 100% !important;
                      padding: 0 !important;
                      margin: 0 !important;
                    }
                    
                    .twitter-embed-wrapper blockquote.twitter-tweet {
                      width: 100% !important;
                      max-width: 100% !important;
                      margin: 0 !important;
                    }
                    
                    .instagram-embed-wrapper {
                      width: 100% !important;
                      max-width: 100% !important;
                      padding: 0 !important;
                      margin: 0 !important;
                    }
                    
                    .instagram-embed-wrapper blockquote.instagram-media {
                      min-width: 100% !important;
                      max-width: 100% !important;
                      width: 100% !important;
                      margin: 0 !important;
                    }
                  }
                `}</style>
                {renderPreview()}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:space-x-2 pt-2 border-t w-full">
            <Button variant="outline" onClick={onClose} className="w-full sm:w-auto text-xs sm:text-sm">
              Cancel
            </Button>
            <Button onClick={handleInsert} className="w-full sm:w-auto text-xs sm:text-sm">
              <Code className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Insert Embed</span>
              <span className="sm:hidden">Insert</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmbedDialog;
