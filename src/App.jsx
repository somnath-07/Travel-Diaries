import { useState, useRef, useEffect } from 'react';
import TopNavBar from './components/TopNavBar';
import StripGallery from './components/StripGallery';
import DynamicTitle from './components/DynamicTitle';
import BottomBar from './components/BottomBar';
import SingleView from './components/SingleView';
import { projectData } from './data/projects';
import './index.css';

export default function App() {
  const [hoveredStripIndex, setHoveredStripIndex] = useState(null); // Default to unhovered
  const [viewMode, setViewMode] = useState('GRID'); // 'GRID' | 'SINGLE'
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  const handleHover = (index) => {
    setHoveredStripIndex(index);
    if (index !== null) {
      setActiveProjectIndex(index);
    }
  };

  const handleStripClick = (index) => {
    setActiveProjectIndex(index);
  };

  const bgAudioRef = useRef(null);

  useEffect(() => {
    if (viewMode === 'GRID' && hoveredStripIndex === null) {
      bgAudioRef.current?.play().catch(e => console.log('Autoplay blocked:', e));
    } else {
      bgAudioRef.current?.pause();
    }
  }, [viewMode, hoveredStripIndex]);

  return (
    <div style={styles.appContainer}>
      <audio ref={bgAudioRef} src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-17.mp3" loop muted={isMuted} />
      <TopNavBar />

      {viewMode === 'GRID' ? (
        <>
          <div style={styles.mainContent}>
            <StripGallery
              hoveredStripIndex={hoveredStripIndex}
              setHoveredStripIndex={handleHover}
              onStripClick={handleStripClick}
              isMuted={isMuted}
              setIsMuted={setIsMuted}
            />
          </div>
          <DynamicTitle hoveredStripIndex={hoveredStripIndex} />
        </>
      ) : (
        <SingleView 
          project={projectData[activeProjectIndex]} 
          allProjects={projectData}
          activeProjectIndex={activeProjectIndex}
          setActiveProjectIndex={setActiveProjectIndex}
          isMuted={isMuted}
          setIsMuted={setIsMuted}
          onClose={() => setViewMode('GRID')}
        />
      )}

      <BottomBar 
        hoveredStripIndex={hoveredStripIndex} 
        viewMode={viewMode}
        setViewMode={setViewMode}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
      />
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
