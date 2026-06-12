import React, { useEffect, useRef, useState } from 'react';
import { TweenMax, Power3 } from 'gsap';
import Strip from './Strip';
import MobileStripGallery from './MobileStripGallery';
import { projectData } from '../data/projects';

export default function StripGallery({ 
  hoveredStripIndex, 
  setHoveredStripIndex,
  onStripClick,
  isMuted,
  setIsMuted,
  activeProjectIndex,
  setActiveProjectIndex
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const stripRefs = useRef([]);

  // GSAP Animation to animate flex-basis dynamically
  useEffect(() => {
    stripRefs.current.forEach((el, index) => {
      if (!el) return;
      
      const isHovered = hoveredStripIndex === index;
      const isImmediateNeighbor = hoveredStripIndex !== null && Math.abs(hoveredStripIndex - index) === 1;

      let targetFlex = '0 0 calc(10% - 10px)'; // default
      if (hoveredStripIndex !== null) {
        if (isHovered) targetFlex = '0 0 calc(15% - 10px)';
        else if (isImmediateNeighbor) targetFlex = '0 0 calc(7.5% - 10px)';
      }

      TweenMax.to(el, 0.8, {
        flex: targetFlex,
        ease: Power3.easeOut
      });
    });
  }, [hoveredStripIndex]);

  if (isMobile) {
    return (
      <MobileStripGallery
        activeProjectIndex={activeProjectIndex}
        setActiveProjectIndex={setActiveProjectIndex}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        onStripClick={onStripClick}
      />
    );
  }

  return (
    <div className="strip-gallery-container" style={styles.container} onMouseLeave={() => setHoveredStripIndex(null)}>
      {projectData.map((strip, index) => {
        return (
          <div 
            key={strip.id} 
            className="strip-wrapper"
            ref={el => stripRefs.current[index] = el}
            style={styles.stripWrapper}
          >
            <Strip
              strip={strip}
              index={index}
              hoveredStripIndex={hoveredStripIndex}
              onHover={() => setHoveredStripIndex(index)}
              onClick={() => onStripClick(index)}
              isMuted={isMuted}
              setIsMuted={setIsMuted}
            />
          </div>
        );
      })}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    width: '100%',
    height: '100%',
  },
  stripWrapper: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // Removed native CSS flex transition to yield control directly to pure GSAP animation
    willChange: 'flex', 
  }
};
