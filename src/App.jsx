import { useState } from 'react';
import TopNavBar from './components/TopNavBar';
import StripGallery from './components/StripGallery';
import DynamicTitle from './components/DynamicTitle';
import BottomBar from './components/BottomBar';
import './index.css';

export default function App() {
  const [hoveredStripIndex, setHoveredStripIndex] = useState(4); // Default to center strip

  return (
    <div style={styles.appContainer}>
      <TopNavBar />

      <div style={styles.mainContent}>
        <StripGallery
          hoveredStripIndex={hoveredStripIndex}
          setHoveredStripIndex={setHoveredStripIndex}
        />
      </div>

      <DynamicTitle hoveredStripIndex={hoveredStripIndex} />
      <BottomBar />
    </div>
  );
}

const styles = {
  appContainer: {
    width: '100vw',
    height: '100vh',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#ece7df',
  },
  mainContent: {
    position: 'absolute',
    top: '70px',
    left: 0,
    right: 0,
    bottom: '200px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px 50px',
  },
};
