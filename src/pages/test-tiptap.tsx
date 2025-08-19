import dynamic from 'next/dynamic';
import { useState } from 'react';

// Dynamically import TiptapEditor to prevent SSR issues
const TiptapEditor = dynamic(
  () => import('@/components/admin/TiptapEditor'),
  {
    ssr: false,
    loading: () => (
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="min-h-[400px] bg-gray-50 flex items-center justify-center">
          <div className="text-gray-500">Loading Tiptap Editor...</div>
        </div>
      </div>
    ),
  }
);

const TestTiptapPage = () => {
  const [content, setContent] = useState('<h1>Welcome to Tiptap Editor!</h1><p>This is a test page to verify the editor is working correctly.</p>');

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Tiptap Editor Test</h1>
          <p className="text-gray-600">
            Test the new WYSIWYG editor functionality. Try formatting text, adding images, links, and more.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Editor</h2>
            <TiptapEditor
              content={content}
              onChange={setContent}
              placeholder="Start writing your content..."
            />
          </div>

          {/* Preview */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">HTML Output</h2>
            <div className="bg-white border border-gray-200 rounded-lg p-4 min-h-[400px] overflow-auto">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap">{content}</pre>
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Test Instructions</h3>
          <ul className="text-blue-800 space-y-1">
            <li>• Try typing and formatting text (bold, italic, underline)</li>
            <li>• Test headings (H1, H2, H3)</li>
            <li>• Create lists (bullet and numbered)</li>
            <li>• Add blockquotes and code blocks</li>
            <li>• Test text alignment options</li>
            <li>• Try adding images and links</li>
            <li>• Test table creation</li>
            <li>• Use keyboard shortcuts (Ctrl+B, Ctrl+I, Ctrl+U)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TestTiptapPage;
