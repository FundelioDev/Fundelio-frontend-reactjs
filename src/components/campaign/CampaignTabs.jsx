import React, { useState } from 'react';
import CampaignPage from './CampaignPage';

/**
 * CampaignTabs Component
 * Tabbed interface for Campaign / Rewards / Creator / Leaderboard
 */
const CampaignTabs = ({ initialTab = 'campaign', campaignProps = {} }) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  const tabs = [
    { id: 'campaign', label: 'Campaign' },
    { id: 'rewards', label: 'Rewards' },
    { id: 'creator', label: 'Creator' },
    { id: 'leaderboard', label: 'Leaderboard' },
  ];

  return (
    <div>
      {/* Tabs Navigation */}
      <div className="sticky top-[72px] bg-background z-20 border-b border-border">
        <div className="max-w-container mx-auto px-4 lg:px-6">
          <nav
            className="flex gap-6 overflow-x-auto scrollbar-hide"
            role="tablist"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`${tab.id}-panel`}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  py-4 px-2 text-md font-medium whitespace-nowrap
                  border-b-2 transition-colors duration-200 uppercase
                  ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-text-secondary dark:text-text-white hover:text-primary hover:border-border'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-container mx-auto px-4 lg:px-6 py-6 lg:py-8">
        {/* Campaign Tab */}
        {activeTab === 'campaign' && (
          <div
            role="tabpanel"
            id="campaign-panel"
            aria-labelledby="campaign-tab"
          >
            <CampaignPage {...campaignProps} />
          </div>
        )}

        {/* Rewards Tab - Placeholder */}
        {activeTab === 'rewards' && (
          <div
            role="tabpanel"
            id="rewards-panel"
            aria-labelledby="rewards-tab"
            className="py-16 text-center"
          >
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎁</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Rewards Gallery
              </h3>
              <p className="text-secondary">
                Coming soon... Browse all available rewards in a beautiful
                gallery view.
              </p>
            </div>
          </div>
        )}

        {/* Creator Tab - Placeholder */}
        {activeTab === 'creator' && (
          <div
            role="tabpanel"
            id="creator-panel"
            aria-labelledby="creator-tab"
            className="py-16 text-center"
          >
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👤</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Creator Profile
              </h3>
              <p className="text-secondary">
                Coming soon... Learn more about the creator, their projects, and
                history.
              </p>
            </div>
          </div>
        )}

        {/* Leaderboard Tab - Placeholder */}
        {activeTab === 'leaderboard' && (
          <div
            role="tabpanel"
            id="leaderboard-panel"
            aria-labelledby="leaderboard-tab"
            className="py-16 text-center"
          >
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Top Backers
              </h3>
              <p className="text-secondary">
                Coming soon... See who the top supporters of this campaign are!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignTabs;
