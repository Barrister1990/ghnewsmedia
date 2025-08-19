import dynamic from 'next/dynamic';
import { ComponentProps } from 'react';

// Dynamically import TiptapEditor with no SSR
const TiptapEditor = dynamic(
  () => import('./TiptapEditor'),
  {
    ssr: false,
    loading: () => (
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="border-b border-gray-200 bg-white p-2 flex flex-wrap gap-1 items-center">
          <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
            <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
            <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
            <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        <div className="min-h-[400px] bg-gray-50 flex items-center justify-center">
          <div className="text-gray-500">Loading editor...</div>
        </div>
      </div>
    ),
  }
);

// Type for the props
type TiptapEditorProps = ComponentProps<typeof TiptapEditor>;

const TiptapEditorWrapper: React.FC<TiptapEditorProps> = (props) => {
  return <TiptapEditor {...props} />;
};

export default TiptapEditorWrapper;
