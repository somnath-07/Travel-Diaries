import { useEffect, useState, useRef } from 'react';

const projectData = [
  { title: "Pocahontas", song: "Colors of the Wind" },
  { title: "Aladdin", song: "Speechless" },
  { title: "Enchanted", song: "That's How You Know" },
  { title: "Newsies", song: "Seize the Day" },
  { title: "Hercules", song: "Zero to Hero" },
  { title: "Beauty", song: "Belle" },
  { title: "Tangled", song: "I See the Light" },
  { title: "Mulan", song: "Reflection" },
  { title: "Tarzan", song: "You'll Be in My Heart" },
  { title: "The Little Mermaid", song: "Part of Your World" },
];

export default function DynamicTitle({ hoveredStripIndex }) {
  const idx = hoveredStripIndex ?? 4;
  const { title, song } = projectData[idx];

  const [displayedTitle, setDisplayedTitle] = useState(title);
  const [displayedSong, setDisplayedSong] = useState(song);
  const [animatingOut, setAnimatingOut] = useState(false);
  const prevTitle = useRef(title);

  useEffect(() => {
    if (title !== prevTitle.current) {
      setAnimatingOut(true);
      const timer = setTimeout(() => {
        setDisplayedTitle(title);
        setDisplayedSong(song);
        setAnimatingOut(false);
        prevTitle.current = title;
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [title, song]);

  const letters = displayedTitle.split('');

  const isVisible = hoveredStripIndex !== null;

  return (
    <div style={{ ...styles.container, opacity: isVisible ? 1 : 0, transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}>
      <p style={{
        ...styles.explore,
        opacity: animatingOut ? 0 : 1,
        transition: 'opacity 0.35s ease',
      }}>
        Explore Song &amp; Extra Material
      </p>

      <h1 style={styles.titleContainer}>
        {letters.map((char, i) => (
          <span
            key={`${displayedTitle}-${i}`}
            style={{
              ...styles.letter,
              animationDelay: `${i * 0.04}s`,
              animationName: animatingOut ? 'fadeOut' : 'waveIn',
              opacity: animatingOut ? 1 : 0,
              display: 'inline-block',
              width: char === ' ' ? '18px' : 'auto',
            }}
          >
            {char}
          </span>
        ))}
      </h1>

      <p style={{
        ...styles.songLabel,
        opacity: animatingOut ? 0 : 1,
        transition: 'opacity 0.35s ease',
      }}>
        Song: {displayedSong}
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
