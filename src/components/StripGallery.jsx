import Strip from './Strip';

export default function StripGallery({ hoveredStripIndex, setHoveredStripIndex }) {
  // We need exactly 10 strips. We can mock some data for now.
  const stripsData = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    title: `Project ${i + 1}`,
    imageUrl: `https://picsum.photos/seed/${i + 100}/800/1200`
  }));

  return (
    <div style={styles.container} onMouseLeave={() => setHoveredStripIndex(null)}>
      {stripsData.map((strip, index) => (
        <Strip 
          key={strip.id} 
          strip={strip} 
          isHovered={hoveredStripIndex === index}
          onHover={() => setHoveredStripIndex(index)}
        />
      ))}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    width: '100vw',
    height: '100vh',
    overflow: 'hidden', // enforce no scrolling
    backgroundColor: '#0d0d0d',
  }
};
