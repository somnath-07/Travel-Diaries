import { useEffect, useState } from 'react';

export default function DynamicTitle({ hoveredStripIndex }) {
  const titles = [
    "Pocahontas",
    "Aladdin",
    "Hercules",
    "Beauty and the Beast",
    "The Little Mermaid",
    "Tangled",
    "Mulan",
    "Tarzan",
    "The Lion King",
    "Frozen"
  ];

  const currentTitle = hoveredStripIndex === null ? titles[0] : titles[hoveredStripIndex];
  
  const [displayedTitle, setDisplayedTitle] = useState(currentTitle);
  const [animatingOut, setAnimatingOut] = useState(false);

  useEffect(() => {
    if (currentTitle !== displayedTitle) {
      setAnimatingOut(true);
      const timer = setTimeout(() => {
        setDisplayedTitle(currentTitle);
        setAnimatingOut(false);
      }, 400); // Wait for fade out
      return () => clearTimeout(timer);
    }
  }, [currentTitle, displayedTitle]);

  const letters = displayedTitle.split('');

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>
        {letters.map((char, i) => {
          const delay = `${i * 0.05}s`;
          return (
            <span
              key={`${displayedTitle}-${i}`}
              style={{
                ...styles.letter,
                animationDelay: delay,
                animationName: animatingOut ? 'fadeOut' : 'waveIn',
                opacity: animatingOut ? 1 : 0, // start invisible if waving in
                display: char === ' ' ? 'inline-block' : 'inline-block',
                width: char === ' ' ? '15px' : 'auto',
              }}
            >
              {char}
            </span>
          );
        })}
      </h1>
      <p style={{
        ...styles.subtitle,
        opacity: animatingOut ? 0 : 1,
        transition: 'opacity 0.4s ease'
      }}>
        Explore the Journey
      </p>
    </div>
  );
}

const styles = {
  container: {
    position: 'absolute',
    bottom: '15%',
    left: 0,
    right: 0,
    textAlign: 'center',
    zIndex: 10,
    pointerEvents: 'none',
  },
  title: {
    fontFamily: '"Dancing Script", cursive',
    fontSize: '96px',
    fontWeight: 'normal',
    color: '#f1f1f1',
    textShadow: '0 4px 12px rgba(0,0,0,0.5)',
    margin: 0,
    letterSpacing: '5px',
  },
  subtitle: {
    fontFamily: '"Outfit", sans-serif',
    fontSize: '16px',
    textTransform: 'uppercase',
    letterSpacing: '8px',
    color: '#rgba(255,255,255,0.7)',
    marginTop: '20px',
  },
  letter: {
    animationDuration: '0.6s',
    animationFillMode: 'forwards',
    animationTimingFunction: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
  }
};
