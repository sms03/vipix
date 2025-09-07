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
        "group relative cursor-pointer select-none",
        "[--ring-color:theme(colors.primary.DEFAULT)]",
        className
      )}
      aria-label="Upload media file"
    >
      {/* Gradient border frame */}
      <div className={cn(
        "relative rounded-3xl p-[1px] transition-all duration-500",
        "before:absolute before:inset-0 before:rounded-3xl before:p-[1px] before:bg-gradient-to-br before:from-primary/70 before:via-tech-purple/60 before:to-primary/40 before:opacity-60 before:blur-sm before:pointer-events-none",
        isDragActive && "before:opacity-90 scale-[1.01]"
      )}>
        <div className={cn(
          "relative h-full w-full rounded-[calc(theme(borderRadius.3xl)_-_2px)]",
          "bg-gradient-to-br from-card/70 via-card/50 to-card/30 backdrop-blur-xl",
          "shadow-elevated overflow-hidden",
          "transition-all duration-500",
          isDragActive ? "ring-2 ring-primary/60" : "hover:ring-1 hover:ring-primary/30"
        )}>
          {/* Subtle pattern */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.08] bg-[radial-gradient(circle_at_25%_25%,theme(colors.primary.DEFAULT)/0.7,transparent_60%)]" />

          <input {...getInputProps()} />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center gap-8 px-10 py-16 md:py-20 text-center min-h-[410px]">
              {/* Icon cluster */}
              <div className="relative flex items-center justify-center">
                <div className={cn(
                  "flex items-center justify-center rounded-2xl bg-gradient-primary shadow-elevated transition-all",
                  "w-24 h-24 md:w-28 md:h-28 group-hover:scale-105",
                  isDragActive && "scale-110"
                )}>
                  <Upload className="w-11 h-11 md:w-12 md:h-12 text-primary-foreground" />
                </div>
                <div className="absolute -bottom-3 flex gap-2">
                  <div className="flex items-center justify-center w- nine h-9 rounded-xl bg-tech-blue/15 border border-tech-blue/30 backdrop-blur-md shadow-sm">
                    <FileVideo className="w-4 h-4 text-tech-blue" />
                  </div>
                  <div className="flex items-center justify-center w- nine h-9 rounded-xl bg-tech-purple/15 border border-tech-purple/30 backdrop-blur-md shadow-sm">
                    <FileImage className="w-4 h-4 text-tech-purple" />
                  </div>
                </div>
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-3 max-w-xl mx-auto">
                <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
                  {isDragActive ? 'Drop to Analyze' : 'Upload Media'}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-base md:text-lg font-text">
                  Drag & drop a video or photo, or click to browse. We extract codecs, EXIF, resolution and more.
                </p>
              </div>

              {/* File type badges */}
              <div className="flex flex-wrap justify-center gap-3 md:gap-4 font-medium text-xs md:text-sm">
                <span className="px-4 py-2 rounded-xl bg-primary/10 border border-primary/25 text-primary tracking-wide backdrop-blur-sm">
                  Video: MP4 • MOV • WEBM
                </span>
                <span className="px-4 py-2 rounded-xl bg-tech-purple/10 border border-tech-purple/30 text-tech-purple tracking-wide backdrop-blur-sm">
                  Image: JPG • PNG • HEIC • GIF
                </span>
              </div>
            </div>

            {/* Drag overlay */}
            <div className={cn(
              "pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300",
              "bg-gradient-to-br from-primary/15 via-tech-purple/15 to-primary/10 backdrop-blur-sm",
              isDragActive && "opacity-100"
            )} />
        </div>
      </div>
    </div>
  );
};