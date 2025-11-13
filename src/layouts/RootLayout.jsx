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

  // Check if current route is any campaign detail page
  const isCampaignDetail =
    location.pathname.includes('/campaigns/detail') ||
    location.pathname.match(/^\/campaigns\/[a-f0-9-]+$/i) ||
    location.pathname.match(/^\/campaigns\/preview\/[a-f0-9-]+$/i);

  // Check if current route is preview mode
  const isPreviewMode = location.pathname.match(/^\/campaigns\/preview\/[a-f0-9-]+$/i);

  const isHeaderFixed = !isCampaignDetail;

  return (
    <div className={`flex flex-col min-h-screen ${!isCampaignDetail ? 'overflow-x-hidden' : ''}`}>
      {location.pathname !== '/' && !isPreviewMode && <Header variant={headerVariant} isFixed={isHeaderFixed} />} 
      {/*  */}
      <main className={`flex-1 ${!isCampaignDetail ? 'overflow-x-hidden' : ''}`}>
        <Outlet />
      </main>

      {/* <Footer /> */}
      {location.pathname !== '/' && !isPreviewMode && <Footer />}
    </div>
  );
}
