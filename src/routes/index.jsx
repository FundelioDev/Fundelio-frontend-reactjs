import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '../layouts/RootLayout';
import HomePage from '../pages/HomePage';
import CreateCampaignPage from '../pages/CreateCampaignPage';
import CampaignDetailPage from '../pages/CampaignDetailPage';
import LandingPage from '@/pages/LandpingPage';

/**
 * Application routes configuration
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'campaign',
        children: [
          { path: 'detail', element: <CampaignDetailPage /> },
          { path: 'create', element: <CreateCampaignPage /> },
        ],
      },
      {
        path: 'landing',
        element: <LandingPage/>
      }
    ],
  },
]);
