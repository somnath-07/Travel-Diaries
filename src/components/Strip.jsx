import { useEffect, useRef } from 'react';

export default function Strip({ strip, index, hoveredStripIndex, onHover }) {
  const isHovered = hoveredStripIndex === index;
  const isAnyHovered = hoveredStripIndex !== null;

  // Custom undulating heights matching the reference red wave pattern
  const waveHeights = [85, 75, 60, 75, 85, 65, 55, 75, 85, 75];
  const baseHeight = waveHeights[index];

  // The hovered strip expands to 95%. If ANY strip is hovered, others compress slightly.
  const heightPercent = isHovered ? 95 : (isAnyHovered ? baseHeight * 0.9 : baseHeight);
  
  // Default state is 50% opacity. If a strip is active, the others dim even further.
  const stripOpacity = isHovered ? 1 : (isAnyHovered ? 0.35 : 0.5);

  const videoRef = useRef(null);

  useEffect(() => {
    if (isHovered && videoRef.current) {
      videoRef.current.play().catch((err) => console.log('Video play interrupted', err));
    } else if (videoRef.current) {
      videoRef.current.pause();
    }
  }, [isHovered]);

  return (
    <div
      style={{
        ...styles.stripWrapper,
        flex: isHovered ? 4 : 1,
        height: `${heightPercent}%`,
        opacity: stripOpacity,
      }}
      onMouseEnter={onHover}
    >
      <div
        style={{
          ...styles.stripInner,
          filter: isHovered
            ? 'grayscale(0%) brightness(1)'
            : 'grayscale(100%) sepia(40%) brightness(0.8)',
          boxShadow: isHovered
            ? '0 8px 40px rgba(0,0,0,0.25)'
            : '0 4px 20px rgba(0,0,0,0.08)',
        }}
      >
        <video
          ref={videoRef}
          src={strip.videoUrl}
          poster={strip.imageUrl}
          style={styles.media}
          loop
          muted // crucial for autoplay without interaction
          playsInline
        />
      </div>
    </div>
  );
}

const styles = {
  stripWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    // Extremely fluid transition ease matching the reference
    transition: 'flex 0.8s cubic-bezier(0.16, 1, 0.3, 1), height 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
    cursor: 'pointer',
    minWidth: 0, 
  },
  stripInner: {
    width: '100%',
    height: '100%',
    borderRadius: '0px', // Sharp corners as requested
    overflow: 'hidden',
    position: 'relative',
    transition: 'filter 0.8s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  media: {
    width: '100%',
    height: '100%',
    objectFit: 'cover', // Preserves scale, just reveals more width
    display: 'block',
  },
};
