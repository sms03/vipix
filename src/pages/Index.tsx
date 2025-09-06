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
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-primary shadow-tech">
              <Zap className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Media Analyzer
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Extract detailed technical information from your videos and photos. 
            Get metadata, EXIF data, and comprehensive file analysis in seconds.
          </p>
        </header>

        {!selectedFile ? (
          /* Upload Section */
          <div className="max-w-2xl mx-auto">
            <FileUpload onFileSelect={handleFileSelect} />
          </div>
        ) : (
          /* Analysis Section */
          <div className="space-y-8">
            {/* Action Bar */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-foreground">Analysis Results</h2>
              <Button 
                onClick={handleReset}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Analyze New File</span>
              </Button>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Media Preview */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Preview</h3>
                <MediaPreview
                  file={selectedFile}
                  type={selectedFile.type.startsWith('video/') ? 'video' : 'image'}
                  className="aspect-video"
                />
              </div>

              {/* Analysis Status */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Technical Details</h3>
                {isAnalyzing ? (
                  <div className="flex items-center justify-center p-12 bg-gradient-card rounded-xl shadow-card-hover">
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
                      <p className="text-muted-foreground">Analyzing file...</p>
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
                  <div className="p-6 bg-destructive/10 border border-destructive/20 rounded-xl">
                    <p className="text-destructive font-medium">Analysis failed: {error}</p>
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
