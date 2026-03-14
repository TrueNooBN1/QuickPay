import React, { useEffect, useRef, useState } from 'react';
import "./videoplayer.css"

interface VideoPlayerProps {
  src: string;
  type?: 'video' | 'youtube' | 'vimeo';
  poster?: string;
  width?: string | number;
  height?: string | number;
  autoPlay?: boolean;
  controls?: boolean;
  loop?: boolean;
  muted?: boolean;
  className?: string;
  posterClassName?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  type = 'video',
  width = '100%',
  height = 'auto',
  autoPlay = false,
  controls = true,
  loop = false,
  muted = true,
  className = '',
  posterClassName = '',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
   const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => observer.disconnect();
  }, []);
  

  // Для YouTube извлекаем ID из URL
  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Для Vimeo извлекаем ID
  const getVimeoId = (url: string) => {
    const regExp = /vimeo\.com\/(?:.*#|.*?\/)?(\d+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  if (type === 'youtube') {
    const videoId = getYoutubeId(src);
    return (
      <div className={`video-wrapper ${className}`}>
        <iframe
          width={width}
          height={height}
          src={`https://www.youtube.com/embed/${videoId}?autoplay=${autoPlay ? 1 : 0}&mute=${muted ? 1 : 0}&loop=${loop ? 1 : 0}&controls=${controls ? 1 : 0}`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  if (type === 'vimeo') {
    const videoId = getVimeoId(src);
    return (
      <div className={`video-wrapper ${className}`}>
        <iframe
          width={width}
          height={height}
          src={`https://player.vimeo.com/video/${videoId}?autoplay=${autoPlay ? 1 : 0}&loop=${loop ? 1 : 0}&muted=${muted ? 1 : 0}`}
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  // Нативное HTML5 видео
  return (
    <div className={`video-wrapper ${className}`}>
      {!isPlaying && (
        <div 
          className={`custom-poster ${posterClassName}`}
          onClick={()=>{videoRef.current?.play()}}
          // style={{ backgroundImage: `url(${poster})` }}
        >
        </div>
      )}
      
      <video
        webkit-playsinline
        ref={videoRef}
        width={width}
        height={height}
        controls={controls}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        playsInline
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        className='video'
      >
        {/* not lazy load */}
        {/* <source src={src} type="video/mp4" />
        <source src={src.replace('.mp4', '.webm')} type="video/webm" /> */}
        {/* lazy load */}
        {isVisible && <source src={src} type="video/mp4" />}
      </video>
      
      {/* Кастомные элементы управления (опционально) */}
      {!controls && (
        <div className="custom-controls">
          <button onClick={() => videoRef.current?.play()}>
            {isPlaying ? 'Pause' : 'Play'}
          </button>
        </div>
      )}
    </div>
  );
};