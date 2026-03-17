import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function BottomBar({ hoveredStripIndex }) {
  const [isMuted, setIsMuted] = useState(true);
  const [visualizerActive, setVisualizerActive] = useState(true);
  const isVisible = hoveredStripIndex !== null;

  return (
    <div style={{ ...styles.container, opacity: isVisible ? 1 : 0, transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)', pointerEvents: isVisible ? 'auto' : 'none' }}>
      {/* Left section: Audio + See All Works */}
      <div style={styles.left}>
        <button
          style={styles.audioButton}
          onClick={() => setIsMuted(!isMuted)}
          aria-label="Toggle audio"
        >
          {isMuted
            ? <VolumeX size={18} color="#1a1a1a" strokeWidth={1.5} />
            : <Volume2 size={18} color="#1a1a1a" strokeWidth={1.5} />}
        </button>
        <span style={styles.seeAll}>SEE ALL 42 WORKS</span>
      </div>

      {/* Center section: Toggle buttons */}
      <div style={styles.center}>
        <button
          style={{
            ...styles.toggleBtn,
            backgroundColor: !visualizerActive ? '#1a1a1a' : 'transparent',
          }}
          onClick={() => setVisualizerActive(false)}
          aria-label="Grid view"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="3" fill={!visualizerActive ? '#ece7df' : '#1a1a1a'} />
          </svg>
        </button>
        <button
          style={{
            ...styles.toggleBtn,
            backgroundColor: visualizerActive ? '#1a1a1a' : 'transparent',
          }}
          onClick={() => setVisualizerActive(true)}
          aria-label="Visualizer view"
        >
          <svg width="20" height="16" viewBox="0 0 20 16" fill="none">
            <rect x="2" y="2" width="2" height="12" rx="1" fill={visualizerActive ? '#ece7df' : '#1a1a1a'} />
            <rect x="6" y="4" width="2" height="8" rx="1" fill={visualizerActive ? '#ece7df' : '#1a1a1a'} />
            <rect x="10" y="1" width="2" height="14" rx="1" fill={visualizerActive ? '#ece7df' : '#1a1a1a'} />
            <rect x="14" y="5" width="2" height="6" rx="1" fill={visualizerActive ? '#ece7df' : '#1a1a1a'} />
          </svg>
        </button>
      </div>

      {/* Right section: empty to balance layout */}
      <div style={styles.right} />
    </div>
  );
}

const styles = {
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 40px',
    zIndex: 100,
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  audioButton: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '6px',
  },
  seeAll: {
    fontFamily: '"Outfit", sans-serif',
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '3px',
    color: '#1a1a1a',
  },
  center: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  toggleBtn: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    border: '1.5px solid #1a1a1a',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.3s ease',
  },
  right: {
    width: '160px', // balance with left section
  },
};
