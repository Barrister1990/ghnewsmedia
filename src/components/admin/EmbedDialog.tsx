import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Code } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface EmbedDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (embedCode: string) => void;
}

const EmbedDialog: React.FC<EmbedDialogProps> = ({ isOpen, onClose, onInsert }) => {
  const [embedCode, setEmbedCode] = useState('');

  const handleInsert = () => {
    if (!embedCode.trim()) {
      toast.error('Please paste the embed code');
      return;
    }

    onInsert(embedCode);
    setEmbedCode('');
    onClose();
    toast.success('Embed code inserted successfully');
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
          <div>
            <Label htmlFor="embed-code">Embed Code</Label>
            <Textarea
              id="embed-code"
              value={embedCode}
              onChange={(e) => setEmbedCode(e.target.value)}
              placeholder='<iframe src="..."></iframe>'
              className="min-h-[150px] font-mono"
            />
          </div>
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
