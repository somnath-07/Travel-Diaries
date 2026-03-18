import { Bell, Menu } from 'lucide-react';

export default function TopNavBar() {
  return (
    <nav className="top-nav" style={styles.nav}>
      <button style={styles.iconButton} aria-label="Notifications">
        <Bell size={22} color="#1a1a1a" strokeWidth={1.5} />
      </button>

      <div className="signature-text" style={styles.signature}>
        Somnath
      </div>

      <button style={styles.iconButton} aria-label="Menu">
        <Menu size={22} color="#1a1a1a" strokeWidth={1.5} />
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
    zIndex: 100,
  },
  iconButton: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px',
  },
  signature: {
    fontFamily: '"Dancing Script", cursive',
    fontSize: '42px',
    fontWeight: 500,
    color: '#1a1a1a',
    letterSpacing: '1px',
  },
};
