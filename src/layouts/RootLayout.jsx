import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

/**
 * Root layout component that wraps all pages
 * Includes header, main content area, and footer
 */
export default function RootLayout() {
  const location = useLocation();
  const headerVariant = location.pathname === '/home' ? 'transparent' : 'light';
  const isHeaderFixed = !location.pathname.includes('/campaigns/detail');
  const isCampaignDetail = location.pathname.includes('/campaigns/detail');
  
  return (
    <div className={`flex flex-col min-h-screen ${!isCampaignDetail ? 'overflow-x-hidden' : ''}`}>
      {location.pathname !== '/' && <Header variant={headerVariant} isFixed={isHeaderFixed} />}

      <main className={`flex-1 ${!isCampaignDetail ? 'overflow-x-hidden' : ''}`}>
        <Outlet />
      </main>

      {/* <Footer /> */}
      {location.pathname !== '/' && <Footer />}
    </div>
  );
}
