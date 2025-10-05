import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

/**
 * Root layout component that wraps all pages
 * Includes header, main content area, and footer
 */
export default function RootLayout() {
  const location = useLocation();
  const headerVariant = location.pathname === '/' ? 'transparent' : 'light';
  return (
    <div className="flex flex-col min-h-screen">
      <Header variant={headerVariant} />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
