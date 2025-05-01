
import { Check } from 'lucide-react';

interface ProcessedFilesListProps {
  files: string[];
}

const ProcessedFilesList = ({ files }: ProcessedFilesListProps) => {
  if (files.length === 0) return null;
  
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-green-600">Recently Processed</h4>
      <ul className="space-y-1">
        {files.map((fileName, index) => (
          <li key={index} className="flex items-center text-sm text-green-600">
            <Check className="w-4 h-4 mr-2" />
            <span className="truncate">{fileName}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProcessedFilesList;
