
import { FilePlus } from 'lucide-react';
import { ACCEPTED_FILE_TYPES } from '@/types/DocumentTypes';

interface UploadZoneProps {
  onClick: () => void;
}

const UploadZone = ({ onClick }: UploadZoneProps) => {
  return (
    <div 
      className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={onClick}
    >
      <input
        id="file-upload"
        type="file"
        className="hidden"
        multiple
        accept={ACCEPTED_FILE_TYPES.join(',')}
      />
      <FilePlus className="mx-auto h-12 w-12 text-gray-400" />
      <p className="mt-2 text-sm text-gray-500">
        Click to upload or drag and drop
      </p>
      <p className="text-xs text-gray-400">
        DOCX, DOC, PDF, XLSX, XLSM, TXT
      </p>
    </div>
  );
};

export default UploadZone;
