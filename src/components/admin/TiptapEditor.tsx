import { Button } from '@/components/ui/button';
import '@/styles/tiptap.css';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { Table } from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import TextAlign from '@tiptap/extension-text-align';
import Typography from '@tiptap/extension-typography';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { common, createLowlight } from 'lowlight';
import {
  Bold,
  Code,
  Eye,
  EyeOff,
  Heading1,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Redo,
  Table as TableIcon,
  Underline as UnderlineIcon,
  Undo,
  Youtube
} from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import ContentPreviewRenderer from './ContentPreviewRenderer';
import EmbedDialog from './EmbedDialog';
import { Iframe } from './IframeExtension';
import ImageUploadDialog from './ImageUploadDialog';
import { ImageWithCredit } from './ImageWithCreditExtension';
import LinkDialog from './LinkDialog';

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({
  content,
  onChange,
  placeholder = 'Start writing your article...'
}) => {
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [isEmbedDialogOpen, setIsEmbedDialogOpen] = useState(false);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6]
        }
      }),
      ImageWithCredit.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg shadow-sm',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 hover:text-blue-800 underline',
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder,
      }),
      CodeBlockLowlight.configure({
        lowlight: createLowlight(common),
      }),
      Highlight.configure({
        multicolor: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Typography,
      Iframe,
    ],
    content: content || '',
    onUpdate: ({ editor: editorInstance }) => {
      const html = editorInstance.getHTML();
      onChange(html);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[400px] p-4',
      },
      // Add keyboard shortcuts
      handleKeyDown: (view, event) => {
        // Only handle shortcuts if editor is available
        if (!editor) return false;
        
        // Ctrl/Cmd + B for bold
        if ((event.ctrlKey || event.metaKey) && event.key === 'b') {
          event.preventDefault();
          event.stopPropagation();
          editor.chain().focus().toggleBold().run();
          return true;
        }
        // Ctrl/Cmd + I for italic
        if ((event.ctrlKey || event.metaKey) && event.key === 'i') {
          event.preventDefault();
          event.stopPropagation();
          editor.chain().focus().toggleItalic().run();
          return true;
        }
        // Ctrl/Cmd + U for underline
        if ((event.ctrlKey || event.metaKey) && event.key === 'u') {
          event.preventDefault();
          event.stopPropagation();
          editor.chain().focus().toggleUnderline().run();
          return true;
        }
        // Ctrl/Cmd + V for paste (allow default behavior)
        if ((event.ctrlKey || event.metaKey) && event.key === 'v') {
          return false; // Allow default paste behavior
        }
        // Ctrl/Cmd + C for copy (allow default behavior)
        if ((event.ctrlKey || event.metaKey) && event.key === 'c') {
          return false; // Allow default copy behavior
        }
        return false;
      },
      // Handle paste events for better embed support
      handlePaste: (view, event, slice) => {
        // Check if pasted content contains iframe or embed code
        const pastedHTML = event.clipboardData?.getData('text/html') || '';
        const pastedText = event.clipboardData?.getData('text/plain') || '';
        
        console.log('Paste event:', { pastedHTML, pastedText });
        
        if (pastedHTML.includes('<iframe') || pastedHTML.includes('youtube.com') || pastedHTML.includes('vimeo.com')) {
          // For HTML content with iframes, we need to handle it specially
          event.preventDefault();
          
          console.log('Processing iframe paste...');
          
          // Parse the iframe HTML to extract attributes
          if (pastedHTML.includes('<iframe')) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(pastedHTML, 'text/html');
            const iframe = doc.querySelector('iframe');
            
            if (iframe) {
              const src = iframe.getAttribute('src');
              const width = iframe.getAttribute('width');
              const height = iframe.getAttribute('height');
              const title = iframe.getAttribute('title') || 'Embedded content';
              
              console.log('Iframe attributes:', { src, width, height, title });
              
              if (src) {
                // Insert as iframe node
                if (editor) {
                  editor.chain().focus().setIframe({
                    src,
                    width: width || '560',
                    height: height || '315',
                    title,
                  }).run();
                  console.log('Iframe node inserted successfully');
                  return true;
                }
              }
            }
          }
          
          // Fallback: Insert the HTML content directly
          if (editor) {
            const htmlContent = pastedHTML || pastedText;
            console.log('Fallback: inserting HTML content');
            editor.chain().focus().insertContent(htmlContent).run();
          }
          
          return true; // Prevent default paste behavior
        }
        
        // For regular text, allow default paste behavior
        return false;
      },
    },
    // SSR configuration to prevent hydration mismatches
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  // Function to add image with credit
  const addImage = (url: string, alt: string, credit: string) => {
    if (editor) {
      editor.chain().focus().setImageWithCredit({
        src: url,
        alt: alt,
        credit: credit
      }).run();
    }
  };

  // Function to handle image upload dialog
  const handleImageUpload = () => {
    setIsImageDialogOpen(true);
  };

  // Function to handle image upload completion
  const handleImageUploadComplete = (url: string, alt: string, credit: string) => {
    addImage(url, alt, credit);
    setIsImageDialogOpen(false);
    
    // Update the form with the new image credit
    // This part of the original code was not provided in the edit_specification,
    // so it's not included in the new_code.
  };

  const addLink = useCallback((url: string, text: string) => {
    if (editor) {
      if (text) {
        // If there's selected text, wrap it with a link
        editor.chain().focus().setLink({ href: url }).run();
      } else {
        // If no text selected, insert a link with the URL as text
        editor.chain().focus().insertContent(`<a href="${url}">${url}</a>`).run();
      }
    }
  }, [editor]);

  const addEmbed = useCallback((embedCode: string) => {
    if (editor) {
      console.log('Adding embed:', embedCode);
      
      // Check if it's an iframe embed
      if (embedCode.includes('<iframe')) {
        console.log('Processing iframe embed...');
        const parser = new DOMParser();
        const doc = parser.parseFromString(embedCode, 'text/html');
        const iframe = doc.querySelector('iframe');
        
        if (iframe) {
          const src = iframe.getAttribute('src');
          const width = iframe.getAttribute('width');
          const height = iframe.getAttribute('height');
          const title = iframe.getAttribute('title') || 'Embedded content';
          
          console.log('Iframe attributes:', { src, width, height, title });
          
          if (src) {
            // Insert as iframe node
            console.log('Inserting iframe node...');
            editor.chain().focus().setIframe({
              src,
              width: width || '560',
              height: height || '315',
              title,
            }).run();
            console.log('Iframe node inserted successfully');
            return;
          }
        }
      }
      
      // Fallback: Insert as regular content
      console.log('Fallback: inserting as regular content');
      editor.chain().focus().insertContent(embedCode).run();
    }
  }, [editor]);

  const insertTable = useCallback(() => {
    if (editor) {
      editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    }
  }, [editor]);

  // Don't render until we're on the client side
  if (!isClient) {
    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="border-b border-gray-200 bg-white p-2 flex flex-wrap gap-1 items-center">
          <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" disabled>
              <Bold className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" disabled>
              <Italic className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" disabled>
              <UnderlineIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="min-h-[400px] bg-gray-50 flex items-center justify-center">
          <div className="text-gray-500">Loading editor...</div>
        </div>
      </div>
    );
  }

  if (!editor) {
    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="min-h-[400px] bg-gray-50 flex items-center justify-center">
          <div className="text-gray-500">Initializing editor...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div 
        className="border-b border-gray-200 bg-white p-2 flex flex-wrap gap-1 items-center"
        onKeyDown={(e) => {
          // Prevent form submission on any keyboard events in toolbar
          if (e.ctrlKey || e.metaKey) {
            e.stopPropagation();
            e.preventDefault();
          }
        }}
        onClick={(e) => {
          // Prevent form submission on any clicks in toolbar
          e.stopPropagation();
        }}
      >
        {/* Text Formatting */}
        <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
          <Button
            variant={editor.isActive('bold') ? 'default' : 'ghost'}
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              editor.chain().focus().toggleBold().run();
            }}
            className="h-8 w-8 p-0"
            type="button"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive('italic') ? 'default' : 'ghost'}
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              editor.chain().focus().toggleItalic().run();
            }}
            className="h-8 w-8 p-0"
            type="button"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive('underline') ? 'default' : 'ghost'}
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              editor.chain().focus().toggleUnderline().run();
            }}
            className="h-8 w-8 p-0"
            type="button"
          >
            <UnderlineIcon className="h-4 w-4" />
          </Button>
        </div>

        {/* Headings */}
        <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
          <Button
            variant={editor.isActive('heading', { level: 1 }) ? 'default' : 'ghost'}
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              editor.chain().focus().toggleHeading({ level: 1 }).run();
            }}
            className="h-8 w-8 p-0"
            type="button"
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'ghost'}
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              editor.chain().focus().toggleHeading({ level: 2 }).run();
            }}
            className="h-8 w-8 p-0"
            type="button"
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive('heading', { level: 3 }) ? 'default' : 'ghost'}
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              editor.chain().focus().toggleHeading({ level: 3 }).run();
            }}
            className="h-8 w-8 p-0"
            type="button"
          >
            <Heading3 className="h-4 w-4" />
          </Button>
        </div>

        {/* Lists */}
        <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
          <Button
            variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              editor.chain().focus().toggleBulletList().run();
            }}
            className="h-8 w-8 p-0"
            type="button"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              editor.chain().focus().toggleOrderedList().run();
            }}
            className="h-8 w-8 p-0"
            type="button"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
        </div>

        {/* Block Elements */}
        <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
          <Button
            variant={editor.isActive('blockquote') ? 'default' : 'ghost'}
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              editor.chain().focus().toggleBlockquote().run();
            }}
            className="h-8 w-8 p-0"
            type="button"
          >
            <Quote className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive('codeBlock') ? 'default' : 'ghost'}
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              editor.chain().focus().toggleCodeBlock().run();
            }}
            className="h-8 w-8 p-0"
            type="button"
          >
            <Code className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              insertTable();
            }}
            className="h-8 w-8 p-0"
            type="button"
          >
            <TableIcon className="h-4 w-4" />
          </Button>
        </div>

        {/* Text Alignment */}
        <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
          <Button
            variant={editor.isActive({ textAlign: 'left' }) ? 'default' : 'ghost'}
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              editor.chain().focus().setTextAlign('left').run();
            }}
            className="h-8 w-8 p-0"
            type="button"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h8a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h10a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </Button>
          <Button
            variant={editor.isActive({ textAlign: 'center' }) ? 'default' : 'ghost'}
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              editor.chain().focus().setTextAlign('center').run();
            }}
            className="h-8 w-8 p-0"
            type="button"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h8a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h10a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </Button>
          <Button
            variant={editor.isActive({ textAlign: 'right' }) ? 'default' : 'ghost'}
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              editor.chain().focus().setTextAlign('right').run();
            }}
            className="h-8 w-8 p-0"
            type="button"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h8a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h10a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </Button>
        </div>

        {/* Media & Links */}
        <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleImageUpload();
            }}
            className="h-8 w-8 p-0"
            type="button"
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsLinkDialogOpen(true);
            }}
            className="h-8 w-8 p-0"
            type="button"
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsEmbedDialogOpen(true);
            }}
            className="h-8 w-8 p-0"
            type="button"
          >
            <Youtube className="h-4 w-4" />
          </Button>
        </div>

        {/* History */}
        <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              editor.chain().focus().undo().run();
            }}
            disabled={!editor.can().undo()}
            className="h-8 w-8 p-0"
            type="button"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              editor.chain().focus().redo().run();
            }}
            disabled={!editor.can().redo()}
            className="h-8 w-8 p-0"
            type="button"
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>

        {/* Preview Mode Toggle */}
        <div className="flex items-center gap-1">
          <Button
            variant={previewMode ? 'default' : 'ghost'}
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setPreviewMode(!previewMode);
            }}
            className="h-8 px-3"
            type="button"
          >
            {previewMode ? (
              <>
                <EyeOff className="h-4 w-4 mr-1" />
                Hide Preview
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-1" />
                Show Preview
              </>
            )}
          </Button>
        </div>
      </div>
      
      {/* Editor Content */}
      {previewMode ? (
        <ContentPreviewRenderer content={content} />
      ) : (
        <div 
          onKeyDown={(e) => {
            // Prevent form submission on common editor shortcuts
            if (e.ctrlKey || e.metaKey) {
              e.stopPropagation();
              e.preventDefault();
            }
          }}
          onKeyPress={(e) => {
            // Additional prevention for keypress events
            if (e.ctrlKey || e.metaKey) {
              e.stopPropagation();
              e.preventDefault();
            }
          }}
        >
          <EditorContent 
            editor={editor} 
            className="min-h-[400px] focus:outline-none"
          />
        </div>
      )}

      {/* Dialogs */}
      <ImageUploadDialog
        isOpen={isImageDialogOpen}
        onClose={() => setIsImageDialogOpen(false)}
        onImageInsert={handleImageUploadComplete}
      />

      <LinkDialog
        isOpen={isLinkDialogOpen}
        onClose={() => setIsLinkDialogOpen(false)}
        onInsert={addLink}
        selectedText={editor ? editor.state.doc.textBetween(
          editor.state.selection.from,
          editor.state.selection.to
        ) : ''}
      />

      <EmbedDialog
        isOpen={isEmbedDialogOpen}
        onClose={() => setIsEmbedDialogOpen(false)}
        onInsert={addEmbed}
      />
    </div>
  );
};

export default TiptapEditor;
