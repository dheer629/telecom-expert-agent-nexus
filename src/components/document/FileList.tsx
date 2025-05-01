
import FileItem from './FileItem';

interface FileListProps {
  files: File[];
  uploadProgress: Record<string, number>;
  isUploading: boolean;
  onRemoveFile: (index: number) => void;
}

const FileList = ({ files, uploadProgress, isUploading, onRemoveFile }: FileListProps) => {
  if (files.length === 0) return null;
  
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">Selected Files</h4>
      <ul className="space-y-2">
        {files.map((file, index) => (
          <FileItem
            key={index}
            file={file}
            progress={uploadProgress[file.name]}
            isUploading={isUploading}
            onRemove={() => onRemoveFile(index)}
          />
        ))}
      </ul>
    </div>
  );
};

export default FileList;
