import { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { MediaPreview } from '@/components/MediaPreview';
import { MetadataDisplay, createVideoMetadata, createImageMetadata } from '@/components/MetadataDisplay';
import { useMediaAnalysis } from '@/hooks/useMediaAnalysis';
import { Button } from '@/components/ui/button';
import { Loader2, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCompact } from '@/hooks/use-compact';
import { useViewportScale } from '@/hooks/useViewportScale';

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const { analyzeFile, isAnalyzing, error } = useMediaAnalysis();
  const { toast } = useToast();
  const compact = useCompact();
  const scale = useViewportScale(1280, 800, 0.65);

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setAnalysisResult(null);
    
    try {
      const result = await analyzeFile(file);
      setAnalysisResult(result);
      toast({
        title: "Analysis Complete",
        description: `Successfully analyzed ${file.name}`,
      });
    } catch (err) {
      toast({
        title: "Analysis Failed",
        description: error || "Failed to analyze the file",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setAnalysisResult(null);
  };

  const getMetadataSections = () => {
    if (!analysisResult) return [];
    
    if (analysisResult.type === 'video') {
      return createVideoMetadata(analysisResult.metadata);
    } else {
      return createImageMetadata(analysisResult.metadata, analysisResult.exifData);
    }
  };

  return (
    <div className={"relative flex flex-col min-h-dvh bg-transparent overflow-hidden " + (compact ? 'compact' : '')}>
      <div className={"relative z-10 flex-1 container mx-auto px-4 py-8 md:py-12 lg:py-16 flex flex-col gap-6 md:gap-10 vh-adapt origin-top " + (compact ? 'py-4 gap-4 md:py-6' : '')}
       style={{ '--ui-scale': scale } as React.CSSProperties}>
    <div className="transform-gpu" style={{ scale: 'var(--ui-scale)' }}>
  {!selectedFile ? (
          <div className={"flex-1 flex flex-col items-center justify-center text-center gap-8 md:gap-12 " + (compact ? 'gap-6 md:gap-8' : '')}>
            <div className="space-y-6 max-w-4xl mx-auto px-2">
              <h1 className={"hero-title font-bold tracking-tight flex flex-col items-center gap-4 " + (compact ? 'scale-[0.85] gap-3' : '')}>
                <span className="sr-only">Vipix</span>
                {/* Brand Logo in circular frame */}
                <div className={(compact ? 'w-28 h-28' : 'w-40 h-40 md:w-48 md:h-48') + ' relative rounded-full p-[3px] bg-gradient-to-br from-white/40 via-white/15 to-transparent shadow-[0_0_0_1px_rgba(255,255,255,0.15)] backdrop-blur-sm'}>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/25 via-white/10 to-transparent blur-xl opacity-40" aria-hidden></div>
                  <div className="w-full h-full rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center overflow-hidden ring-1 ring-white/15">
                    <img
                      src="/vipix.png"
                      alt="Vipix logo"
                      className="w-full h-full object-contain select-none pointer-events-none"
                      draggable={false}
                    />
                  </div>
                </div>
                <span className="font-extrabold tracking-tight leading-tight text-balance text-black">
                  Vipix
                </span>
              </h1>
              <p className={"hero-sub text-muted-foreground max-w-3xl mx-auto leading-relaxed font-text " + (compact ? 'opacity-90' : '')}>
                Extract detailed technical information from your videos and photos. Get metadata, EXIF data, and comprehensive file analysis in seconds.
              </p>
            </div>
            <div className="w-full max-w-3xl mx-auto">
              <div className={"bg-card/60 backdrop-blur-sm rounded-3xl shadow-elevated border border-border/50 p-6 md:p-8 " + (compact ? 'p-4 md:p-5' : '')}>
                <FileUpload onFileSelect={handleFileSelect} />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col gap-4 md:gap-6 min-h-0">
            {/* Action Bar */}
            <div className="flex items-center justify-between flex-wrap gap-4 action-bar">
              <h2 className={compact ? 'text-xl md:text-2xl font-bold text-foreground' : 'text-2xl md:text-3xl font-bold text-foreground'}>Analysis Results</h2>
              <Button
                onClick={handleReset}
                variant="outline"
                className={"flex items-center space-x-2 h-10 md:h-11 px-4 md:px-6 rounded-xl font-medium transition-all duration-200 hover:shadow-tech-hover " + (compact ? 'h-9 px-4 text-sm md:h-10' : '')}
              >
                <RotateCcw className="w-4 h-4" />
                <span>Analyze New File</span>
              </Button>
            </div>

            <div className="flex flex-1 flex-col lg:flex-row gap-6 md:gap-8 min-h-0">
              {/* Media Preview */}
              <div className="flex-1 flex flex-col gap-4 min-h-0">
                <h3 className={compact ? 'text-base md:text-lg font-semibold text-foreground shrink-0' : 'text-lg md:text-xl font-semibold text-foreground shrink-0'}>Preview</h3>
                <div className={"flex-1 bg-card/80 backdrop-blur-sm rounded-2xl shadow-elevated border border-border/50 overflow-hidden flex items-center justify-center p-2 " + (compact ? 'p-1.5' : '')}>
                  <MediaPreview
                    file={selectedFile}
                    type={selectedFile.type.startsWith('video/') ? 'video' : 'image'}
                    className="w-full h-full"
                  />
                </div>
              </div>

              {/* Technical Details */}
              <div className="flex-1 flex flex-col gap-4 min-h-0">
                <h3 className={compact ? 'text-base md:text-lg font-semibold text-foreground shrink-0' : 'text-lg md:text-xl font-semibold text-foreground shrink-0'}>Technical Details</h3>
                <div className={"flex-1 overflow-auto details-scroll scrollbar-tech-thin pr-1 " + (compact ? 'text-sm' : '')}>
                  {isAnalyzing ? (
                    <div className="flex items-center justify-center h-full bg-card/80 backdrop-blur-sm rounded-2xl shadow-elevated border border-border/50">
                      <div className="text-center p-8">
                        <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-6" />
                        <p className="text-muted-foreground text-base md:text-lg font-medium">Analyzing file...</p>
                      </div>
                    </div>
                  ) : analysisResult ? (
                    <MetadataDisplay
                      metadata={getMetadataSections()}
                      fileType={analysisResult.type}
                      fileName={selectedFile.name}
                      className={compact ? 'pb-4 space-y-6' : 'pb-6'}
                    />
                  ) : error ? (
                    <div className="p-6 bg-destructive/10 border border-destructive/20 rounded-2xl">
                      <p className="text-destructive font-medium text-lg">Analysis failed: {error}</p>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
  )}
  </div>
      </div>
    </div>
  );
};

export default Index;
