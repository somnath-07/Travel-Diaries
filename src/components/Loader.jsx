import React, { useState, useEffect, useRef } from 'react';
import { loaderImages } from '../data/loaderImages';

export default function Loader({ onComplete }) {
  const [trail, setTrail] = useState([]);
  const [isFadingOut, setIsFadingOut] = useState(false);
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

  // 5-second loader lifetime
  useEffect(() => {
    // Start fading out at 4.2 seconds (takes 800ms)
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 4200);

    // Call onComplete at 5.0 seconds
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 5000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  const handleMouseMove = (e) => {
    if (isFadingOut || shuffledImagesRef.current.length === 0) return;

    const { clientX, clientY } = e;
    const dx = clientX - lastPosition.current.x;
    const dy = clientY - lastPosition.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Only spawn a new image if mouse has moved more than 45 pixels
    if (distance > 45) {
      const newItem = {
        id: Date.now() + Math.random(),
        x: clientX,
        y: clientY,
        src: shuffledImagesRef.current[imageIndex.current],
        rotation: (Math.random() - 0.5) * 20, // Random rotation -10 to 10 deg
      };

      imageIndex.current = (imageIndex.current + 1) % shuffledImagesRef.current.length;
      lastPosition.current = { x: clientX, y: clientY };

      setTrail((prev) => [...prev, newItem]);

      // Remove trail image after 800ms
      setTimeout(() => {
        setTrail((prev) => prev.filter((item) => item.id !== newItem.id));
      }, 800);
    }
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      style={{
        ...styles.overlay,
        opacity: isFadingOut ? 0 : 1,
        pointerEvents: isFadingOut ? 'none' : 'auto',
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
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: '#000000',
    color: '#ece7df',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '60px 0',
    zIndex: 9999,
    overflow: 'hidden',
    transition: 'opacity 0.8s ease-in-out',
    userSelect: 'none',
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
