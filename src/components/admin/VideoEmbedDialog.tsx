import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Facebook, Instagram, Youtube } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface VideoEmbedDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onVideoInsert: (embedCode: string) => void;
}

type Platform = 'youtube' | 'facebook' | 'instagram';

const VideoEmbedDialog: React.FC<VideoEmbedDialogProps> = ({
  isOpen,
  onClose,
  onVideoInsert
}) => {
  const [platform, setPlatform] = useState<Platform>('youtube');
  const [url, setUrl] = useState('');

  const extractYouTubeId = (url: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const extractFacebookVideoId = (url: string) => {
    const regex = /facebook\.com\/.*\/videos\/(\d+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const extractInstagramId = (url: string) => {
    const regex = /instagram\.com\/(?:p|reel)\/([a-zA-Z0-9_-]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const generateEmbedCode = (platform: Platform, url: string) => {
    switch (platform) {
      case 'youtube':
        const youtubeId = extractYouTubeId(url);
        if (!youtubeId) return null;
        return `<div class="video-embed youtube-embed">
<iframe width="560" height="315" src="https://www.youtube.com/embed/${youtubeId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>`;

      case 'facebook':
        const facebookId = extractFacebookVideoId(url);
        if (!facebookId) return null;
        return `<div class="video-embed facebook-embed">
<iframe src="https://www.facebook.com/plugins/video.php?height=314&href=${encodeURIComponent(url)}&show_text=false&width=560&t=0" width="560" height="314" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowFullScreen="true"></iframe>
</div>`;

      case 'instagram':
        const instagramId = extractInstagramId(url);
        if (!instagramId) return null;
        return `<div class="video-embed instagram-embed">
<blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/${instagramId}/" data-instgrm-version="14">
<a href="https://www.instagram.com/p/${instagramId}/" target="_blank">View this post on Instagram</a>
</blockquote>
<script async src="//www.instagram.com/embed.js"></script>
</div>`;

      default:
        return null;
    }
  };

  const handleInsert = () => {
    if (!url.trim()) {
      toast.error('Please enter a valid URL');
      return;
    }

    const embedCode = generateEmbedCode(platform, url);
    if (!embedCode) {
      toast.error('Invalid URL format for the selected platform');
      return;
    }

    onVideoInsert(embedCode);
    setUrl('');
    onClose();
    toast.success('Video embed inserted successfully');
  };

  const getPlatformIcon = (platform: Platform) => {
    switch (platform) {
      case 'youtube':
        return <Youtube className="w-4 h-4" />;
      case 'facebook':
        return <Facebook className="w-4 h-4" />;
      case 'instagram':
        return <Instagram className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Embed Video</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="platform">Platform</Label>
            <Select value={platform} onValueChange={(value: Platform) => setPlatform(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="youtube">
                  <div className="flex items-center space-x-2">
                    <Youtube className="w-4 h-4" />
                    <span>YouTube</span>
                  </div>
                </SelectItem>
                <SelectItem value="facebook">
                  <div className="flex items-center space-x-2">
                    <Facebook className="w-4 h-4" />
                    <span>Facebook</span>
                  </div>
                </SelectItem>
                <SelectItem value="instagram">
                  <div className="flex items-center space-x-2">
                    <Instagram className="w-4 h-4" />
                    <span>Instagram</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="url">Video URL</Label>
            <Input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={`Enter ${platform} video URL`}
            />
          </div>

          <div className="flex space-x-2">
            <Button onClick={handleInsert} className="flex-1">
              {getPlatformIcon(platform)}
              <span className="ml-2">Insert Video</span>
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoEmbedDialog;