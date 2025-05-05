
import { FilePlus } from 'lucide-react';
import { ACCEPTED_FILE_TYPES } from '@/types/DocumentTypes';
import { useState } from 'react';

interface UploadZoneProps {
  onClick: () => void;
  onDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
}

const UploadZone = ({ onClick, onDrop }: UploadZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (onDrop) {
      onDrop(e);
    }
  };

  return (
    <div 
      className={`border-2 ${isDragging ? 'border-telecom-primary bg-telecom-light' : 'border-dashed border-gray-300'} 
      rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors duration-300`}
      onClick={onClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <FilePlus className={`mx-auto h-12 w-12 ${isDragging ? 'text-telecom-primary' : 'text-gray-400'}`} />
      <p className="mt-4 text-sm font-medium text-gray-700">
        {isDragging ? 'Drop files here' : 'Click to upload or drag and drop'}
      </p>
      <p className="text-xs text-gray-500 mt-2">
        DOCX, DOC, PDF, XLSX, XLSM, TXT
      </p>
      <p className="text-xs text-telecom-primary mt-1">
        Your files will be processed locally in your browser
      </p>
    </div>
  );
};

export default UploadZone;
