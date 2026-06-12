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
          const isNeighbor = Math.abs(offset) === 1;

          // Only render visible items to save performance
          if (Math.abs(offset) > 1) return null;

          const translateX = offset * 60; // 60vw column gap
          const scale = isCenter ? 1.0 : 0.82;
          const opacity = isCenter ? 1.0 : 0.45;
          const filter = isCenter ? 'none' : 'grayscale(100%) sepia(30%) brightness(0.7)';

          const transitionStyle = isDragging.current
            ? 'none'
            : 'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.45s ease, filter 0.45s ease';

          return (
            <div
              key={project.id}
              onClick={(e) => handleCardClick(e, index)}
              style={{
                ...styles.cardWrapper,
                transform: `translate(-50%, -50%) translateX(calc(${translateX}vw + ${dragOffset}px)) scale(${scale})`,
                opacity,
                filter,
                transition: transitionStyle,
                zIndex: isCenter ? 10 : 5,
              }}
            >
              {isCenter ? (
                <ActiveCard
                  key={project.id}
                  project={project}
                  isMuted={isMuted}
                  isPlaying={isPlaying}
                />
              ) : (
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  style={styles.media}
                  draggable="false"
                />
              )}
            </div>
          );
        })}
      </div>

      {/* active card details */}
      <div style={styles.detailsContainer}>
        <h2 style={styles.activeTitle}>{activeProject.title.split(',')[0]}</h2>
        <p style={styles.activeSubtitle}>
          {activeProject.song ? `Song: ${activeProject.song}` : 'Background: Native Sound'}
        </p>
      </div>

      {/* bottom capsule controls */}
      <div style={styles.controlsContainer}>
        {/* Play/Pause Button */}
        <button
          onClick={() => setIsPlaying((prev) => !prev)}
          style={styles.capsuleBtn}
          aria-label={isPlaying ? 'Pause Video' : 'Play Video'}
        >
          {isPlaying ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#1a1a1a">
              <rect x="5" y="4" width="4" height="16" rx="1" />
              <rect x="15" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#1a1a1a" style={{ marginLeft: '2px' }}>
              <path d="M6 4l14 8-14 8z" />
            </svg>
          )}
        </button>

        {/* Sound Button */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          style={{
            ...styles.capsuleBtn,
            borderColor: isMuted ? '#6b6560' : '#1a1a1a',
          }}
          aria-label="Toggle Sound"
        >
          {isMuted ? (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6b6560" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="#1a1a1a">
              {/* Equalizer Bars */}
              <rect x="4" y="6" width="2.5" height="12" rx="1" />
              <rect x="10" y="3" width="2.5" height="15" rx="1" />
              <rect x="16" y="8" width="2.5" height="10" rx="1" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

function ActiveCard({ project, isMuted, isPlaying }) {
  const videoRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.play().catch((e) => console.log('Playback blocked:', e));
      if (project.songAudioUrl && !isMuted && audioRef.current) {
        audioRef.current.play().catch((e) => console.log('Audio blocked:', e));
      }
    } else {
      videoRef.current.pause();
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, isMuted, project.songAudioUrl]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <video
        ref={videoRef}
        src={project.videoUrl}
        poster={project.imageUrl}
        preload="auto"
        loop
        muted={isMuted || !!project.songAudioUrl}
        playsInline
        style={styles.media}
      />
      {project.songAudioUrl && (
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
    height: '44vh',
    marginTop: '15px',
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
    marginTop: '25px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '0 20px',
  },
  activeTitle: {
    fontFamily: '"Playfair Display", serif',
    fontSize: '24px',
    fontWeight: 'normal',
    color: '#1a1a1a',
    margin: '0 0 6px 0',
  },
  activeSubtitle: {
    fontFamily: '"Outfit", sans-serif',
    fontSize: '11px',
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
    marginTop: '20px',
  },
  capsuleBtn: {
    width: '38px',
    height: '38px',
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
