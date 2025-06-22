import { Facebook, Link, Mail, MessageCircle, Share2, Twitter } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
  image?: string;
  className?: string;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({
  url,
  title,
  description = '',
  image = '',
  className = ''
}) => {
  const [copied, setCopied] = useState(false);
  const [isShareSupported, setIsShareSupported] = useState(false);

  // Check if Web Share API is supported
  useEffect(() => {
    setIsShareSupported(typeof navigator !== 'undefined' && 'share' in navigator);
  }, []);

  const shareData = {
    url: encodeURIComponent(url),
    title: encodeURIComponent(title),
    description: encodeURIComponent(description),
    image: encodeURIComponent(image)
  };

  const shareLinks = [
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${shareData.url}&quote=${shareData.title}`,
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?url=${shareData.url}&text=${shareData.title}&via=GhNewsMedia`,
      color: 'bg-sky-500 hover:bg-sky-600'
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      url: `https://wa.me/?text=${shareData.title}%20${shareData.url}`,
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      name: 'Email',
      icon: Mail,
      url: `mailto:?subject=${shareData.title}&body=${shareData.description}%0A%0A${shareData.url}`,
      color: 'bg-gray-600 hover:bg-gray-700'
    }
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackErr) {
        console.error('Fallback copy failed:', fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  };

  const handleNativeShare = async () => {
    if (isShareSupported && navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description,
          url: url,
        });
      } catch (err) {
        // User cancelled the share or an error occurred
        if (err instanceof Error && err.name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    }
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <span className="text-sm font-medium text-gray-700">Share:</span>
      <div className="flex space-x-2">
        {shareLinks.map((social) => (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`p-2 rounded-lg text-white transition-colors ${social.color}`}
            title={`Share on ${social.name}`}
            aria-label={`Share on ${social.name}`}
          >
            <social.icon className="w-4 h-4" />
          </a>
        ))}
        
        <button
          onClick={copyToClipboard}
          className={`p-2 rounded-lg transition-colors ${
            copied
              ? 'bg-green-500 hover:bg-green-600'
              : 'bg-gray-500 hover:bg-gray-600'
          } text-white`}
          title={copied ? 'Copied!' : 'Copy link'}
          aria-label={copied ? 'Link copied to clipboard' : 'Copy link to clipboard'}
        >
          <Link className="w-4 h-4" />
        </button>

        {/* Native share button for supported devices */}
        {isShareSupported && (
          <button
            onClick={handleNativeShare}
            className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
            title="Share via device"
            aria-label="Share using device's native share menu"
          >
            <Share2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ShareButtons;