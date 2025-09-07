import { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { MediaPreview } from '@/components/MediaPreview';
import { MetadataDisplay, createVideoMetadata, createImageMetadata } from '@/components/MetadataDisplay';
import { useMediaAnalysis } from '@/hooks/useMediaAnalysis';
import { Button } from '@/components/ui/button';
import { Loader2, RotateCcw, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const { analyzeFile, isAnalyzing, error } = useMediaAnalysis();
  const { toast } = useToast();

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
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="flex items-center justify-center mb-8">
            <div className="relative">
              <div className="flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-primary shadow-elevated">
                <Zap className="w-10 h-10 text-primary-foreground" />
              </div>
              <div className="absolute -inset-1 bg-gradient-primary rounded-3xl blur opacity-20"></div>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 tracking-tight">
            Media Analyzer
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-text">
            Extract detailed technical information from your videos and photos. 
            Get metadata, EXIF data, and comprehensive file analysis in seconds.
          </p>
        </header>

        {!selectedFile ? (
          /* Upload Section */
          <div className="max-w-3xl mx-auto">
            <div className="bg-card/50 backdrop-blur-sm rounded-3xl shadow-elevated border border-border/50 p-8">
              <FileUpload onFileSelect={handleFileSelect} />
            </div>
          </div>
        ) : (
          /* Analysis Section */
          <div className="space-y-8">
            {/* Action Bar */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-foreground">Analysis Results</h2>
              <Button 
                onClick={handleReset}
                variant="outline"
                className="flex items-center space-x-2 h-11 px-6 rounded-xl font-medium transition-all duration-200 hover:shadow-tech-hover"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Analyze New File</span>
              </Button>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Media Preview */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-foreground">Preview</h3>
                <div className="bg-card/80 backdrop-blur-sm rounded-2xl shadow-elevated border border-border/50 overflow-hidden">
                  <MediaPreview
                    file={selectedFile}
                    type={selectedFile.type.startsWith('video/') ? 'video' : 'image'}
                    className="aspect-video"
                  />
                </div>
              </div>

              {/* Analysis Status */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-foreground">Technical Details</h3>
                {isAnalyzing ? (
                  <div className="flex items-center justify-center p-16 bg-card/80 backdrop-blur-sm rounded-2xl shadow-elevated border border-border/50">
                    <div className="text-center">
                      <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-6" />
                      <p className="text-muted-foreground text-lg font-medium">Analyzing file...</p>
                    </div>
                  </div>
                ) : analysisResult ? (
                  <div className="lg:col-span-2">
                    <MetadataDisplay
                      metadata={getMetadataSections()}
                      fileType={analysisResult.type}
                      fileName={selectedFile.name}
                    />
                  </div>
                ) : error ? (
                  <div className="p-6 bg-destructive/10 border border-destructive/20 rounded-2xl">
                    <p className="text-destructive font-medium text-lg">Analysis failed: {error}</p>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
