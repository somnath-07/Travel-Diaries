import { useEffect, useState, useRef } from 'react';

import { projectData } from '../data/projects';

export default function DynamicTitle({ hoveredStripIndex }) {
  const isHovered = hoveredStripIndex !== null;
  const currentData = isHovered 
    ? projectData[hoveredStripIndex] 
    : { title: "Sikkim Diaries", song: "Curated experience of Sikkim trips" };

  const [displayedTitle, setDisplayedTitle] = useState(currentData.title);
  const [displayedSong, setDisplayedSong] = useState(currentData.song);
  const [animatingOut, setAnimatingOut] = useState(false);
  const prevTitle = useRef(currentData.title);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (currentData.title !== prevTitle.current) {
      setAnimatingOut(true);
      const timer = setTimeout(() => {
        setDisplayedTitle(currentData.title);
        setDisplayedSong(currentData.song);
        setAnimatingOut(false);
        prevTitle.current = currentData.title;
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [currentData.title, currentData.song]);

  const letters = displayedTitle.split('');

  const isVisible = hoveredStripIndex !== null;

  return (
    <div className="dynamic-title-wrapper" style={{ 
      ...styles.container, 
      bottom: isMobile ? '65px' : '60px',
      transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)' 
    }}>
      {isHovered && !isMobile && (
        <p style={{
          ...styles.explore,
          opacity: animatingOut ? 0 : 1,
          transition: 'opacity 0.35s ease',
        }}>
          Explore Song &amp; Extra Material
        </p>
      )}

      <h1 className="dynamic-title-text" style={{
        ...styles.titleContainer,
        fontSize: isMobile ? '34px' : '72px',
        margin: isMobile ? '0 0 4px 0' : '0 0 10px 0',
      }}>
        {letters.map((char, i) => (
          <span
            key={`${displayedTitle}-${i}`}
            style={{
              ...styles.letter,
              animationDelay: `${i * 0.04}s`,
              animationName: animatingOut ? 'fadeOut' : 'waveIn',
              opacity: animatingOut ? 1 : 0,
              display: 'inline-block',
              width: char === ' ' ? (isMobile ? '8px' : '18px') : 'auto',
            }}
          >
            {char}
          </span>
        ))}
      </h1>

      <p className="dynamic-title-song" style={{
        ...styles.songLabel,
        fontSize: isMobile ? '10px' : '14px',
        opacity: animatingOut ? 0 : 1,
        transition: 'opacity 0.35s ease',
      }}>
        {isHovered ? `Song: ${displayedSong}` : displayedSong}
      </p>
    </div>
  );
}

const styles = {
  container: {
    position: 'absolute',
    bottom: '60px',
    left: 0,
    right: 0,
    textAlign: 'center',
    zIndex: 10,
    pointerEvents: 'none',
  },
  explore: {
    fontFamily: '"Outfit", sans-serif',
    fontSize: '13px',
    textTransform: 'uppercase',
    letterSpacing: '5px',
    color: '#6b6560',
    marginBottom: '8px',
  },
  titleContainer: {
    fontFamily: '"Playfair Display", serif',
    fontSize: '72px',
    fontWeight: 400,
    fontStyle: 'italic',
    color: '#1a1a1a',
    margin: '0 0 10px 0',
    letterSpacing: '2px',
    lineHeight: 1.1,
  },
  letter: {
    animationDuration: '0.5s',
    animationFillMode: 'forwards',
    animationTimingFunction: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
  },
  songLabel: {
    fontFamily: '"Outfit", sans-serif',
    fontSize: '14px',
    color: '#6b6560',
    letterSpacing: '2px',
  },
};
