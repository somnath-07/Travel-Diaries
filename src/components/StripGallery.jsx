import Strip from './Strip';

import { projectData } from '../data/projects';

export default function StripGallery({ 
  hoveredStripIndex, 
  setHoveredStripIndex,
  onStripClick 
}) {
  // We only allow expansion if a strip is hovered and it's not the absolute edges to avoid harsh layout shifts
  return (
    <div style={styles.container} onMouseLeave={() => setHoveredStripIndex(null)}>
      {projectData.map((strip, index) => {
        // Only allow central strips to expand slightly to prevent disturbing the entire row
        const isHovered = hoveredStripIndex === index;
        const isImmediateNeighbor = hoveredStripIndex !== null && Math.abs(hoveredStripIndex - index) === 1;

        // Base width calculation to prevent layout thrashing
        // Active strip gets slightly wider, immediate neighbors slightly narrower. Rest are completely unaffected.
        let flexShrinkGrow = '0 0 calc(10% - 10px)'; // default
        
        if (hoveredStripIndex !== null) {
          if (isHovered) flexShrinkGrow = '0 0 calc(15% - 10px)';
          else if (isImmediateNeighbor) flexShrinkGrow = '0 0 calc(7.5% - 10px)';
        }

        return (
          <div 
            key={strip.id} 
            style={{ 
              ...styles.stripWrapper, 
              flex: flexShrinkGrow,
            }}
          >
            <Strip
              strip={strip}
              index={index}
              hoveredStripIndex={hoveredStripIndex}
              onHover={() => setHoveredStripIndex(index)}
              onClick={() => onStripClick(index)}
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
    transition: 'flex 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
    willChange: 'flex', // optimization for smooth width transitions
  }
};
