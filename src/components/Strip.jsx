import React, { useEffect, useRef } from 'react';
import { TweenMax, Power3 } from 'gsap';
import 'lazysizes';

export default function Strip({ strip, index, hoveredStripIndex, onHover, onClick, isMuted }) {
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
    if (onClick) onClick(e);
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.webkitRequestFullscreen) {
        videoRef.current.webkitRequestFullscreen();
      }
    }
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
        <img data-src={strip.imageUrl} className="lazyload" alt={strip.title} style={{...styles.media, position: 'absolute', zIndex: 1}} />
        <video
          className="lazyload"
          ref={videoRef}
          data-src={strip.videoUrl}
          data-poster={strip.imageUrl}
          style={{...styles.media, position: 'relative', zIndex: 2}}
          loop
          muted={isMuted}
          playsInline
        />
        <audio ref={hoverAudioRef} src={strip.songAudioUrl} loop preload="auto" muted={isMuted} />
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
