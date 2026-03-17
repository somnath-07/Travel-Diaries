export default function Strip({ strip, isHovered, onHover }) {
  return (
    <div 
      style={{
        ...styles.strip,
        flex: isHovered ? 4 : 1, // hovered expands significantly
        filter: isHovered ? 'grayscale(0%) brightness(1.1)' : 'grayscale(100%) brightness(0.6)',
      }}
      onMouseEnter={onHover}
    >
      <img src={strip.imageUrl} alt={strip.title} style={styles.image} draggable={false} />
    </div>
  );
}

const styles = {
  strip: {
    height: '100%',
    position: 'relative',
    transition: 'flex 0.6s cubic-bezier(0.25, 0.8, 0.25, 1), filter 0.6s ease',
    overflow: 'hidden',
    cursor: 'pointer',
    borderRight: '1px solid rgba(255, 255, 255, 0.05)',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: 'absolute',
    top: 0,
    left: 0,
  }
};
