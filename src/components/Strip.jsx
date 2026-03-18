import React, { useEffect, useRef, useState } from 'react';
import { TweenMax, Power3 } from 'gsap';
import 'lazysizes';
import VideoControls from './VideoControls';

export default function Strip({ strip, index, hoveredStripIndex, onHover, onClick, isMuted, setIsMuted }) {
  const isHovered = hoveredStripIndex === index;
  const isAnyHovered = hoveredStripIndex !== null;

  // Custom undulating heights matching the reference red wave pattern
  const waveHeights = [85, 75, 60, 75, 85, 65, 55, 75, 85, 75];
  const baseHeight = waveHeights[index];

  // Height stays completely static based on the wave to prevent vertical disturbance
  const heightPercent = baseHeight;

  const stripInnerRef = useRef(null);
  const containerRef = useRef(null);

  const stripOpacity = isHovered ? 1 : (isAnyHovered ? 0.35 : 0.5);

  const videoRef = useRef(null);
  const hoverAudioRef = useRef(null);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === stripInnerRef.current);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Media Playback
  useEffect(() => {
    if (isHovered) {
      if (videoRef.current) videoRef.current.play().catch((err) => console.log('Video play interrupted', err));
      if (hoverAudioRef.current) hoverAudioRef.current.play().catch(e => console.log('Audio blocked:', e));
    } else {
      if (videoRef.current) videoRef.current.pause();
      if (hoverAudioRef.current) {
        hoverAudioRef.current.pause();
        hoverAudioRef.current.currentTime = 0; // reset
      }
    }
  }, [isHovered]);

  // GSAP Animation Logic for Opacity & Filter
  useEffect(() => {
    if (containerRef.current) {
      TweenMax.to(containerRef.current, 0.8, {
        height: `${heightPercent}%`,
        opacity: stripOpacity,
        ease: Power3.easeOut
      });
    }

    if (stripInnerRef.current) {
      TweenMax.to(stripInnerRef.current, 0.8, {
        filter: isHovered
          ? 'grayscale(0%) brightness(1)'
          : 'grayscale(100%) sepia(40%) brightness(0.8)',
        boxShadow: isHovered
          ? '0 8px 40px rgba(0,0,0,0.25)'
          : '0 4px 20px rgba(0,0,0,0.08)',
        ease: Power3.easeOut
      });
    }
  }, [isHovered, stripOpacity, heightPercent]);

  const handleFullscreen = (e) => {
    e.stopPropagation();
    if (onClick) onClick(e);
    if (stripInnerRef.current) {
      if (!document.fullscreenElement) {
        if (stripInnerRef.current.requestFullscreen) {
          stripInnerRef.current.requestFullscreen();
        } else if (stripInnerRef.current.webkitRequestFullscreen) {
          stripInnerRef.current.webkitRequestFullscreen();
        }
      }
    }
  };

  const handleExitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  const handleSeek = (e) => {
    e.stopPropagation();
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const togglePlay = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (setIsMuted) {
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div
      ref={containerRef}
      style={styles.stripWrapper}
      onMouseEnter={onHover}
      onClick={handleFullscreen}
    >
      <div
        ref={stripInnerRef}
        style={styles.stripInner}
      >
        <img data-src={strip.imageUrl} className="lazyload" alt={strip.title} style={{ ...styles.media, position: 'absolute', zIndex: 1 }} />
        <video
          className="lazyload"
          ref={videoRef}
          data-src={strip.videoUrl}
          data-poster={strip.imageUrl}
          style={{ ...styles.media, position: 'relative', zIndex: 2 }}
          loop
          muted={isMuted}
          playsInline
          onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
          onLoadedMetadata={(e) => setDuration(e.target.duration)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
        <audio ref={hoverAudioRef} src={strip.songAudioUrl} loop preload="auto" muted={isMuted} />
        {isFullscreen && (
          <VideoControls
            isPlaying={isPlaying}
            togglePlay={togglePlay}
            isMuted={isMuted}
            toggleMute={toggleMute}
            currentTime={currentTime}
            duration={duration}
            handleSeek={handleSeek}
            formatTime={formatTime}
            onExitFullscreen={handleExitFullscreen}
          />
        )}
      </div>
    </div>
  );
}

const styles = {
  stripWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    minWidth: 0,
    // Removed height and opacity CSS transitions because GSAP handles them smoothly
  },
  stripInner: {
    width: '100%',
    height: '100%',
    borderRadius: '0px',
    overflow: 'hidden',
    position: 'relative',
    // Removed complex filter/box-shadow CSS transitions as GSAP dictates frames now
  },
  media: {
    width: '100%',
    height: '100%',
    objectFit: 'cover', // Preserves scale, just reveals more width
    display: 'block',
  },
};
