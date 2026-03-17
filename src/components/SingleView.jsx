import React, { useRef, useState, useEffect } from 'react';
import { Play } from 'lucide-react';

export default function SingleView({ project, allProjects, activeProjectIndex, setActiveProjectIndex, isMuted }) {
  const videoRef = useRef(null);
  const songAudioRef = useRef(null);
  const containerRef = useRef(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [isPlayingSong, setIsPlayingSong] = useState(false);

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.webkitRequestFullscreen) { /* Safari */
        videoRef.current.webkitRequestFullscreen();
      }
    }
  };

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const { width, height, left, top } = containerRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    // Normalized distance from center (-1 to 1)
    const normalizedX = (e.clientX - centerX) / (width / 2);
    const normalizedY = (e.clientY - centerY) / (height / 2);
    
    // We limit parallax to a small margin (e.g., +/- 15px)
    setMouseOffset({ x: normalizedX * 15, y: normalizedY * 15 });
  };

  // Click handler wrapper for video directly
  const handleVideoClick = () => {
    handleFullscreen();
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setIsPlayingSong(false);
    setActiveProjectIndex((activeProjectIndex + 1) % allProjects.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setIsPlayingSong(false);
    setActiveProjectIndex((activeProjectIndex - 1 + allProjects.length) % allProjects.length);
  };

  const toggleSong = (e) => {
    e.stopPropagation();
    if (isPlayingSong) {
      songAudioRef.current?.pause();
      setIsPlayingSong(false);
    } else {
      songAudioRef.current?.play();
      setIsPlayingSong(true);
    }
  };

  const nextProject = allProjects[(activeProjectIndex + 1) % allProjects.length];
  const prevProject = allProjects[(activeProjectIndex - 1 + allProjects.length) % allProjects.length];

  return (
    <div 
      ref={containerRef} 
      style={styles.container} 
      onMouseMove={handleMouseMove}
      onClick={handleVideoClick}
    >
      <audio ref={songAudioRef} src={project.songAudioUrl} loop />
      <video
        key={project.videoUrl} // crucial for remounting and autoplaying new sources reliably
        ref={videoRef}
        src={project.videoUrl}
        style={{
          ...styles.video,
          transform: `translate(${mouseOffset.x * -1}px, ${mouseOffset.y * -1}px) scale(1.05)`
        }}
        autoPlay
        loop
        muted={isMuted}
        playsInline
      />
      
      {/* Navigation Arrows (placed safely in margins) */}
      <div style={styles.leftNav} onClick={handlePrev}>
        <span style={styles.navText}>{prevProject.title.split(',')[0]}</span>
        <svg width="40" height="16" viewBox="0 0 60 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 10L60 10M10 10L16 4M10 10L16 16" stroke="#1a1a1a" strokeWidth="1.5"/>
        </svg>
      </div>

      <div style={styles.rightNav} onClick={handleNext}>
        <span style={styles.navText}>{nextProject.title.split(',')[0]}</span>
        <svg width="40" height="16" viewBox="0 0 60 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 10L50 10M50 10L44 4M50 10L44 16" stroke="#1a1a1a" strokeWidth="1.5"/>
        </svg>
      </div>

      <div 
        style={{
          ...styles.overlayContainer,
          transform: `translate(${mouseOffset.x * 1}px, ${mouseOffset.y * 1}px) scale(1.02)`
        }}
      >
        {/* Left spacing (Contains the Left Arrow visually) */}
        <div style={{ flex: 1, height: '100%', background: '#ece7df' }} />
        
        {/* Strip Columns - 16px GAPs & Equal Flex sizing */}
        <StripColumn flex="2" top="15%" window="60%" bottom="25%" />
        
        <div style={{ width: '16px', flexShrink: 0, background: '#ece7df', position: 'relative' }}>
          {/* STICKY SONG BANNER exactly over the gap */}
          <div style={styles.stickyBannerWrapper}>
            <div style={styles.blackBanner}>
              <span style={styles.verticalBannerText}>{project.song}</span>
              <button onClick={toggleSong} style={styles.playButton} aria-label={isPlayingSong ? "Pause Song" : "Play Song"}>
                {isPlayingSong ? (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                ) : (
                  <Play size={10} color="white" fill="white" style={{ marginLeft: 2 }} />
                )}
              </button>
            </div>
          </div>
        </div>
        
        <StripColumn flex="2" top="5%" window="75%" bottom="20%" />
        <div style={{ width: '16px', flexShrink: 0, background: '#ece7df' }} />
        
        <StripColumn flex="2" top="22%" window="50%" bottom="28%" />
        <div style={{ width: '16px', flexShrink: 0, background: '#ece7df' }} />
        <StripColumn flex="2" top="12%" window="80%" bottom="8%" />
        
        {/* Title Gap */}
        <div style={styles.titleGap}>
          <div style={styles.titleContainer}>
            <h1 style={styles.verticalTitle}>{project.title.split(',')[0]}</h1>
            <p style={styles.horizontalSubtitle}>Explore Song & Extra Material</p>
          </div>
        </div>
        
        <StripColumn flex="2" top="18%" window="50%" bottom="32%" />
        
        {/* Right Spacing (Contains the Right Arrow visually) */}
        <div style={{ flex: 1, height: '100%', background: '#ece7df' }} />
      </div>
    </div>
  );
}

function StripColumn({ flex, top, window, bottom, children }) {
  return (
    <div style={{ flex, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: top, background: '#ece7df' }} />
      <div style={{ height: window, background: 'transparent', position: 'relative' }}>
         {children}
      </div>
      <div style={{ height: bottom, background: '#ece7df' }} />
    </div>
  );
}

const styles = {
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    zIndex: 10,
    backgroundColor: '#ece7df',
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    objectFit: 'cover',
    zIndex: 11,
  },
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    zIndex: 12,
    pointerEvents: 'none', // Let clicks pass through except buttons
  },
  stickyBannerWrapper: {
    position: 'absolute',
    top: '15%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '3.5vw',
    minWidth: '40px',
    height: '65%',
    zIndex: 20,
  },
  blackBanner: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#1a1a1a',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '32px 0 24px 0',
    pointerEvents: 'auto',
  },
  verticalBannerText: {
    color: '#ece7df',
    fontFamily: '"Playfair Display", serif',
    writingMode: 'vertical-rl',
    fontSize: '0.85rem',
    letterSpacing: '0.05em',
    whiteSpace: 'nowrap',
  },
  playButton: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    border: '1px solid #ece7df',
    background: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    pointerEvents: 'auto',
  },
  titleGap: {
    width: '12vw',
    flexShrink: 0,
    height: '100%',
    background: '#ece7df',
    position: 'relative',
    zIndex: 15,
  },
  titleContainer: {
    position: 'absolute',
    top: '45%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  verticalTitle: {
    fontFamily: '"Playfair Display", serif',
    writingMode: 'vertical-rl',
    fontSize: '3.5rem',
    color: '#1a1a1a',
    margin: 0,
    whiteSpace: 'nowrap',
    letterSpacing: '1px',
  },
  horizontalSubtitle: {
    fontFamily: '"Outfit", sans-serif',
    fontSize: '12px',
    color: '#1a1a1a',
    marginTop: '24px', 
    textAlign: 'center',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  },
  leftNav: {
    position: 'absolute',
    left: '4vw',
    top: '50%',
    transform: 'translateY(-50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    pointerEvents: 'auto',
    zIndex: 50,
  },
  rightNav: {
    position: 'absolute',
    right: '4vw',
    top: '50%',
    transform: 'translateY(-50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    pointerEvents: 'auto',
    zIndex: 50,
  },
  navText: {
    fontFamily: '"Outfit", sans-serif',
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: '#6b6560',
    maxWidth: '90px',
    textAlign: 'center',
    lineHeight: 1.4,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
};
