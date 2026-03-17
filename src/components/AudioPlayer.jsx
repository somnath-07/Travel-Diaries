import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function AudioPlayer({ hoveredStripIndex }) {
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef(null);
  
  // Create an array of 10 generic mp3 URLs or different tracks if available. 
  // We'll just use a couple of sample tracks and rotate them for the 10 strips.
  const audioTracks = [
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
  ];

  const currentTrack = hoveredStripIndex === null ? audioTracks[0] : audioTracks[hoveredStripIndex];

  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;
    
    // Simple crossfade logic: fade out, change source, fade in
    // Real implementation would use AudioContext for true crossfades between two Audio objects
    const fadeOut = setInterval(() => {
      if (audio.volume > 0.05) {
        audio.volume -= 0.05;
      } else {
        clearInterval(fadeOut);
        audio.src = currentTrack;
        if (!isMuted) {
          audio.play().catch(e => console.log("Audio play blocked by browser:", e));
        }
        const fadeIn = setInterval(() => {
          if (audio.volume < 0.95) {
            audio.volume += 0.05;
          } else {
            audio.volume = 1;
            clearInterval(fadeIn);
          }
        }, 50);
      }
    }, 50);

    return () => clearInterval(fadeOut);
  }, [currentTrack, isMuted]);

  useEffect(() => {
    if (audioRef.current && !isMuted) {
      if (audioRef.current.paused) {
        audioRef.current.play().catch(e => console.log("Audio play blocked", e));
      }
    } else if (audioRef.current && isMuted) {
       audioRef.current.pause();
    }
  }, [isMuted]);

  return (
    <div style={styles.container}>
      <audio ref={audioRef} src={currentTrack} loop />
      <button 
        style={styles.toggleButton} 
        onClick={() => setIsMuted(!isMuted)}
      >
        {isMuted ? <VolumeX size={24} color="#f1f1f1" /> : <Volume2 size={24} color="#f1f1f1" />}
      </button>
      <div style={styles.text}>
        {isMuted ? "Audio Muted - Click to Enable" : "Audio Playing - Crossfades on Hover"}
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: 'absolute',
    bottom: '40px',
    left: '40px',
    zIndex: 100,
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  toggleButton: {
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '50%',
    width: '48px',
    height: '48px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.3s ease',
  },
  text: {
    fontFamily: '"Outfit", sans-serif',
    fontSize: '14px',
    color: '#rgba(255,255,255,0.6)',
    letterSpacing: '2px',
    textTransform: 'uppercase',
  }
};
