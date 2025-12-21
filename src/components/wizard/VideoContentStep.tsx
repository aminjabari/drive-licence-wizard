import { useRef, useEffect } from 'react';

interface VideoContentStepProps {
  title: string;
  description: string;
  headerImage?: string;
  headerImageAlt?: string;
  videoSrc?: string;
}

export function VideoContentStep({ title, description, headerImage, headerImageAlt, videoSrc }: VideoContentStepProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && videoSrc) {
      videoRef.current.play().catch(() => {
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play();
        }
      });
    }
  }, [videoSrc]);

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-y-auto">
      {/* Header Video or Image */}
      <div className="w-full aspect-[16/9] flex-shrink-0 bg-secondary flex items-center justify-center relative overflow-hidden">
        {videoSrc ? (
          <video 
            ref={videoRef}
            src={videoSrc}
            controls
            className="w-full h-full object-cover"
            playsInline
          />
        ) : headerImage ? (
          <img 
            src={headerImage} 
            alt={headerImageAlt || title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground">ویدیو</span>
          </div>
        )}
      </div>
      
      {/* Text Content */}
      <div className="p-6">
        <h2 className="text-xl font-bold text-foreground mb-4">{title}</h2>
        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
          {description}
        </p>
      </div>
    </div>
  );
}
