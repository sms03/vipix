import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileVideo, FileImage, Info, Camera, Monitor, Clock, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetadataItem {
  label: string;
  value: string | number;
  unit?: string;
  type?: 'text' | 'technical' | 'size' | 'time';
}

interface MetadataSection {
  title: string;
  icon: React.ReactNode;
  items: MetadataItem[];
}

interface MetadataDisplayProps {
  metadata: MetadataSection[];
  fileType: 'image' | 'video';
  fileName: string;
  className?: string;
}

export const MetadataDisplay = ({ metadata, fileType, fileName, className }: MetadataDisplayProps) => {
  const formatValue = (item: MetadataItem) => {
    const value = typeof item.value === 'number' ? item.value.toLocaleString() : item.value;
    return item.unit ? `${value} ${item.unit}` : value;
  };

  const getValueStyle = (type?: string) => {
    switch (type) {
      case 'technical':
        return 'font-mono text-tech-blue text-sm';
      case 'size':
        return 'font-mono text-tech-purple text-sm';
      case 'time':
        return 'font-mono text-primary text-sm';
      default:
        return 'text-foreground';
    }
  };

  return (
    <div className={cn("space-y-8", className)}>
      {/* Header */}
      <div className="flex items-center space-x-4 p-8 bg-card/80 backdrop-blur-sm rounded-3xl shadow-elevated border border-border/50">
        <div className="relative">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-primary shadow-tech">
            {fileType === 'video' ? (
              <FileVideo className="w-8 h-8 text-primary-foreground" />
            ) : (
              <FileImage className="w-8 h-8 text-primary-foreground" />
            )}
          </div>
          <div className="absolute -inset-1 bg-gradient-primary rounded-2xl blur opacity-20"></div>
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-foreground mb-2">{fileName}</h2>
          <Badge variant="secondary" className="text-sm font-medium px-3 py-1">
            {fileType.toUpperCase()} Analysis Complete
          </Badge>
        </div>
      </div>

      {/* Metadata Sections */}
      <div className="grid gap-6 md:grid-cols-2">
        {metadata.map((section, index) => (
          <Card key={index} className="bg-card/80 backdrop-blur-sm shadow-elevated hover:shadow-tech-hover transition-all duration-500 border border-border/50 rounded-2xl">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-3 text-foreground">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-primary/10 border border-primary/20">
                  {section.icon}
                </div>
                <span className="text-xl font-semibold">{section.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {section.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex justify-between items-center py-3 border-b border-border/30 last:border-b-0">
                  <span className="text-muted-foreground font-medium">{item.label}</span>
                  <span className={cn("font-semibold", getValueStyle(item.type))}>
                    {formatValue(item)}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Preset section generators
export const createVideoMetadata = (videoData: any): MetadataSection[] => [
  {
    title: 'File Information',
    icon: <Info className="w-4 h-4 text-primary" />,
    items: [
      { label: 'Format', value: videoData.format || 'Unknown', type: 'technical' },
      { label: 'Container', value: videoData.container || 'Unknown', type: 'technical' },
      { label: 'File Size', value: (videoData.size / 1024 / 1024).toFixed(2), unit: 'MB', type: 'size' },
      { label: 'Duration', value: videoData.duration || 'Unknown', type: 'time' },
    ]
  },
  {
    title: 'Video Properties',
    icon: <Monitor className="w-4 h-4 text-primary" />,
    items: [
      { label: 'Codec', value: videoData.videoCodec || 'Unknown', type: 'technical' },
      { label: 'Resolution', value: `${videoData.width || '?'} × ${videoData.height || '?'}`, type: 'technical' },
      { label: 'Aspect Ratio', value: videoData.aspectRatio || 'Unknown' },
      { label: 'Frame Rate', value: videoData.frameRate || 'Unknown', unit: 'fps', type: 'technical' },
      { label: 'Bitrate', value: videoData.bitrate || 'Unknown', unit: 'kbps', type: 'technical' },
    ]
  },
  {
    title: 'Audio Properties',
    icon: <Zap className="w-4 h-4 text-primary" />,
    items: [
      { label: 'Audio Codec', value: videoData.audioCodec || 'Unknown', type: 'technical' },
      { label: 'Audio Bitrate', value: videoData.audioBitrate || 'Unknown', unit: 'kbps', type: 'technical' },
      { label: 'Sample Rate', value: videoData.sampleRate || 'Unknown', unit: 'Hz', type: 'technical' },
      { label: 'Channels', value: videoData.channels || 'Unknown' },
    ]
  }
];

export const createImageMetadata = (imageData: any, exifData?: any): MetadataSection[] => {
  const sections: MetadataSection[] = [
    {
      title: 'File Information',
      icon: <Info className="w-4 h-4 text-primary" />,
      items: [
        { label: 'Format', value: imageData.format || 'Unknown', type: 'technical' },
        { label: 'File Size', value: (imageData.size / 1024 / 1024).toFixed(2), unit: 'MB', type: 'size' },
        { label: 'Resolution', value: `${imageData.width || '?'} × ${imageData.height || '?'}`, type: 'technical' },
        { label: 'Aspect Ratio', value: imageData.aspectRatio || 'Unknown' },
        { label: 'Color Depth', value: imageData.colorDepth || 'Unknown', unit: 'bits', type: 'technical' },
      ]
    }
  ];

  if (exifData && Object.keys(exifData).length > 0) {
    sections.push({
      title: 'Camera Information',
      icon: <Camera className="w-4 h-4 text-primary" />,
      items: [
        { label: 'Camera Make', value: exifData.Make || 'Unknown' },
        { label: 'Camera Model', value: exifData.Model || 'Unknown' },
        { label: 'Lens Model', value: exifData.LensModel || 'Unknown' },
        { label: 'Date Taken', value: exifData.DateTime || 'Unknown', type: 'time' },
      ]
    });

    if (exifData.FNumber || exifData.ExposureTime || exifData.ISO) {
      sections.push({
        title: 'Camera Settings',
        icon: <Clock className="w-4 h-4 text-primary" />,
        items: [
          { label: 'Aperture', value: exifData.FNumber ? `f/${exifData.FNumber}` : 'Unknown', type: 'technical' },
          { label: 'Shutter Speed', value: exifData.ExposureTime || 'Unknown', type: 'technical' },
          { label: 'ISO', value: exifData.ISO || 'Unknown', type: 'technical' },
          { label: 'Focal Length', value: exifData.FocalLength ? `${exifData.FocalLength}mm` : 'Unknown', type: 'technical' },
        ]
      });
    }
  }

  return sections;
};