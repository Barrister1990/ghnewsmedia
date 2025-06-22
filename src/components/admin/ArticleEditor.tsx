
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Bold, Heading1, Heading2, Image, Italic, Link, List, Quote, Video } from 'lucide-react';
import React, { useState } from 'react';
import ImageUploadDialog from './ImageUploadDialog';
import VideoEmbedDialog from './VideoEmbedDialog';

interface ArticleEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const ArticleEditor: React.FC<ArticleEditorProps> = ({
  content,
  onChange,
  placeholder = 'Start writing...'
}) => {
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const insertMarkdown = (syntax: string) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    let newText = '';
    
    switch (syntax) {
      case 'bold':
        newText = `**${selectedText || 'bold text'}**`;
        break;
      case 'italic':
        newText = `*${selectedText || 'italic text'}*`;
        break;
      case 'h1':
        newText = `\n# ${selectedText || 'Heading 1'}\n`;
        break;
      case 'h2':
        newText = `\n## ${selectedText || 'Heading 2'}\n`;
        break;
      case 'quote':
        newText = `\n> ${selectedText || 'Quote text'}\n`;
        break;
      case 'list':
        newText = `\n- ${selectedText || 'List item'}\n`;
        break;
      case 'link':
        newText = `[${selectedText || 'link text'}](url)`;
        break;
      case 'image':
        setIsImageDialogOpen(true);
        return;
      case 'video':
        setIsVideoDialogOpen(true);
        return;
      default:
        newText = selectedText;
    }

    const newContent = content.substring(0, start) + newText + content.substring(end);
    onChange(newContent);

    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + newText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleImageInsert = (imageUrl: string, altText: string) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    const imageMarkdown = `![${altText}](${imageUrl})`;
    const newContent = content.substring(0, start) + imageMarkdown + content.substring(end);
    onChange(newContent);

    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + imageMarkdown.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleVideoInsert = (embedCode: string) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    const videoEmbed = `\n\n${embedCode}\n\n`;
    const newContent = content.substring(0, start) + videoEmbed + content.substring(end);
    onChange(newContent);

    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + videoEmbed.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="border-b bg-gray-50 p-2 flex flex-wrap gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown('bold')}
          className="p-2"
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown('italic')}
          className="p-2"
        >
          <Italic className="w-4 h-4" />
        </Button>
        <div className="w-px bg-gray-300 mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown('h1')}
          className="p-2"
        >
          <Heading1 className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown('h2')}
          className="p-2"
        >
          <Heading2 className="w-4 h-4" />
        </Button>
        <div className="w-px bg-gray-300 mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown('quote')}
          className="p-2"
        >
          <Quote className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown('list')}
          className="p-2"
        >
          <List className="w-4 h-4" />
        </Button>
        <div className="w-px bg-gray-300 mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown('link')}
          className="p-2"
        >
          <Link className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown('image')}
          className="p-2"
        >
          <Image className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertMarkdown('video')}
          className="p-2"
        >
          <Video className="w-4 h-4" />
        </Button>
      </div>

      {/* Editor */}
      <Textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-[400px] border-0 resize-none focus:ring-0 focus:border-0 font-mono text-sm"
        onSelect={(e) => {
          const target = e.target as HTMLTextAreaElement;
        }}
      />

      {/* Status Bar */}
      <div className="border-t bg-gray-50 px-3 py-2 text-xs text-gray-500 flex justify-between">
        <span>Markdown supported • Video embeds supported</span>
        <span>{content.length} characters</span>
      </div>

      {/* Image Upload Dialog */}
      <ImageUploadDialog
        isOpen={isImageDialogOpen}
        onClose={() => setIsImageDialogOpen(false)}
        onImageInsert={handleImageInsert}
      />

      {/* Video Embed Dialog */}
      <VideoEmbedDialog
        isOpen={isVideoDialogOpen}
        onClose={() => setIsVideoDialogOpen(false)}
        onVideoInsert={handleVideoInsert}
      />
    </div>
  );
};

export default ArticleEditor;
