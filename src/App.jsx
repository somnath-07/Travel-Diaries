import { useState } from 'react';
import TopNavBar from './components/TopNavBar';
import StripGallery from './components/StripGallery';
import ParallaxBackground from './components/ParallaxBackground';
import DynamicTitle from './components/DynamicTitle';
import AudioPlayer from './components/AudioPlayer';
import './index.css';

export default function App() {
  const [hoveredStripIndex, setHoveredStripIndex] = useState(0); // Default to first strip hovered

  return (
    <>
      <ParallaxBackground hoveredStripIndex={hoveredStripIndex} />
      <TopNavBar />
      <StripGallery 
        hoveredStripIndex={hoveredStripIndex} 
        setHoveredStripIndex={setHoveredStripIndex} 
      />
      <DynamicTitle hoveredStripIndex={hoveredStripIndex} />
      <AudioPlayer hoveredStripIndex={hoveredStripIndex} />
    </>
  );
}
