import React from 'react';

export default function Footer() {
  return (
    <footer style={{ textAlign: 'center', padding: '1rem', background: '#f5f5f5', marginTop: '2rem' }}>
      <small>Relax Total &copy; {new Date().getFullYear()}</small>
    </footer>
  );
}
