import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface LinkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (url: string, text: string) => void;
  selectedText: string;
}

const LinkDialog: React.FC<LinkDialogProps> = ({ isOpen, onClose, onInsert, selectedText }) => {
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');

  useEffect(() => {
    if (isOpen) {
      setText(selectedText || '');
      setUrl('');
    }
  }, [isOpen, selectedText]);

  const handleInsert = () => {
    if (!url.trim()) {
      toast.error('Please enter a URL');
      return;
    }
    if (!text.trim()) {
      toast.error('Please enter link text');
      return;
    }

    onInsert(url, text);
    onClose();
    toast.success('Link inserted successfully');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Insert Link</DialogTitle>
          <DialogDescription>
            Enter the URL and the text to display for the link.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="link-text">Text</Label>
            <Input
              id="link-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Text to display"
            />
          </div>
          <div>
            <Label htmlFor="link-url">URL</Label>
            <Input
              id="link-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleInsert}>
              <Link className="w-4 h-4 mr-2" />
              Insert Link
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LinkDialog;
