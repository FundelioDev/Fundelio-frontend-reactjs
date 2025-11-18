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
import { VerifyAccountPage } from '@/pages/VerifyAccountPage';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import UsersPage from '@/pages/admin/UsersPage';
import RolesPage from '@/pages/admin/RolesPage';
import PermissionsPage from '@/pages/admin/PermissionsPage';
import AdminCampaignsPage from '@/pages/admin/AdminCampaignsPage';
import WalletPage from '@/pages/WalletPage';
import YourProjectsPage from '@/pages/YourProjectsPage';
import NotFoundPage from '@/pages/NotFoundPage';
import ForbiddenPage from '@/pages/ForbiddenPage';
import UserProfilePage from "@/pages/UserProfilePage";
import PledgeSummaryPage from '@/pages/PledgeSummaryPage';
import BecomeFounderPage from '@/pages/BecomeFounderPage';

import VerifyChangeEmail from '@/components/auth/VerifyChangeEmail';

import CampaignOverviewPage from '@/components/campaign/dashboard/CampaignOverviewPage';
import CampaignStatisticsPage from '@/components/campaign/dashboard/CampaignStatisticsPage';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import WebSocketTestComponent from '@/components/websocket/WebSocketTestComponent';
import MyPledgesPage from '@/pages/pledges/MyPledgesPage';
import SearchPage from '@/pages/SearchPage';
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
      { path: 'search', element: <SearchPage /> },

      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'profile', element: <UserProfilePage /> },
      { path: 'become-founder', element: <BecomeFounderPage /> },
      { path: 'my-pledges', element: <MyPledgesPage /> },
      { path: 'search', element: <SearchPage /> },
      {
        path: 'campaigns',
        children: [
          { path: 'detail', element: <CampaignDetailPage /> },
          { path: 'preview/:campaignId', element: <CampaignDetailPage isPreviewMode={true} /> },
          { path: ':campaignId', element: <CampaignDetailPage /> },
          { path: ':campaignId/pledge', element: <PledgeSummaryPage /> },
          { path: ':campaignId/dashboard', element: <CampaignOverviewPage /> },
          { path: ':campaignId/statistics', element: <CampaignStatisticsPage /> },
        ],
      },

      { path: 'wallet', element: <WalletPage /> },

      { path: 'your-projects', element: <YourProjectsPage /> },
      { path: 'websocket', element: <WebSocketTestComponent /> },
    ]
  },
  {
    path: '/campaigns/create',
    element: <CreateCampaignPage />,
  },
  {
    path: '/campaigns/:campaignId/edit',
    element: <CreateCampaignPage />,
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { index: true, element: <AuthPage /> },
      { path: 'reset-password', element: <ResetPasswordPage /> },
      { path: 'verify-active-account', element: <VerifyAccountPage /> },
    ],
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute requiredRole="ADMIN">
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'users', element: <UsersPage /> },
      { path: 'roles', element: <RolesPage /> },
      { path: 'permissions', element: <PermissionsPage /> },
      { path: 'campaigns', element: <AdminCampaignsPage /> },
    ],
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { index: true, element: <AuthPage /> },
      { path: 'reset-password', element: <ResetPasswordPage /> },
      { path: 'verify-active-account', element: <VerifyAccountPage /> },
      { path: 'verify-change-email', element: <VerifyChangeEmail /> },
    ],
  },
  // Catch all 404 - must be last
  {
    path: '*',
    element: <NotFoundPage />,
  },
  { path: '/403', element: <ForbiddenPage /> },
]);
