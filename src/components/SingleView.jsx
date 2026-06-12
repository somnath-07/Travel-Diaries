import React, { useRef, useState, useEffect } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import '@videojs/themes/dist/city/index.css';
import 'lazysizes';
import VideoControls from './VideoControls';

export default function SingleView({ project, allProjects, activeProjectIndex, setActiveProjectIndex, isMuted, setIsMuted, onClose }) {
  const videoRef = useRef(null);
  const songAudioRef = useRef(null);
  const containerRef = useRef(null);
  const playerRef = useRef(null); 
  const fullscreenContainerRef = useRef(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [isPlayingSong, setIsPlayingSong] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const [isFullscreen, setIsFullscreen] = useState(false);

  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // VideoJS mounting/unmounting
  useEffect(() => {
    if (!playerRef.current) {
      const videoElement = document.createElement("video-js");
      videoElement.classList.add('vjs-theme-city');
      videoElement.classList.add('lazyload');
      videoRef.current.appendChild(videoElement);

      const player = playerRef.current = videojs(videoElement, {
        autoplay: true,
        muted: isMuted || !isPlayingSong || !!project.songAudioUrl,
        loop: true,
        controls: false,
        preload: 'auto',
        sources: [{
          src: project.videoUrl,
          type: 'video/mp4' // Assuming mp4 from source links
        }]
      }, () => {
        videojs.log('player is ready');
        player.on('play', () => setIsPlaying(true));
        player.on('pause', () => setIsPlaying(false));
        player.on('timeupdate', () => setCurrentTime(player.currentTime()));
        player.on('loadedmetadata', () => setDuration(player.duration()));
      });
    } else {
      const player = playerRef.current;
      if (player.currentSrc() !== project.videoUrl) {
         player.src({ src: project.videoUrl, type: 'video/mp4' });
         player.muted(isMuted || !isPlayingSong || !!project.songAudioUrl);
         player.play().catch(e => console.log('Autoplay blocked:', e));
      }
    }
  }, [project.videoUrl]);

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.muted(isMuted || !isPlayingSong || !!project.songAudioUrl);
    }
  }, [isMuted, isPlayingSong, project.songAudioUrl]);

  useEffect(() => {
    return () => {
      if (playerRef.current && !playerRef.current.isDisposed()) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  // Fullscreen tracking
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleFullscreen = () => {
    if (fullscreenContainerRef.current) {
      if (!document.fullscreenElement) {
        fullscreenContainerRef.current.requestFullscreen().catch(e => console.log('Fullscreen error:', e));
      }
    }
  };

  const handleExitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
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

  const togglePlay = (e) => {
    e.stopPropagation();
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pause();
      } else {
        playerRef.current.play();
      }
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (setIsMuted) {
      setIsMuted(!isMuted);
    }
  };

  const handleSeek = (e) => {
    e.stopPropagation();
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (playerRef.current) {
      playerRef.current.currentTime(newTime);
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
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
      if (project.songAudioUrl) {
        songAudioRef.current?.pause();
      } else {
        if (playerRef.current) {
          playerRef.current.muted(true);
        }
      }
      setIsPlayingSong(false);
    } else {
      if (project.songAudioUrl) {
        if (playerRef.current) {
          playerRef.current.muted(true);
        }
        songAudioRef.current?.play().catch(err => console.log('Audio play blocked:', err));
      } else {
        if (playerRef.current) {
          playerRef.current.muted(isMuted);
        }
      }
      setIsPlayingSong(true);
    }
  };

  const nextProject = allProjects[(activeProjectIndex + 1) % allProjects.length];
  const prevProject = allProjects[(activeProjectIndex - 1 + allProjects.length) % allProjects.length];

  if (isMobile) {
    return (
      <div 
        ref={containerRef} 
        style={styles.mobileContainer} 
        onClick={handleVideoClick}
      >
        <audio ref={songAudioRef} src={project.songAudioUrl} loop muted={isMuted} />
        
        {/* Fullscreen Video.js wrapper */}
        <div 
          ref={fullscreenContainerRef}
          style={styles.mobileVideo}
        >
          <div ref={videoRef} style={{ width: '100%', height: '100%' }} />
          
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

        {/* Solid Top Masking Panel */}
        <div style={styles.mobileTopMask} />

        {/* Slats Overlay */}
        <div style={styles.mobileSlatsContainer}>
          {/* Left Side Padding Column */}
          <div style={styles.mobileSidePadding} />

          {/* Slat 1 */}
          <MobileSlatColumn topSpacerPx={40} windowHeightVh={24} />
          <div style={styles.mobileGap} />
          {/* Slat 2 */}
          <MobileSlatColumn topSpacerPx={20} windowHeightVh={29} />
          <div style={styles.mobileGap} />
          {/* Slat 3 */}
          <MobileSlatColumn topSpacerPx={0} windowHeightVh={34} />
          <div style={styles.mobileGap} />
          {/* Slat 4 */}
          <MobileSlatColumn topSpacerPx={20} windowHeightVh={29} />
          <div style={styles.mobileGap} />
          {/* Slat 5 */}
          <MobileSlatColumn topSpacerPx={40} windowHeightVh={24} />

          {/* Right Side Padding Column */}
          <div style={styles.mobileSidePadding} />

          {/* Sticky Song Banner on Mobile */}
          <div style={styles.mobileSongBannerWrapper}>
            <div style={styles.mobileBlackBanner}>
              <span style={styles.mobileVerticalBannerText}>{project.song || 'Sikkim'}</span>
              <button onClick={toggleSong} style={styles.mobilePlayButton} aria-label={isPlayingSong ? "Pause Song" : "Play Song"}>
                {isPlayingSong ? (
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                ) : (
                  <svg width="8" height="10" viewBox="0 0 24 24" fill="white"><path d="M5 3l14 9-14 9v-18z"/></svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Solid Bottom Masking Panel */}
        <div style={styles.mobileBottomMask} />

        {/* Bottom details, controls & navigation */}
        <div style={styles.mobileBottomSection}>
          
          {/* Left Navigation */}
          <div style={styles.mobileLeftNav} onClick={handlePrev}>
            <span style={styles.mobileNavTitle}>{prevProject.title.split(',')[0]}</span>
            <svg width="45" height="10" viewBox="0 0 80 12" fill="none" xmlns="http://www.w3.org/2000/svg" style={styles.mobileArrow}>
              <path d="M80 6H0M6 0L0 6L6 12" stroke="#1a1a1a" strokeWidth="1.5"/>
            </svg>
          </div>

          {/* Center Title and Media Controls */}
          <div style={styles.mobileCenterInfo}>
            <h2 style={styles.mobileProjectTitle}>{project.title.split(',')[0]}</h2>
            <p style={styles.mobileProjectSubtitle}>
              {project.song ? `Song: ${project.song}` : 'Background: Native Sound'}
            </p>
            
            {/* Capsule controls */}
            <div style={styles.mobileControlsContainer}>
              {/* Play/Pause Button */}
              <button onClick={togglePlay} style={styles.mobileCapsuleBtn} aria-label={isPlaying ? "Pause Video" : "Play Video"}>
                {isPlaying ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#1a1a1a">
                    <rect x="5" y="4" width="4" height="16" rx="1" />
                    <rect x="15" y="4" width="4" height="16" rx="1" />
                  </svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#1a1a1a" style={{ marginLeft: '1px' }}>
                    <path d="M6 4l14 8-14 8z" />
                  </svg>
                )}
              </button>

              {/* Sound Button */}
              <button 
                onClick={toggleMute} 
                style={{
                  ...styles.mobileCapsuleBtn,
                  borderColor: isMuted ? '#6b6560' : '#1a1a1a'
                }} 
                aria-label="Toggle Sound"
              >
                {isMuted ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b6560" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <line x1="23" y1="9" x2="17" y2="15" />
                    <line x1="17" y1="9" x2="23" y2="15" />
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#1a1a1a">
                    <rect x="4" y="6" width="2" height="12" rx="0.5" />
                    <rect x="10" y="3" width="2" height="15" rx="0.5" />
                    <rect x="16" y="8" width="2" height="10" rx="0.5" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Right Navigation */}
          <div style={styles.mobileRightNav} onClick={handleNext}>
            <span style={styles.mobileNavTitle}>{nextProject.title.split(',')[0]}</span>
            <svg width="45" height="10" viewBox="0 0 80 12" fill="none" xmlns="http://www.w3.org/2000/svg" style={styles.mobileArrow}>
              <path d="M0 6H80M74 0L80 6L74 12" stroke="#1a1a1a" strokeWidth="1.5"/>
            </svg>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      style={styles.container} 
      onMouseMove={handleMouseMove}
      onClick={handleVideoClick}
    >
      <audio ref={songAudioRef} src={project.songAudioUrl} loop muted={isMuted} />
      
      {/* Container for Video.js player */}
      <div 
        ref={fullscreenContainerRef}
        style={{
          ...styles.video,
          transform: `translate(${mouseOffset.x * -1}px, ${mouseOffset.y * -1}px) scale(1.05)`
        }}
      >
        <div ref={videoRef} style={{ width: '100%', height: '100%' }} />
        
        {/* Only show controls when this container is in fullscreen */}
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
      
      {/* Navigation Arrows (Stacked Text over Long Elegant Arrow) */}
      <div className="sv-left-nav" style={styles.leftNav} onClick={handlePrev}>
        <div style={styles.navTextContainer}>
          <span className="sv-nav-text" style={styles.navText}>{prevProject.title.split(',')[0]}</span>
        </div>
        <svg width="80" height="12" viewBox="0 0 80 12" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginTop: '4px'}}>
          <path d="M80 6H0M6 0L0 6L6 12" stroke="#ffffff" strokeWidth="1"/>
        </svg>
      </div>

      <div className="sv-right-nav" style={styles.rightNav} onClick={handleNext}>
        <div style={styles.navTextContainer}>
          <span className="sv-nav-text" style={styles.navText}>{nextProject.title.split(',')[0]}</span>
        </div>
        <svg width="80" height="12" viewBox="0 0 80 12" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginTop: '4px'}}>
          <path d="M0 6H80M74 0L80 6L74 12" stroke="#ffffff" strokeWidth="1"/>
        </svg>
      </div>

      <div 
        style={{
          ...styles.overlayContainer,
          transform: `translate(${mouseOffset.x * 1}px, ${mouseOffset.y * 1}px) scale(1.02)`
        }}
      >
        <div className="sv-wrapper" style={styles.contentWrapper}>
          
          {/* Strip 1 (High) */}
          <StripColumn flex="1" top="8%" window="84%" bottom="8%" />
          
          {/* Title Area Custom Width (Left side in new ref) */}
          <div className="sv-title-area" style={styles.titleArea}>
            <div style={styles.titleContainer}>
              <h1 className="sv-vertical-title" style={styles.verticalTitle}>
                {project.title.split(',')[0].replace(' ', '\n')}
              </h1>
              <div style={styles.horizontalSubtitleWrapper}>
                <p className="sv-horizontal-subtitle" style={styles.horizontalSubtitle}>Explore Song &{'\n'}Extra Material</p>
              </div>
            </div>
          </div>
          
          {/* Strip 2 (Low) */}
          <StripColumn flex="1" top="20%" window="60%" bottom="20%" />
          <div className="sv-gap" style={styles.gap} />
          
          {/* Strip 3 (Mid) */}
          <StripColumn flex="1" top="14%" window="72%" bottom="14%" />
          <div className="sv-gap" style={styles.gap} />
          
          {/* Strip 4 (Low) */}
          <StripColumn flex="1" top="20%" window="60%" bottom="20%" />
          
          <div className="sv-gap" style={styles.gap}>
             {/* STICKY SONG BANNER (Right side in new ref) */}
            <div className="sv-banner-wrapper" style={styles.stickyBannerWrapper}>
              <div style={styles.blackBanner}>
                <span className="sv-banner-text" style={styles.verticalBannerText}>{project.song}</span>
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
          
          {/* Strip 5 (High) */}
          <StripColumn flex="1" top="8%" window="84%" bottom="8%" />
          
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

function MobileSlatColumn({ topSpacerPx, windowHeightVh }) {
  return (
    <div style={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: `${topSpacerPx}px`, backgroundColor: '#ece7df' }} />
      <div style={{ height: `${windowHeightVh}vh`, backgroundColor: 'transparent' }} />
      <div style={{ flex: 1, backgroundColor: '#ece7df' }} />
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
    width: '56%', // Reduced from 60% to force even larger outer margins
    paddingLeft: '6%', // Additional violent push inwards from the left
    paddingRight: '6%',
    position: 'relative',
    margin: '0 auto',
  },
  gap: {
    width: '24px', // At least 16px
    flexShrink: 0,
    height: '100%',
    background: '#ece7df',
    position: 'relative',
  },
  stickyBannerWrapper: {
    position: 'absolute',
    top: '8%', // Matches top edge of Strip 1 and 5
    left: '50%',
    transform: 'translateX(-50%)',
    width: '50px',
    height: '35vh',
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
    width: '200px', // Wider area to support dual-line vertical text and match padding
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
    justifyContent: 'center',
    height: '100%',
  },
  verticalTitle: {
    fontFamily: '"Playfair Display", serif',
    writingMode: 'vertical-rl',
    fontSize: '56px',
    fontWeight: 'normal',
    color: '#0a0a0a',
    margin: 0,
    letterSpacing: '2px',
    lineHeight: 1.2,
  },
  horizontalSubtitleWrapper: {
    marginTop: '32px',
    display: 'flex',
    justifyContent: 'center',
  },
  horizontalSubtitle: {
    fontFamily: '"Outfit", sans-serif',
    fontSize: '9px', // tiny elegant font matching reference
    color: '#0a0a0a',
    textAlign: 'center',
    letterSpacing: '1px',
    lineHeight: '1.4',
    whiteSpace: 'pre-wrap',
  },
  leftNav: {
    position: 'absolute',
    left: '1.5%', // Pushed slightly closer to edge to increase distance from content
    top: '50%',
    transform: 'translateY(-50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
    cursor: 'pointer',
    pointerEvents: 'auto',
    zIndex: 50,
  },
  rightNav: {
    position: 'absolute',
    right: '1.5%',
    top: '50%',
    transform: 'translateY(-50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
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
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 1.4,
    whiteSpace: 'pre-wrap',
  },
  mobileContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    zIndex: 10,
    backgroundColor: '#ece7df',
  },
  mobileVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    objectFit: 'cover',
    zIndex: 11,
  },
  mobileSlatsContainer: {
    position: 'absolute',
    top: '50px',
    left: 0,
    width: '100vw',
    height: '35vh',
    display: 'flex',
    zIndex: 12,
    pointerEvents: 'none',
  },
  mobileGap: {
    width: '5px',
    flexShrink: 0,
    height: '100%',
    background: '#ece7df',
  },
  mobileSongBannerWrapper: {
    position: 'absolute',
    top: '20px',
    right: '6vw',
    width: '40px',
    height: '18vh',
    zIndex: 20,
  },
  mobileTopMask: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100vw',
    height: '50px',
    backgroundColor: '#ece7df',
    zIndex: 12,
  },
  mobileBottomMask: {
    position: 'absolute',
    top: 'calc(50px + 35vh)',
    left: 0,
    width: '100vw',
    bottom: 0,
    backgroundColor: '#ece7df',
    zIndex: 12,
  },
  mobileSidePadding: {
    width: '6vw',
    height: '100%',
    backgroundColor: '#ece7df',
  },
  mobileBlackBanner: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#0a0a0a',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: '20px',
    paddingBottom: '12px',
    pointerEvents: 'auto',
  },
  mobileVerticalBannerText: {
    color: '#ece7df',
    fontFamily: '"Playfair Display", serif',
    writingMode: 'vertical-rl',
    fontSize: '11px',
    letterSpacing: '1px',
    whiteSpace: 'nowrap',
  },
  mobilePlayButton: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    border: '1px solid #ece7df',
    background: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    pointerEvents: 'auto',
  },
  mobileBottomSection: {
    position: 'absolute',
    bottom: '60px',
    left: '4vw',
    width: '92vw',
    height: '24vh',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 15,
  },
  mobileLeftNav: {
    width: '28%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    cursor: 'pointer',
    gap: '6px',
    pointerEvents: 'auto',
  },
  mobileRightNav: {
    width: '28%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    cursor: 'pointer',
    gap: '6px',
    pointerEvents: 'auto',
  },
  mobileNavTitle: {
    fontFamily: '"Playfair Display", serif',
    fontSize: '10px',
    color: '#1a1a1a',
    textAlign: 'center',
    lineHeight: 1.3,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: '100%',
  },
  mobileArrow: {
    display: 'block',
  },
  mobileCenterInfo: {
    width: '44%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileProjectTitle: {
    fontFamily: '"Playfair Display", serif',
    fontSize: '20px',
    fontWeight: 'normal',
    color: '#1a1a1a',
    margin: '0 0 4px 0',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  mobileProjectSubtitle: {
    fontFamily: '"Outfit", sans-serif',
    fontSize: '9px',
    fontWeight: 500,
    letterSpacing: '1px',
    color: '#6b6560',
    textTransform: 'uppercase',
    margin: 0,
    textAlign: 'center',
  },
  mobileControlsContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    marginTop: '12px',
    pointerEvents: 'auto',
  },
  mobileCapsuleBtn: {
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    border: '1.5px solid #1a1a1a',
    backgroundColor: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    outline: 'none',
  },
};
