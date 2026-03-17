import { useEffect, useRef } from 'react';

export default function Strip({ strip, index, isHovered, onHover }) {
  const centerIndex = 4;
  const distFromCenter = Math.abs(index - centerIndex);
  const heightPercent = isHovered ? 95 : Math.max(60, 90 - distFromCenter * 5);
  const videoRef = useRef(null);

  // Play the video when the strip is hovered, pause when not.
  useEffect(() => {
    if (isHovered && videoRef.current) {
      // Catch helps absorb abort errors if the user hovers back and forth rapidly
      videoRef.current.play().catch((err) => console.log('Video play interrupted', err));
    } else if (videoRef.current) {
      videoRef.current.pause();
    }
  }, [isHovered]);

  return (
    <div
      style={{
        ...styles.stripWrapper,
        // Fluidly expand hovered strip, compressing siblings gently
        flex: isHovered ? 4 : 1,
        height: `${heightPercent}%`,
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
