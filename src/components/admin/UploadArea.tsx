
import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import FileUploader from './FileUploader';
import UrlInput from './UrlInput';
import PlaceholderImages from './PlaceholderImages';

interface UploadAreaProps {
  placeholder: string;
  onImageUpload: (url: string) => void;
}

const UploadArea: React.FC<UploadAreaProps> = ({ placeholder, onImageUpload }) => {
  const [isUploading, setIsUploading] = useState(false);

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
      <p className="text-sm text-gray-600 mb-4">{placeholder}</p>
      
      <div className="space-y-3">
        <FileUploader
          onUpload={onImageUpload}
          isUploading={isUploading}
          setIsUploading={setIsUploading}
        />
        
        <div className="flex items-center text-xs text-gray-500">
          <div className="flex-1 border-t border-gray-300" />
          <span className="px-2">or</span>
          <div className="flex-1 border-t border-gray-300" />
        </div>
        
        <UrlInput onUrlSubmit={onImageUpload} />
        
        <PlaceholderImages onImageSelect={onImageUpload} />
      </div>
    </div>
  );
};

export default UploadArea;
