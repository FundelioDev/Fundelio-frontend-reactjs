import React from 'react';
import { Outlet } from 'react-router-dom';
import CreateCampaignHeader from '../components/common/CreateCampaignHeader';
import Footer from '../components/common/Footer';

/**
 * CreateCampaignLayout - Layout for create campaign pages
 * @param {Object} props
 * @param {string} props.activeTab - Current active tab
 * @param {Function} props.onTabChange - Callback when tab changes
 * @param {Function} props.onPreview - Callback when preview button clicked
 */
export const CreateCampaignLayout = ({ 
  activeTab, 
  onTabChange,
  onPreview 
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-darker transition-colors duration-300">
      {/* Header */}
      <CreateCampaignHeader 
        activeTab={activeTab}
        onTabChange={onTabChange}
        onPreview={onPreview}
      />

      {/* Main Content */}
      <main className="flex-1 w-full">
        <div className="mx-auto max-w-container px-4 sm:px-6 pt-20 pb-12">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CreateCampaignLayout;
