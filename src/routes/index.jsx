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
import YourProjectsPage from '@/pages/YourProjectsPage';
import NotFoundPage from '@/pages/NotFoundPage';
import ForbiddenPage from '@/pages/ForbiddenPage';
import UserProfilePage from '@/pages/UserProfilePage';
import PledgeSummaryPage from '@/pages/PledgeSummaryPage';
import BecomeFounderPage from '@/pages/BecomeFounderPage';

import VerifyChangeEmail from '@/components/auth/VerifyChangeEmail';
import CampaignOverviewPage from '@/components/campaign/dashboard/CampaignOverviewPage';
import CampaignStatisticsPage from '@/components/campaign/dashboard/CampaignStatisticsPage';
import FounderDashboardPage from '@/pages/FounderDashboardPage';
import CampaignBackersPage from '@/components/campaign/dashboard/CampaignBackersPage';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { PublicRoute } from '@/components/auth/PublicRoute';
import PaymentPage from '@/components/wallet/PaymentPage';
import History from '@/components/wallet/History';
import PaymentCallback from '@/components/wallet/PaymentCallback';
import WebSocketTestComponent from '@/components/websocket/WebSocketTestComponent';
import MyPledgesPage from '@/pages/pledges/MyPledgesPage';
import SearchPage from '@/pages/SearchPage';
import TermsOfServicePage from '@/pages/TermsOfServicePage';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';
import RefundPolicyPage from '@/pages/RefundPolicyPage';


import BuildCommunity from '../components/home/build-community'; 
import LaunchGuidePage from '../components/home/launch';
import CreateProject from '../components/home/create-project';
import SuccessStories from '../components/home/success-stories';
import About from '../components/home/about';
import MakertingStrategies from '../components/home/marketing-strategies';
import PitchDeckGuide from '../components/home/pitch-deck-guide';
import BuildCommunityContent from '../components/home/build-community-content';
import VideoOptimization from '../components/home/video-optimization';
import FinancialManagement from '../components/home/financial-management';
import BackerPsychology from '../components/home/backer-psychology';

const CommunityConnectPage = () => {
  return (
    <div>
      <BuildCommunity />
    </div>
  );
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [

      { index: true, element: <LandingPage /> },
      { path: 'home', element: <HomePage /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'terms-of-service', element: <TermsOfServicePage /> },
      { path: 'privacy-policy', element: <PrivacyPolicyPage /> },
      { path: 'refund-policy', element: <RefundPolicyPage /> },
      

      { path: 'build-community', element: <CommunityConnectPage /> },
      { path: 'launch', element: <LaunchGuidePage /> }, 
      { path: 'create-project', element: <CreateProject /> },
      { path: 'success-stories', element: <SuccessStories /> },
      { path: 'about', element: <About /> },
      { path: 'marketing-strategies', element: <MakertingStrategies /> },
      { path: 'pitch-deck-guide', element: <PitchDeckGuide /> },
      { path: 'build-community-content', element: <BuildCommunityContent /> },
      { path: 'video-optimization', element: <VideoOptimization /> },
      { path: 'financial-management', element: <FinancialManagement /> },
      { path: 'backer-psychology', element: <BackerPsychology /> },

      {
        path: 'dashboard',
        element: (
          <PublicRoute requiresAuth>
            <DashboardPage />
          </PublicRoute>
        )
      },
      {
        path: 'founder-dashboard',
        element: (
          <PublicRoute requiresAuth>
            <FounderDashboardPage />
          </PublicRoute>
        )
      },
      {
        path: 'profile',
        element: (
          <PublicRoute requiresAuth>
            <UserProfilePage />
          </PublicRoute>
        )
      },
      {
        path: 'become-founder',
        element: (
          <PublicRoute requiresAuth>
            <BecomeFounderPage />
          </PublicRoute>
        )
      },
      {
        path: 'my-pledges',
        element: (
          <PublicRoute requiresAuth>
            <MyPledgesPage />
          </PublicRoute>
        )
      },
      {
        path: 'your-projects',
        element: (
          <PublicRoute requiresAuth>
            <YourProjectsPage />
          </PublicRoute>
        )
      },

      {
        path: 'campaigns',
        children: [
          { path: 'detail', element: <CampaignDetailPage /> },
          {
            path: 'preview/:campaignId',
            element: <CampaignDetailPage isPreviewMode={true} />,
          },
          { path: ':campaignId', element: <CampaignDetailPage /> },
          {
            path: ':campaignId/pledge',
            element: (
              <PublicRoute requiresAuth>
                <PledgeSummaryPage />
              </PublicRoute>
            )
          },
          {
            path: ':campaignId/dashboard',
            element: (
              <PublicRoute requiresAuth>
                <CampaignOverviewPage />
              </PublicRoute>
            )
          },
          {
            path: ':campaignId/statistics',
            element: (
              <PublicRoute requiresAuth>
                <CampaignStatisticsPage />
              </PublicRoute>
            ),
          },
          {
            path: ':campaignId/backers',
            element: (
              <PublicRoute requiresAuth>
                <CampaignBackersPage />
              </PublicRoute>
            ),
          },
        ],
      },

      // Wallet routes - require login
      {
        path: 'wallet',
        element: (
          <PublicRoute requiresAuth>
            <History />
          </PublicRoute>
        )
      },
      {
        path: 'payment',
        element: (
          <PublicRoute requiresAuth>
            <PaymentPage />
          </PublicRoute>
        )
      },
      {
        path: 'payment/callback',
        element: (
          <PublicRoute requiresAuth>
            <PaymentCallback />
          </PublicRoute>
        )
      },

      {
        path: 'websocket',
        element: (
          <PublicRoute requiresAuth>
            <WebSocketTestComponent />
          </PublicRoute>
        )
      },
    ],
  },
  {
    path: '/campaigns/create',
    element: (
      <PublicRoute requiresAuth>
        <CreateCampaignPage />
      </PublicRoute>
    ),
  },
  {
    path: '/campaigns/:campaignId/edit',
    element: (
      <PublicRoute requiresAuth>
        <CreateCampaignPage />
      </PublicRoute>
    ),
  },
  // --- AUTH ROUTES (ĐÃ GỘP LẠI THÀNH 1 KHỐI DUY NHẤT) ---
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
  // --- ADMIN ROUTES ---
  {
    path: '/admin',
    element: (
      <ProtectedRoute requiredRole='ADMIN'>
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
    path: '*',
    element: <NotFoundPage />,
  },
  { path: '/403', element: <ForbiddenPage /> },
]);