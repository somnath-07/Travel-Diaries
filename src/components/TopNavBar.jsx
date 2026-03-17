import { Bell, Menu } from 'lucide-react';

export default function TopNavBar() {
  return (
    <nav style={styles.nav}>
      <button style={styles.iconButton}>
        <Bell size={24} color="#f1f1f1" />
      </button>
      
      <div style={styles.signature}>
        Somnath
      </div>

      <button style={styles.iconButton}>
        <Menu size={24} color="#f1f1f1" />
      </button>
    </nav>
  );
}

const styles = {
  nav: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '80px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 40px',
    zIndex: 100, // ensure it stays on top of the gallery
    pointerEvents: 'none', // let clicks pass through the empty space
  },
  iconButton: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    pointerEvents: 'auto', // re-enable clicks for buttons
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px',
  },
  signature: {
    fontFamily: '"Dancing Script", cursive',
    fontSize: '48px',
    color: '#f1f1f1',
    pointerEvents: 'auto',
  }
};
