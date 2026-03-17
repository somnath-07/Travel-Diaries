import React, { useRef, useState, useEffect } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import '@videojs/themes/dist/city/index.css';
import 'lazysizes';
import { Play } from 'lucide-react';

export default function SingleView({ project, allProjects, activeProjectIndex, setActiveProjectIndex, isMuted }) {
  const videoRef = useRef(null);
  const songAudioRef = useRef(null);
  const containerRef = useRef(null);
  const playerRef = useRef(null); 
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [isPlayingSong, setIsPlayingSong] = useState(false);

  // VideoJS mounting/unmounting
  useEffect(() => {
    if (!playerRef.current) {
      const videoElement = document.createElement("video-js");
      videoElement.classList.add('vjs-theme-city');
      videoElement.classList.add('lazyload');
      videoRef.current.appendChild(videoElement);

      const player = playerRef.current = videojs(videoElement, {
        autoplay: true,
        muted: isMuted,
        loop: true,
        controls: false,
        sources: [{
          src: project.videoUrl,
          type: 'video/mp4' // Assuming mp4 from source links
        }]
      }, () => {
        videojs.log('player is ready');
      });
    } else {
      const player = playerRef.current;
      player.muted(isMuted);
      player.src({ src: project.videoUrl, type: 'video/mp4' });
    }
  }, [project.videoUrl, isMuted]);

  useEffect(() => {
    return () => {
      if (playerRef.current && !playerRef.current.isDisposed()) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  const handleFullscreen = () => {
    if (playerRef.current) {
      playerRef.current.requestFullscreen();
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
      
      {/* Container for Video.js player */}
      <div 
        ref={videoRef} 
        style={{
          ...styles.video,
          transform: `translate(${mouseOffset.x * -1}px, ${mouseOffset.y * -1}px) scale(1.05)`
        }}
      />
      
      {/* Navigation Arrows (Stacked Text over Arrow) */}
      <div style={styles.leftNav} onClick={handlePrev}>
        <div style={styles.navTextContainer}>
          <span style={styles.navText}>{prevProject.title.split(',')[0]}</span>
        </div>
        <svg width="60" height="12" viewBox="0 0 60 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 6H60M0 6L6 0M0 6L6 12" stroke="#1a1a1a" strokeWidth="1"/>
        </svg>
      </div>

      <div style={styles.rightNav} onClick={handleNext}>
        <div style={styles.navTextContainer}>
          <span style={styles.navText}>{nextProject.title.split(',')[0]}</span>
        </div>
        <svg width="60" height="12" viewBox="0 0 60 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 6H60M60 6L54 0M60 6L54 12" stroke="#1a1a1a" strokeWidth="1"/>
        </svg>
      </div>

      <div 
        style={{
          ...styles.overlayContainer,
          transform: `translate(${mouseOffset.x * 1}px, ${mouseOffset.y * 1}px) scale(1.02)`
        }}
      >
        <div style={styles.contentWrapper}>
          
          <StripColumn flex="1" top="10%" window="80%" bottom="10%" />
          
          <div style={styles.gap}>
             {/* STICKY SONG BANNER anchored to top of screen */}
            <div style={styles.stickyBannerWrapper}>
              <div style={styles.blackBanner}>
                <span style={styles.verticalBannerText}>{project.song}</span>
                <button onClick={toggleSong} style={styles.playButton} aria-label={isPlayingSong ? "Pause Song" : "Play Song"}>
                  {isPlayingSong ? (
                    <svg width="8" height="10" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                  ) : (
                    <svg width="10" height="12" viewBox="0 0 24 24" fill="white"><path d="M5 3l14 9-14 9v-18z"/></svg>
                  )}
                </button>
              </div>
            </div>
          </div>
          
          <StripColumn flex="1" top="15%" window="75%" bottom="10%" />
          <div style={styles.gap} />
          
          <StripColumn flex="1" top="5%" window="90%" bottom="5%" />
          <div style={styles.gap} />
          
          <StripColumn flex="1" top="20%" window="60%" bottom="20%" />
          <div style={styles.gap} />
          
          <StripColumn flex="1" top="8%" window="82%" bottom="10%" />
          
          {/* Title Area */}
          <div style={styles.titleArea}>
            <div style={styles.titleContainer}>
              <h1 style={styles.verticalTitle}>{project.title.split(',')[0]}</h1>
              <p style={styles.horizontalSubtitle}>Explore Song &{'\n'}Extra Material</p>
            </div>
          </div>
          
          <StripColumn flex="1" top="15%" window="70%" bottom="15%" />
          
        </div>
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
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center', // Center the content wrapper
    zIndex: 12,
    pointerEvents: 'none',
  },
  contentWrapper: {
    display: 'flex',
    height: '100%',
    width: '75%', // Leaves 12.5% margins on each side for the safe arrows
    position: 'relative',
  },
  gap: {
    width: '16px',
    flexShrink: 0,
    height: '100%',
    background: '#ece7df',
    position: 'relative',
  },
  stickyBannerWrapper: {
    position: 'absolute',
    top: '0', // Pins exactly to top screen edge
    left: '50%',
    transform: 'translateX(-50%)',
    width: '46px',
    height: '45vh',
    zIndex: 20,
  },
  blackBanner: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#0a0a0a',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between', // pushes top text and bottom icon apart
    paddingTop: '36px',
    paddingBottom: '24px',
    pointerEvents: 'auto',
  },
  verticalBannerText: {
    color: '#ece7df',
    fontFamily: '"Playfair Display", serif',
    writingMode: 'vertical-rl',
    fontSize: '13px',
    letterSpacing: '1px',
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
  titleArea: {
    width: '120px', 
    flexShrink: 0,
    height: '100%',
    background: '#ece7df',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 15,
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '24px',
    marginTop: '-40px', // slightly offset vertical center
  },
  verticalTitle: {
    fontFamily: '"Playfair Display", serif',
    writingMode: 'vertical-rl',
    fontSize: '56px', // fixed big size instead of vw explosion
    fontWeight: 'normal',
    color: '#1a1a1a',
    margin: 0,
    whiteSpace: 'nowrap',
    letterSpacing: '1px',
  },
  horizontalSubtitle: {
    fontFamily: '"Outfit", sans-serif',
    fontSize: '10px',
    color: '#1a1a1a',
    textAlign: 'center',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    whiteSpace: 'pre-wrap',
  },
  leftNav: {
    position: 'absolute',
    left: '3%',
    top: '50%',
    transform: 'translateY(-50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    pointerEvents: 'auto',
    zIndex: 50,
  },
  rightNav: {
    position: 'absolute',
    right: '3%',
    top: '50%',
    transform: 'translateY(-50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    pointerEvents: 'auto',
    zIndex: 50,
  },
  navTextContainer: {
    width: '100px',
    display: 'flex',
    justifyContent: 'center',
  },
  navText: {
    fontFamily: '"Playfair Display", serif',
    fontSize: '11px',
    letterSpacing: '1px',
    color: '#1a1a1a',
    textAlign: 'center',
    lineHeight: 1.4,
    whiteSpace: 'pre-wrap',
  },
};
