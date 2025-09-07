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
        "relative overflow-hidden rounded-3xl border-2 border-dashed transition-all duration-500 cursor-pointer group",
        "bg-card/50 backdrop-blur-sm shadow-elevated hover:shadow-tech-hover",
        isDragActive 
          ? "border-primary bg-gradient-primary/5 scale-[1.02]" 
          : "border-border/50 hover:border-primary/60",
        className
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center p-16 text-center">
        <div className="mb-8 relative flex justify-center">
          <div className="flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-primary shadow-elevated mb-6 group-hover:scale-110 transition-all duration-500">
            <Upload className="w-10 h-10 text-primary-foreground" />
          </div>
          <div className="absolute -bottom-2 -right-2 flex items-center space-x-1">
            <div className="w-8 h-8 rounded-xl bg-tech-blue/10 backdrop-blur-sm flex items-center justify-center border border-tech-blue/20 shadow-sm">
              <FileVideo className="w-4 h-4 text-tech-blue" />
            </div>
            <div className="w-8 h-8 rounded-xl bg-tech-purple/10 backdrop-blur-sm flex items-center justify-center border border-tech-purple/20 shadow-sm">
              <FileImage className="w-4 h-4 text-tech-purple" />
            </div>
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-foreground mb-4">
          {isDragActive ? 'Drop your file here' : 'Upload Media File'}
        </h3>
        <p className="text-muted-foreground mb-8 max-w-md text-lg leading-relaxed">
          Drag and drop your video or photo file, or click to browse and analyze
        </p>
        <div className="flex flex-wrap justify-center gap-3 text-sm font-medium">
          <span className="px-4 py-2 bg-tech-surface/80 backdrop-blur-sm text-tech-blue rounded-xl border border-border/50">Videos: MP4, AVI, MOV, WEBM</span>
          <span className="px-4 py-2 bg-tech-surface/80 backdrop-blur-sm text-tech-purple rounded-xl border border-border/50">Photos: JPEG, PNG, HEIC, GIF</span>
        </div>
      </div>
    </div>
  );
};