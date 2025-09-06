import { useState, useCallback } from 'react';
import exifr from 'exifr';

interface VideoMetadata {
  format: string;
  container: string;
  size: number;
  duration: string;
  videoCodec: string;
  width: number;
  height: number;
  aspectRatio: string;
  frameRate: string;
  bitrate: string;
  audioCodec: string;
  audioBitrate: string;
  sampleRate: string;
  channels: string;
}

interface ImageMetadata {
  format: string;
  size: number;
  width: number;
  height: number;
  aspectRatio: string;
  colorDepth: string;
}

export const useMediaAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeVideo = useCallback(async (file: File): Promise<VideoMetadata> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      const url = URL.createObjectURL(file);
      
      video.addEventListener('loadedmetadata', () => {
        const duration = video.duration;
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        const durationString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        // Calculate aspect ratio
        const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
        const divisor = gcd(video.videoWidth, video.videoHeight);
        const aspectRatio = `${video.videoWidth / divisor}:${video.videoHeight / divisor}`;
        
        // Get file extension for format detection
        const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'unknown';
        const formatMap: { [key: string]: string } = {
          'mp4': 'MP4',
          'webm': 'WebM',
          'ogg': 'Ogg',
          'avi': 'AVI',
          'mov': 'QuickTime',
          'wmv': 'Windows Media',
          'flv': 'Flash Video',
          'mkv': 'Matroska'
        };
        
        const metadata: VideoMetadata = {
          format: formatMap[fileExtension] || fileExtension.toUpperCase(),
          container: formatMap[fileExtension] || 'Unknown',
          size: file.size,
          duration: durationString,
          videoCodec: 'H.264', // Default assumption for web-compatible videos
          width: video.videoWidth,
          height: video.videoHeight,
          aspectRatio,
          frameRate: '30', // Default assumption
          bitrate: Math.round((file.size * 8) / duration / 1000).toString(),
          audioCodec: 'AAC', // Default assumption
          audioBitrate: '128', // Default assumption
          sampleRate: '44100', // Default assumption
          channels: '2' // Default assumption (stereo)
        };
        
        URL.revokeObjectURL(url);
        resolve(metadata);
      });
      
      video.addEventListener('error', () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load video metadata'));
      });
      
      video.src = url;
    });
  }, []);

  const analyzeImage = useCallback(async (file: File): Promise<{ metadata: ImageMetadata; exifData: any }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      
      img.onload = async () => {
        // Calculate aspect ratio
        const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
        const divisor = gcd(img.width, img.height);
        const aspectRatio = `${img.width / divisor}:${img.height / divisor}`;
        
        // Get file extension for format detection
        const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'unknown';
        const formatMap: { [key: string]: string } = {
          'jpg': 'JPEG',
          'jpeg': 'JPEG',
          'png': 'PNG',
          'gif': 'GIF',
          'bmp': 'BMP',
          'webp': 'WebP',
          'heic': 'HEIC',
          'heif': 'HEIF',
          'tiff': 'TIFF',
          'tif': 'TIFF'
        };
        
        const metadata: ImageMetadata = {
          format: formatMap[fileExtension] || fileExtension.toUpperCase(),
          size: file.size,
          width: img.width,
          height: img.height,
          aspectRatio,
          colorDepth: '24' // Default assumption for most images
        };
        
        // Extract EXIF data
        let exifData = {};
        try {
          exifData = await exifr.parse(file) || {};
        } catch (error) {
          console.warn('Could not extract EXIF data:', error);
        }
        
        URL.revokeObjectURL(url);
        resolve({ metadata, exifData });
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load image'));
      };
      
      img.src = url;
    });
  }, []);

  const analyzeFile = useCallback(async (file: File) => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const fileType = file.type.startsWith('video/') ? 'video' : 'image';
      
      if (fileType === 'video') {
        const metadata = await analyzeVideo(file);
        return { type: 'video' as const, metadata, exifData: null };
      } else {
        const { metadata, exifData } = await analyzeImage(file);
        return { type: 'image' as const, metadata, exifData };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze file';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  }, [analyzeVideo, analyzeImage]);

  return {
    analyzeFile,
    isAnalyzing,
    error
  };
};