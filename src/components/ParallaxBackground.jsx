export default function ParallaxBackground({ hoveredStripIndex }) {
  // We'll translate the background slightly based on which strip is hovered
  // index goes 0 to 9. We can map it from -10% to 10%
  
  const totalStrips = 10;
  // center is index 4.5. So offset ranges from -4.5 to 4.5
  const defaultIndex = hoveredStripIndex === null ? 0 : hoveredStripIndex;
  const offset = defaultIndex - (totalStrips / 2 - 0.5);
  // multiply by some factor, say -3% per index
  const translateX = offset * -3;

  return (
    <div style={{...styles.container, transform: `translateX(${translateX}%) scale(1.1)`}}>
      <div style={styles.overlay} />
      <img
        src="https://picsum.photos/1920/1080?blur=10"
        alt="background"
        style={styles.backgroundImage}
      />
    </div>
  );
}

const styles = {
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: 0,
    transition: 'transform 0.8s cubic-bezier(0.25, 0.8, 0.25, 1)',
    pointerEvents: 'none',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)', // darkens the background
  }
};
