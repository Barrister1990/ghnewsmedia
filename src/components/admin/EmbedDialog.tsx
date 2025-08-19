import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Code, Eye, Globe, Link, Youtube } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface EmbedDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (embedCode: string) => void;
}

const EmbedDialog: React.FC<EmbedDialogProps> = ({ isOpen, onClose, onInsert }) => {
  const [embedCode, setEmbedCode] = useState('');
  const [embedType, setEmbedType] = useState<'manual' | 'youtube' | 'vimeo' | 'url'>('manual');
  const [url, setUrl] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  // Auto-detect embed type when embedCode changes
  useEffect(() => {
    if (embedCode.includes('youtube.com') || embedCode.includes('youtu.be')) {
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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Embed Content</DialogTitle>
          <DialogDescription>
            Paste the HTML embed code from sources like Twitter, Facebook, Instagram, etc.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {/* Embed Type Tabs */}
          <div className="flex space-x-1 border-b">
            <button
              onClick={() => setEmbedType('youtube')}
              className={`px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                embedType === 'youtube'
                  ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Youtube className="w-4 h-4 inline mr-2" />
              YouTube
            </button>
            <button
              onClick={() => setEmbedType('vimeo')}
              className={`px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                embedType === 'vimeo'
                  ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Globe className="w-4 h-4 inline mr-2" />
              Vimeo
            </button>
            <button
              onClick={() => setEmbedType('url')}
              className={`px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                embedType === 'url'
                  ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Link className="w-4 h-4 inline mr-2" />
              URL
            </button>
            <button
              onClick={() => setEmbedType('manual')}
              className={`px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                embedType === 'manual'
                  ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Code className="w-4 h-4 inline mr-2" />
              Manual
            </button>
          </div>

          {/* YouTube Tab */}
          {embedType === 'youtube' && (
            <div className="space-y-3">
              <div>
                <Label htmlFor="youtube-url">YouTube URL</Label>
                <input
                  id="youtube-url"
                  type="url"
                  value={url}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <div className="space-y-3">
              <div>
                <Label htmlFor="vimeo-url">Vimeo URL</Label>
                <input
                  id="vimeo-url"
                  type="url"
                  value={url}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder="https://vimeo.com/VIDEO_ID"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="text-sm text-gray-600">
                <p>Supported format:</p>
                <p className="text-xs">https://vimeo.com/VIDEO_ID</p>
              </div>
            </div>
          )}

          {/* URL Tab */}
          {embedType === 'url' && (
            <div className="space-y-3">
              <div>
                <Label htmlFor="url-input">URL</Label>
                <input
                  id="url-input"
                  type="url"
                  value={url}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="text-sm text-gray-600">
                <p>Enter any URL to create a clickable link</p>
              </div>
            </div>
          )}

          {/* Manual Tab */}
          {embedType === 'manual' && (
            <div className="space-y-3">
              <div>
                <Label htmlFor="embed-code">Embed Code</Label>
                <Textarea
                  id="embed-code"
                  value={embedCode}
                  onChange={(e) => setEmbedCode(e.target.value)}
                  placeholder='<iframe src="..."></iframe> or <script>...</script>'
                  className="min-h-[150px] font-mono"
                />
              </div>
              <div className="text-sm text-gray-600">
                <p>Paste HTML embed code from Twitter, Facebook, Instagram, etc.</p>
              </div>
            </div>
          )}

          {/* Preview Toggle */}
          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center space-x-2"
            >
              <Eye className="w-4 h-4" />
              <span>{showPreview ? 'Hide Preview' : 'Show Preview'}</span>
            </Button>
          </div>

          {/* Preview Section */}
          {showPreview && (
            <div className="border-t pt-4">
              <Label className="text-sm font-medium mb-2 block">Preview</Label>
              <div className="bg-gray-50 rounded-lg p-4">
                {renderPreview()}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleInsert}>
              <Code className="w-4 h-4 mr-2" />
              Insert Embed
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmbedDialog;
