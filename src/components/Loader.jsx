import React, { useState, useEffect, useRef } from 'react';
import { loaderImages } from '../data/loaderImages';

const BAR_COUNT = 10;

export default function Loader({ onComplete }) {
  const [trail, setTrail] = useState([]);
  const [isTextFaded, setIsTextFaded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const lastPosition = useRef({ x: 0, y: 0 });
  const imageIndex = useRef(0);
  const shuffledImagesRef = useRef([]);

  // Shuffle images on mount
  useEffect(() => {
    if (loaderImages && loaderImages.length > 0) {
      shuffledImagesRef.current = [...loaderImages].sort(() => Math.random() - 0.5);
    } else {
      shuffledImagesRef.current = [];
    }
  }, []);

  // 10-second loader lifetime + transition reveal
  useEffect(() => {
    // Start fading out branding text at 9.2 seconds (takes 800ms)
    const fadeTimer = setTimeout(() => {
      setIsTextFaded(true);
    }, 9200);

    // Start sliding up the background bars at 10.0 seconds
    const transitionTimer = setTimeout(() => {
      setIsTransitioning(true);
    }, 10000);

    // Call onComplete at 11.8 seconds (after all staggered bars finish sliding up)
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 11800);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(transitionTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  const spawnImage = (clientX, clientY, force = false) => {
    const dx = clientX - lastPosition.current.x;
    const dy = clientY - lastPosition.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (force || distance > 45) {
      const newItem = {
        id: Date.now() + Math.random(),
        x: clientX,
        y: clientY,
        src: shuffledImagesRef.current[imageIndex.current],
        rotation: (Math.random() - 0.5) * 20,
      };

      imageIndex.current = (imageIndex.current + 1) % shuffledImagesRef.current.length;
      lastPosition.current = { x: clientX, y: clientY };

      setTrail((prev) => [...prev, newItem]);

      setTimeout(() => {
        setTrail((prev) => prev.filter((item) => item.id !== newItem.id));
      }, 800);
    }
  };

  const handleMouseMove = (e) => {
    if (isTextFaded || shuffledImagesRef.current.length === 0) return;
    spawnImage(e.clientX, e.clientY, false);
  };

  const handleTouchStart = (e) => {
    if (isTextFaded || shuffledImagesRef.current.length === 0) return;
    const touch = e.changedTouches[0] || e.touches[0];
    if (touch) {
      spawnImage(touch.clientX, touch.clientY, true);
    }
  };

  const handleTouchMove = (e) => {
    if (isTextFaded || shuffledImagesRef.current.length === 0) return;
    const touch = e.changedTouches[0] || e.touches[0];
    if (touch) {
      spawnImage(touch.clientX, touch.clientY, false);
    }
  };

  const bars = Array.from({ length: BAR_COUNT });

  return (
    <div
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      style={{
        ...styles.overlay,
        backgroundColor: isTransitioning ? 'transparent' : '#000000',
        pointerEvents: isTransitioning ? 'none' : 'auto',
      }}
    >
      {/* Background Staggered Bars */}
      {bars.map((_, index) => {
        // Stagger from bottom-most (index 9) to top-most (index 0)
        const reverseIndex = BAR_COUNT - 1 - index;
        const delay = reverseIndex * 80; // 80ms stagger delay for a super smooth, periodic wave
        return (
          <div
            key={index}
            style={{
              ...styles.bar,
              top: `${index * (100 / BAR_COUNT)}%`,
              height: `${100 / BAR_COUNT + 0.5}%`, // 0.5% overlap to prevent sub-pixel gaps
              transitionDelay: `${delay}ms`,
              transform: isTransitioning ? 'translateY(-101vh)' : 'translateY(0)',
            }}
          />
        );
      })}

      {/* Main Interactive & Branding Content */}
      <div
        style={{
          ...styles.contentContainer,
          opacity: isTextFaded ? 0 : 1,
        }}
      >
        {/* Central Sikkim Diaries Branding */}
        <div style={styles.centerContainer}>
          <h1 style={styles.title}>Sikkim Diaries</h1>
        </div>

        {/* Mouse Trail Images */}
        {trail.map((item) => (
          <img
            key={item.id}
            src={item.src}
            style={{
              ...styles.trailImg,
              left: item.x,
              top: item.y,
              transform: `translate(-50%, -50%) rotate(${item.rotation}deg)`,
            }}
            alt="montage trail"
          />
        ))}

        {/* Bottom Loading Indicator */}
        <div style={styles.bottomContainer}>
          <span style={styles.loadingText}>Loading...</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100dvh',
    color: '#ece7df',
    zIndex: 9999,
    overflow: 'hidden',
    userSelect: 'none',
  },
  contentContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '60px 0',
    zIndex: 10,
    pointerEvents: 'none',
    transition: 'opacity 0.8s ease-in-out',
  },
  bar: {
    position: 'absolute',
    left: 0,
    width: '100%',
    backgroundColor: '#000000',
    transition: 'transform 0.8s cubic-bezier(0.76, 0, 0.24, 1)',
    zIndex: 1,
  },
  centerContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: '"Playfair Display", serif',
    fontSize: '56px',
    fontWeight: 400,
    fontStyle: 'italic',
    color: '#ece7df',
    letterSpacing: '3px',
    margin: 0,
    textAlign: 'center',
  },
  bottomContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontFamily: '"Outfit", sans-serif',
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '3px',
    textTransform: 'uppercase',
    color: '#6b6560',
  },
  trailImg: {
    position: 'absolute',
    width: '140px',
    height: '200px',
    objectFit: 'cover',
    pointerEvents: 'none',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.6)',
    animation: 'fadeAndScaleOut 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
    zIndex: 5,
  },
};
