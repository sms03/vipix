import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  className?: string;
}

export const FileUpload = ({ onFileSelect, className }: FileUploadProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) onFileSelect(acceptedFiles[0]);
    },
    [onFileSelect]
  );

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
        'group relative cursor-pointer rounded-2xl border border-dashed border-border/60',
        'bg-card/60 backdrop-blur-sm p-8 md:p-10 text-center select-none transition',
        'hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
        isDragActive && 'border-primary/70 bg-primary/5',
        className
      )}
      aria-label="Upload media file"
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-5 md:gap-6 max-w-xl mx-auto">
        <div
          className={cn(
            'flex items-center justify-center rounded-xl size-20 md:size-24 transition shadow-sm',
            'bg-gradient-to-br from-primary/80 via-primary/70 to-primary/60 text-primary-foreground',
            'ring-1 ring-inset ring-primary/40 group-hover:scale-105',
            isDragActive && 'scale-110'
          )}
        >
          <Upload className="w-10 h-10 md:w-11 md:h-11" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl md:text-2xl font-semibold tracking-tight">
            {isDragActive ? 'Drop to Analyze' : 'Upload Media'}
          </h3>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed px-2">
            Drag & drop a video or image, or click to choose a file.
          </p>
        </div>
        <p className="text-xs md:text-sm text-muted-foreground/80 font-medium tracking-wide">
          <span className="font-semibold text-foreground/90">Video:</span> MP4 · MOV · WEBM · MKV &nbsp;·&nbsp; <span className="font-semibold text-foreground/90">Image:</span> JPG · PNG · HEIC · GIF
        </p>
      </div>
    </div>
  );
};