import { useState, useRef, useEffect } from 'react';
import TopNavBar from './components/TopNavBar';
import StripGallery from './components/StripGallery';
import DynamicTitle from './components/DynamicTitle';
import BottomBar from './components/BottomBar';
import SingleView from './components/SingleView';
import Loader from './components/Loader';
import { projectData } from './data/projects';
import './index.css';

export default function App() {
  const [hoveredStripIndex, setHoveredStripIndex] = useState(null); // Default to unhovered
  const [viewMode, setViewMode] = useState('GRID'); // 'GRID' | 'SINGLE'
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showLoader, setShowLoader] = useState(true);

  const handleHover = (index) => {
    setHoveredStripIndex(index);
    if (index !== null) {
      setActiveProjectIndex(index);
    }
  };

  const handleStripClick = (index) => {
    setActiveProjectIndex(index);
  };

  return (
    <div style={styles.appContainer}>
      {showLoader && <Loader onComplete={() => setShowLoader(false)} />}
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
              activeProjectIndex={activeProjectIndex}
              setActiveProjectIndex={setActiveProjectIndex}
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
    height: '100dvh',
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
