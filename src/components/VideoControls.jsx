import React from 'react';
import { Play, Pause, Volume2, VolumeX, X } from 'lucide-react';

export default function VideoControls({
  isPlaying,
  togglePlay,
  isMuted,
  toggleMute,
  currentTime,
  duration,
  handleSeek,
  formatTime,
  onExitFullscreen
}) {
  return (
    <>
      {/* Top Right Close Button (Exits Fullscreen) */}
      <button 
        className="sv-close-btn" 
        style={styles.closeBtn} 
        onClick={(e) => { e.stopPropagation(); onExitFullscreen(); }}
      >
        <X size={28} color="#ece7df" strokeWidth={1.5} />
      </button>

      {/* Bottom Video Controls */}
      <div 
        className="sv-video-controls" 
        style={styles.videoControlsContainer} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Seek Slider */}
        <input 
          type="range" 
          min="0" 
          max={duration || 100} 
          step="0.1"
          value={currentTime} 
          onChange={handleSeek}
          className="sv-seek-slider"
          style={{
            background: `linear-gradient(to right, #ece7df ${(duration > 0 ? (currentTime / duration) * 100 : 0)}%, rgba(236,231,223,0.3) ${(duration > 0 ? (currentTime / duration) * 100 : 0)}%)`
          }}
        />
        {/* Bottom Row */}
        <div style={styles.controlsRow}>
          <div style={styles.leftControls}>
            <button onClick={togglePlay} style={styles.controlBtn}>
              {isPlaying ? <Pause size={20} color="#ece7df" strokeWidth={1.5} fill="#ece7df" /> : <Play size={20} color="#ece7df" strokeWidth={1.5} fill="#ece7df" />}
            </button>
            <button onClick={toggleMute} style={styles.controlBtn}>
              {isMuted ? <VolumeX size={20} color="#ece7df" strokeWidth={1.5} /> : <Volume2 size={20} color="#ece7df" strokeWidth={1.5} />}
            </button>
          </div>
          <div style={styles.rightControls}>
            <span style={styles.timeText}>-{formatTime(duration - currentTime)}</span>
          </div>
        </div>
      </div>
    </>
  );
}

const styles = {
  closeBtn: {
    position: 'absolute',
    top: '40px',
    right: '40px',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    pointerEvents: 'auto',
    zIndex: 60,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoControlsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%', // Use 100% instead of 100vw to work correctly in any wrapper
    display: 'flex',
    flexDirection: 'column',
    zIndex: 60,
    pointerEvents: 'auto',
    background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%)',
    paddingTop: '40px',
  },
  controlsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 40px 30px 40px',
  },
  leftControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  },
  controlBtn: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
  },
  rightControls: {
    display: 'flex',
    alignItems: 'center',
  },
  timeText: {
    color: '#ece7df',
    fontFamily: '"Outfit", sans-serif',
    fontSize: '13px',
    letterSpacing: '1px',
    fontWeight: 300,
  },
};
