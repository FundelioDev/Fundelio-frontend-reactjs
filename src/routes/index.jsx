import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '../layouts/RootLayout';
import BlankLayout from '../layouts/BlankLayout';
import HomePage from '../pages/HomePage';
import CreateCampaignPage from '../pages/CreateCampaignPage';
import CampaignDetailPage from '../pages/CampaignDetailPage';

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
        element: <CampaignDetailPage />,
      },
    ],
  },
  {
    // Routes without header/footer (full-screen pages)
    element: <BlankLayout />,
    children: [
      {
        path: 'create-campaign',
        element: <CreateCampaignPage />,
      },
    ],
  },
  // Add more routes here as needed
  // {
  //   path: '/campaigns',
  //   element: <CampaignsPage />,
  // },
  // {
  //   path: '/campaign/:id',
  //   element: <CampaignDetailPage />,
  // },
]);
