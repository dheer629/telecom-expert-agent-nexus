
import { FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { formatFileSize } from '@/utils/helpers';
import { DocumentFile } from '@/types/DocumentTypes';

interface FileItemProps {
  file: DocumentFile;
  progress?: number;
  isUploading: boolean;
  onRemove: () => void;
}

const FileItem = ({ file, progress = 0, isUploading, onRemove }: FileItemProps) => {
  return (
    <li className="flex items-center justify-between p-3 border rounded-md bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center overflow-hidden">
        <div className="bg-telecom-light p-2 rounded-md mr-3">
          <FileText className="w-5 h-5 text-telecom-primary" />
        </div>
        <div className="overflow-hidden">
          <span className="text-sm font-medium text-gray-700 truncate max-w-[150px] block">{file.name}</span>
          <span className="text-xs text-gray-400">
            {formatFileSize(file.size)}
          </span>
        </div>
      </div>
      {isUploading ? (
        <div className="w-32">
          <Progress value={progress || 0} className="h-2" />
          <span className="text-xs text-telecom-primary mt-1 inline-block">
            {progress}%
          </span>
        </div>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 hover:bg-red-50 hover:text-red-500 rounded-full"
          onClick={onRemove}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </li>
  );
};

export default FileItem;
