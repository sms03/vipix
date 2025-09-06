import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileVideo, FileImage } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  className?: string;
}

export const FileUpload = ({ onFileSelect, className }: FileUploadProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp', '.heic', '.heif'],
      'video/*': ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mkv', '.m4v']
    },
    multiple: false
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative overflow-hidden rounded-xl border-2 border-dashed transition-all duration-300 cursor-pointer group",
        "bg-gradient-card shadow-card-hover hover:shadow-tech-hover",
        isDragActive 
          ? "border-primary bg-primary/5 scale-[1.02]" 
          : "border-border hover:border-primary/50",
        className
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="mb-6 relative">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-primary shadow-tech mb-4 group-hover:scale-110 transition-transform duration-300">
            <Upload className="w-8 h-8 text-primary-foreground" />
          </div>
          <div className="absolute -bottom-2 -right-2 flex space-x-1">
            <div className="w-6 h-6 rounded-full bg-tech-blue/20 flex items-center justify-center">
              <FileVideo className="w-3 h-3 text-tech-blue" />
            </div>
            <div className="w-6 h-6 rounded-full bg-tech-teal/20 flex items-center justify-center">
              <FileImage className="w-3 h-3 text-tech-teal" />
            </div>
          </div>
        </div>
        
        <h3 className="text-xl font-semibold text-foreground mb-2">
          {isDragActive ? 'Drop your file here' : 'Upload Media File'}
        </h3>
        <p className="text-muted-foreground mb-4 max-w-sm">
          Drag and drop your video or photo file, or click to browse
        </p>
        <div className="flex flex-wrap justify-center gap-2 text-xs text-tech-gray">
          <span className="px-2 py-1 bg-secondary rounded-md">Videos: MP4, AVI, MOV, WEBM</span>
          <span className="px-2 py-1 bg-secondary rounded-md">Photos: JPEG, PNG, HEIC, GIF</span>
        </div>
      </div>
    </div>
  );
};