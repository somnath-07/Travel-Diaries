import React, { useState, useEffect, useRef } from 'react';
import { projectData } from '../data/projects';

export default function MobileStripGallery({
  activeProjectIndex,
  setActiveProjectIndex,
  isMuted,
  setIsMuted,
}) {
  const [dragOffset, setDragOffset] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const dragDistance = useRef(0);

  // Auto-play video on project change
  useEffect(() => {
    setIsPlaying(true);
  }, [activeProjectIndex]);

  const handleStart = (clientX) => {
    isDragging.current = true;
    startX.current = clientX;
    dragDistance.current = 0;
  };

  const handleMove = (clientX) => {
    if (!isDragging.current) return;
    const diff = clientX - startX.current;
    dragDistance.current = diff;
    setDragOffset(diff);
  };

  const handleEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const finalDiff = dragDistance.current;
    setDragOffset(0);

    const swipeThreshold = 60; // minimum drag distance to trigger card change
    if (finalDiff > swipeThreshold) {
      // Swiped right -> Previous card
      setActiveProjectIndex((activeProjectIndex - 1 + projectData.length) % projectData.length);
    } else if (finalDiff < -swipeThreshold) {
      // Swiped left -> Next card
      setActiveProjectIndex((activeProjectIndex + 1) % projectData.length);
    }
  };

  // Touch event handlers
  const onTouchStart = (e) => handleStart(e.touches[0].clientX);
  const onTouchMove = (e) => handleMove(e.touches[0].clientX);
  const onTouchEnd = handleEnd;

  // Mouse event handlers for desktop testing
  const onMouseDown = (e) => handleStart(e.clientX);
  const onMouseMove = (e) => handleMove(e.clientX);
  const onMouseUp = handleEnd;

  // Helper to find the shortest cyclic distance
  const getCyclicOffset = (index, activeIndex, total) => {
    let diff = index - activeIndex;
    while (diff > total / 2) diff -= total;
    while (diff <= -total / 2) diff += total;
    return diff;
  };

  const handleCardClick = (e, index) => {
    // If the drag distance is significant, ignore the click (it was a swipe)
    if (Math.abs(dragDistance.current) > 10) return;

    if (index === activeProjectIndex) {
      setIsPlaying((prev) => !prev);
    } else {
      setActiveProjectIndex(index);
    }
  };

  const activeProject = projectData[activeProjectIndex];

  return (
    <div
      style={styles.mobileContainer}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      {/* Slider Area */}
      <div style={styles.sliderWrapper}>
        {projectData.map((project, index) => {
          const offset = getCyclicOffset(index, activeProjectIndex, projectData.length);
          const isCenter = index === activeProjectIndex;

          // Only render visible items to save performance
          if (Math.abs(offset) > 1) return null;

          const colWidth = window.innerWidth * 0.6; // 60vw in pixels
          const translateX_px = offset * colWidth;
          const totalTranslation = translateX_px + dragOffset;
          const t = Math.min(1, Math.max(0, Math.abs(totalTranslation) / colWidth));

          // Interpolated values based on distance from center
          const scale = 1.0 - t * 0.18; // center is 1.0, neighbor is 0.82
          const opacity = 1.0 - t * 0.55; // center is 1.0, neighbor is 0.45
          const grayscaleVal = t * 100;
          const sepiaVal = t * 30;
          const brightnessVal = 1.0 - t * 0.3; // center is 1.0, neighbor is 0.7
          const filter = t > 0.02
            ? `grayscale(${grayscaleVal}%) sepia(${sepiaVal}%) brightness(${brightnessVal})`
            : 'none';

          const transitionStyle = isDragging.current
            ? 'none'
            : 'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.45s ease, filter 0.45s ease';

          return (
            <div
              key={project.id}
              onClick={(e) => handleCardClick(e, index)}
              style={{
                ...styles.cardWrapper,
                transform: `translate(-50%, -50%) translateX(calc(${offset * 60}vw + ${dragOffset}px)) scale(${scale})`,
                opacity,
                filter,
                transition: transitionStyle,
                zIndex: isCenter ? 10 : 5,
              }}
            >
              <VideoCard
                project={project}
                isCenter={isCenter}
                isMuted={isMuted}
                isPlaying={isCenter && isPlaying}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function VideoCard({ project, isCenter, isMuted, isPlaying }) {
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const hasSeekedRef = useRef(false);

  useEffect(() => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.play().catch((e) => console.log('Playback blocked:', e));
      if (project.songAudioUrl && !isMuted && audioRef.current) {
        audioRef.current.play().catch((e) => console.log('Audio blocked:', e));
      }
    } else {
      videoRef.current.pause();
      if (videoRef.current.readyState >= 1) {
        videoRef.current.currentTime = 5;
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [isPlaying, isMuted, project.songAudioUrl]);

  const handleLoadedData = (e) => {
    if (!isPlaying && e.target.readyState >= 1 && !hasSeekedRef.current) {
      e.target.currentTime = 5;
      hasSeekedRef.current = true;
    }
  };

  useEffect(() => {
    hasSeekedRef.current = false;
  }, [project.videoUrl]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <video
        ref={videoRef}
        src={project.videoUrl}
        poster={project.imageUrl}
        preload="auto"
        loop
        muted={isMuted || !isCenter || !!project.songAudioUrl}
        playsInline
        style={styles.media}
        onLoadedData={handleLoadedData}
      />
      {project.songAudioUrl && isCenter && (
        <audio ref={audioRef} src={project.songAudioUrl} loop muted={isMuted} />
      )}
    </div>
  );
}

const styles = {
  mobileContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    touchAction: 'pan-y', // allow vertical page scroll but capture horizontal swipe
  },
  sliderWrapper: {
    position: 'relative',
    width: '100%',
    height: '40vh',
    marginTop: '5px',
    overflow: 'visible',
  },
  cardWrapper: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '56vw',
    height: '100%',
    backgroundColor: '#000000',
    boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
    overflow: 'hidden',
    cursor: 'pointer',
    userSelect: 'none',
  },
  media: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  detailsContainer: {
    marginTop: '12px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '0 20px',
  },
  activeTitle: {
    fontFamily: '"Playfair Display", serif',
    fontSize: '20px',
    fontWeight: 'normal',
    color: '#1a1a1a',
    margin: '0 0 3px 0',
  },
  activeSubtitle: {
    fontFamily: '"Outfit", sans-serif',
    fontSize: '9px',
    fontWeight: 500,
    letterSpacing: '1px',
    color: '#6b6560',
    textTransform: 'uppercase',
    margin: 0,
  },
  controlsContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    marginTop: '10px',
  },
  capsuleBtn: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: '1.5px solid #1a1a1a',
    backgroundColor: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    outline: 'none',
    transition: 'border-color 0.3s ease',
  },
};
