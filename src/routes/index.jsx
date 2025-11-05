import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '../layouts/RootLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import AdminLayout from '../layouts/AdminLayout';
import HomePage from '../pages/HomePage';
import CreateCampaignPage from '../pages/CreateCampaignPage';
import CampaignDetailPage from '../pages/CampaignDetailPage';
import LandingPage from '@/pages/LandingPage';
import DashboardPage from '@/pages/DashboardPage';

import { AuthPage } from '@/pages/AuthPage';
import ResetPasswordPage from '@/pages/ResetPasswordPage';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import UsersPage from '@/pages/admin/UsersPage';
import RolesPage from '@/pages/admin/RolesPage';
import PermissionsPage from '@/pages/admin/PermissionsPage';
import AdminCampaignsPage from '@/pages/admin/AdminCampaignsPage';
import WalletPage from '@/pages/WalletPage';
import YourProjectsPage from '@/pages/YourProjectsPage';


/**
 * Application routes configuration
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,

    children: [
      { index: true, element: <LandingPage /> },

      { path: 'home', element: <HomePage /> },

      { path: 'dashboard', element: <DashboardPage /> },

      {
        path: 'campaigns',
        children: [
          { path: 'detail', element: <CampaignDetailPage /> },
          { path: 'preview/:previewId', element: <CampaignDetailPage /> },
        ],
      },

      { path: 'wallet', element: <WalletPage /> },

      { path: 'your-projects', element: <YourProjectsPage /> },

      // {
      //   path: 'auth',
      //   children: [
      //     { path: 'login', element: <LoginPage /> },
      //     { path: 'register', element: <RegisterPage /> },
      //   ],
      // }
    ],
  },
  {
    path: '/campaigns/create',
    element: <CreateCampaignPage />,
  },
  {
    path: '/auth',
    element: (
      <AuthLayout>
        <AuthPage />
      </AuthLayout>
    ),
  },
  {
    path: '/reset-password',
    element: <ResetPasswordPage />,
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'users', element: <UsersPage /> },
      { path: 'roles', element: <RolesPage /> },
      { path: 'permissions', element: <PermissionsPage /> },
      { path: 'campaigns', element: <AdminCampaignsPage /> },
    ],
  },
]);

