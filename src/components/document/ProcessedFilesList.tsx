
import { Check } from 'lucide-react';

interface ProcessedFilesListProps {
  files: string[];
}

const ProcessedFilesList = ({ files }: ProcessedFilesListProps) => {
  if (files.length === 0) return null;
  
  return (
    <div className="space-y-2 bg-green-50 p-3 rounded-md border border-green-100">
      <h4 className="text-sm font-medium text-green-700 flex items-center">
        <Check className="w-4 h-4 mr-2" />
        Recently Processed
      </h4>
      <ul className="space-y-1 max-h-[120px] overflow-y-auto pr-2">
        {files.map((fileName, index) => (
          <li key={index} className="flex items-center text-sm text-green-600 bg-white/60 p-2 rounded border border-green-100">
            <Check className="w-3 h-3 mr-2 flex-shrink-0" />
            <span className="truncate">{fileName}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProcessedFilesList;
