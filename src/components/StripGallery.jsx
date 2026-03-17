import Strip from './Strip';

const stripsData = [
  { id: 0, title: "Pocahontas", song: "Colors of the Wind", imageUrl: "https://picsum.photos/seed/strip0/800/1200", videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" },
  { id: 1, title: "Aladdin", song: "Speechless", imageUrl: "https://picsum.photos/seed/strip1/800/1200", videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" },
  { id: 2, title: "Enchanted", song: "That's How You Know", imageUrl: "https://picsum.photos/seed/strip2/800/1200", videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" },
  { id: 3, title: "Newsies", song: "Seize the Day", imageUrl: "https://picsum.photos/seed/strip3/800/1200", videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4" },
  { id: 4, title: "Hercules", song: "Zero to Hero", imageUrl: "https://picsum.photos/seed/strip4/800/1200", videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4" },
  { id: 5, title: "Beauty", song: "Belle", imageUrl: "https://picsum.photos/seed/strip5/800/1200", videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4" },
  { id: 6, title: "Tangled", song: "I See the Light", imageUrl: "https://picsum.photos/seed/strip6/800/1200", videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4" },
  { id: 7, title: "Mulan", song: "Reflection", imageUrl: "https://picsum.photos/seed/strip7/800/1200", videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
  { id: 8, title: "Tarzan", song: "You'll Be in My Heart", imageUrl: "https://picsum.photos/seed/strip8/800/1200", videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4" },
  { id: 9, title: "The Little Mermaid", song: "Part of Your World", imageUrl: "https://picsum.photos/seed/strip9/800/1200", videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4" },
];

export default function StripGallery({ hoveredStripIndex, setHoveredStripIndex }) {
  return (
    <div style={styles.container}>
      {stripsData.map((strip, index) => (
        <Strip
          key={strip.id}
          strip={strip}
          index={index}
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
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    width: '100%',
    height: '100%',
  },
};
