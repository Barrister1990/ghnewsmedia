
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface UrlInputProps {
  onUrlSubmit: (url: string) => void;
}

const UrlInput: React.FC<UrlInputProps> = ({ onUrlSubmit }) => {
  const [urlInput, setUrlInput] = useState('');

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onUrlSubmit(urlInput.trim());
      setUrlInput('');
      toast.success('Image URL added');
    }
  };

  return (
    <div className="flex space-x-2">
      <Input
        type="url"
        placeholder="Enter image URL"
        value={urlInput}
        onChange={(e) => setUrlInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleUrlSubmit()}
      />
      <Button
        type="button"
        variant="outline"
        onClick={handleUrlSubmit}
        disabled={!urlInput.trim()}
      >
        Add
      </Button>
    </div>
  );
};

export default UrlInput;
