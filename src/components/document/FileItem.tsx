
import { FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { formatFileSize } from '@/utils/helpers';

interface FileItemProps {
  file: File;
  progress?: number;
  isUploading: boolean;
  onRemove: () => void;
}

const FileItem = ({ file, progress = 0, isUploading, onRemove }: FileItemProps) => {
  return (
    <li className="flex items-center justify-between p-2 border rounded-md">
      <div className="flex items-center">
        <FileText className="w-4 h-4 mr-2 text-telecom-primary" />
        <span className="text-sm truncate max-w-[200px]">{file.name}</span>
        <span className="text-xs text-gray-400 ml-2">
          ({formatFileSize(file.size)})
        </span>
      </div>
      {isUploading ? (
        <div className="w-24">
          <Progress value={progress || 0} className="h-2" />
        </div>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={onRemove}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </li>
  );
};

export default FileItem;
