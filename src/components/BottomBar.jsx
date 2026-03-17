import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function BottomBar({ hoveredStripIndex, viewMode, setViewMode }) {
  const [isMuted, setIsMuted] = useState(true);

  return (
    <div style={{ ...styles.container }}>
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
        <span style={styles.seeAll}>26TH MARCH TO 3RD APRIL 2026</span>
      </div>

      {/* Center section: Toggle buttons */}
      <div style={styles.center}>
        {/* Left Toggle (Pill / Minus -> Single View) */}
        <button
          style={{
            ...styles.toggleBtn,
            backgroundColor: viewMode === 'SINGLE' ? '#1a1a1a' : 'transparent',
          }}
          onClick={() => setViewMode('SINGLE')}
          aria-label="Single view"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect x="6" y="10" width="12" height="4" rx="2" fill={viewMode === 'SINGLE' ? '#ece7df' : '#1a1a1a'} />
          </svg>
        </button>

        {/* Right Toggle (Equalizer bars -> Grid View / Entire Trip) */}
        <button
          style={{
            ...styles.toggleBtn,
            backgroundColor: viewMode === 'GRID' ? '#1a1a1a' : 'transparent',
          }}
          onClick={() => setViewMode('GRID')}
          aria-label="Grid view"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect x="5.5" y="8" width="2" height="8" rx="1" fill={viewMode === 'GRID' ? '#ece7df' : '#1a1a1a'} />
            <rect x="9.5" y="6" width="2" height="12" rx="1" fill={viewMode === 'GRID' ? '#ece7df' : '#1a1a1a'} />
            <rect x="13.5" y="7" width="2" height="10" rx="1" fill={viewMode === 'GRID' ? '#ece7df' : '#1a1a1a'} />
            <rect x="17.5" y="9" width="2" height="6" rx="1" fill={viewMode === 'GRID' ? '#ece7df' : '#1a1a1a'} />
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
