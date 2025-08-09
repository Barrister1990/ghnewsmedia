
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Bold, Code, Heading1, Heading2, Heading3, Heading4, Heading5, Heading6, Image, Italic, Link, List, Quote, Underline } from 'lucide-react';
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import EmbedDialog from './EmbedDialog';
import ImageUploadDialog from './ImageUploadDialog';
import LinkDialog from './LinkDialog';

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
  const [isEmbedDialogOpen, setIsEmbedDialogOpen] = useState(false);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [viewMode, setViewMode] = useState('split'); // 'edit', 'split', 'preview'
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const handlePaste = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    event.preventDefault();
    const text = event.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

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
      case 'underline':
        newText = `<u>${selectedText || 'underlined text'}</u>`;
        break;
      case 'h1':
        newText = `\n# ${selectedText || 'Heading 1'}\n`;
        break;
      case 'h2':
        newText = `\n## ${selectedText || 'Heading 2'}\n`;
        break;
      case 'h3':
        newText = `\n### ${selectedText || 'Heading 3'}\n`;
        break;
      case 'h4':
        newText = `\n#### ${selectedText || 'Heading 4'}\n`;
        break;
      case 'h5':
        newText = `\n##### ${selectedText || 'Heading 5'}\n`;
        break;
      case 'h6':
        newText = `\n###### ${selectedText || 'Heading 6'}\n`;
        break;
      case 'code':
        newText = `\`\`\`\n${selectedText || 'code block'}\n\`\`\``;
        break;
      case 'quote':
        newText = `\n> ${selectedText || 'Quote text'}\n`;
        break;
      case 'list':
        newText = `\n- ${selectedText || 'List item'}\n`;
        break;
      case 'link':
        {
          const textarea = textareaRef.current;
          if (textarea) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            setSelectedText(content.substring(start, end));
          }
          setIsLinkDialogOpen(true);
        }
        return;
      case 'image':
        setIsImageDialogOpen(true);
        return;
      case 'embed':
        setIsEmbedDialogOpen(true);
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

  const handleImageInsert = (imageUrl: string, altText: string, credit: string) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    const imageMarkdown = `
<figure>
  <img src="${imageUrl}" alt="${altText}">
  <figcaption>${credit}</figcaption>
</figure>
`;
    
    const newContent = content.substring(0, start) + imageMarkdown + content.substring(end);
    onChange(newContent);

    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + imageMarkdown.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleLinkInsert = (url: string, text: string) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const linkMarkdown = `[${text}](${url})`;
    const newContent = content.substring(0, start) + linkMarkdown + content.substring(end);
    onChange(newContent);

    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + linkMarkdown.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleEmbedInsert = (embedCode: string) => {
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
      <div className="border-b bg-gray-50 p-2 flex flex-wrap items-center gap-1">
        <Button type="button" variant="ghost" size="sm" onClick={() => insertMarkdown('bold')} className="p-2"><Bold className="w-4 h-4" /></Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => insertMarkdown('italic')} className="p-2"><Italic className="w-4 h-4" /></Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => insertMarkdown('underline')} className="p-2"><Underline className="w-4 h-4" /></Button>
        <div className="w-px bg-gray-300 mx-1" />
        <Button type="button" variant="ghost" size="sm" onClick={() => insertMarkdown('h1')} className="p-2"><Heading1 className="w-4 h-4" /></Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => insertMarkdown('h2')} className="p-2"><Heading2 className="w-4 h-4" /></Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => insertMarkdown('h3')} className="p-2"><Heading3 className="w-4 h-4" /></Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => insertMarkdown('h4')} className="p-2"><Heading4 className="w-4 h-4" /></Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => insertMarkdown('h5')} className="p-2"><Heading5 className="w-4 h-4" /></Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => insertMarkdown('h6')} className="p-2"><Heading6 className="w-4 h-4" /></Button>
        <div className="w-px bg-gray-300 mx-1" />
        <Button type="button" variant="ghost" size="sm" onClick={() => insertMarkdown('quote')} className="p-2"><Quote className="w-4 h-4" /></Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => insertMarkdown('list')} className="p-2"><List className="w-4 h-4" /></Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => insertMarkdown('link')} className="p-2"><Link className="w-4 h-4" /></Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => insertMarkdown('code')} className="p-2"><Code className="w-4 h-4" /></Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => insertMarkdown('image')} className="p-2"><Image className="w-4 h-4" /></Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => insertMarkdown('embed')} className="p-2">Embed</Button>
        <div className="flex-grow" />
        <div className="flex items-center gap-2">
          <Button variant={viewMode === 'edit' ? 'secondary' : 'ghost'} size="sm" onClick={() => setViewMode('edit')}>Edit</Button>
          <Button variant={viewMode === 'split' ? 'secondary' : 'ghost'} size="sm" onClick={() => setViewMode('split')}>Split</Button>
          <Button variant={viewMode === 'preview' ? 'secondary' : 'ghost'} size="sm" onClick={() => setViewMode('preview')}>Preview</Button>
        </div>
      </div>

      {/* Editor */}
      <div className={`grid min-h-[400px] ${viewMode === 'split' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
        <Textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => onChange(e.target.value)}
          onPaste={handlePaste}
          placeholder={placeholder}
          className={`min-h-[400px] border-0 resize-none focus:ring-0 focus:border-0 font-mono text-sm ${viewMode === 'preview' ? 'hidden' : ''} ${viewMode === 'split' ? 'md:border-r' : ''}`}
        />
        <div className={`prose prose-sm max-w-none p-4 overflow-auto ${viewMode === 'edit' ? 'hidden' : ''}`}>
          <ReactMarkdown rehypePlugins={[rehypeRaw]}>{content}</ReactMarkdown>
        </div>
      </div>

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

      {/* Embed Dialog */}
      <EmbedDialog
        isOpen={isEmbedDialogOpen}
        onClose={() => setIsEmbedDialogOpen(false)}
        onInsert={handleEmbedInsert}
      />

      {/* Link Dialog */}
      <LinkDialog
        isOpen={isLinkDialogOpen}
        onClose={() => setIsLinkDialogOpen(false)}
        onInsert={handleLinkInsert}
        selectedText={selectedText}
      />
    </div>
  );
};

export default ArticleEditor;
