import React from 'react';
import Header from './Header'
import Footer from './Footer'

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <main style={{ flex: 1, padding: '5rem 1rem' /* ヘッダー分の余白を確保 */ }}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
