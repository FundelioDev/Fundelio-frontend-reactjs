import React, { useState } from 'react';
import CampaignPage from './CampaignPage';
import RewardsPage from './RewardsPage';
import CreatorProfile from './creator/CreatorProfile';
import Leaderboard from './leaderboard/Leaderboard';

/**
 * CampaignTabs Component
 * Tabbed interface for Campaign / Rewards / Creator / Leaderboard
 */
const CampaignTabs = ({ initialTab = 'campaign', campaignProps = {} }) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  const tabs = [
    { id: 'campaign', label: 'Chiến dịch' },
    { id: 'rewards', label: 'Phần thưởng' },
    { id: 'creator', label: 'Người tạo' },
    { id: 'leaderboard', label: 'Bảng xếp hạng' },
  ];

  return (
    <div>
      {/* Tabs Navigation */}
      <div className="sticky top-0 bg-white dark:bg-darker z-20 shadow-sm">
        <div className="max-w-container mx-auto px-4 lg:px-6">
          <nav
            className="flex gap-x-0.5 overflow-x-auto scrollbar-hide"
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
                  py-4 px-4 text-md font-medium whitespace-nowrap
                  border-b-2 transition-colors duration-200 uppercase
                  ${activeTab === tab.id
                    ? 'border-primary text-primary bg-white dark:bg-darker-2'
                    : 'border-transparent text-text-secondary dark:text-white hover:text-primary hover:border-primary/40'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content - Campaign có bg-white, còn lại bg-background-light-2 */}
      <div className={`${activeTab === 'campaign' ? 'bg-white dark:bg-darker' : 'bg-background-light-2 dark:bg-darker'}`}>
        <div className="max-w-container mx-auto py-6 lg:py-8">
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
            >
              <RewardsPage
                rewards={campaignProps.rewards || []}
                items={campaignProps.items || []}
                addOns={campaignProps.addOns || []}
                onPledge={campaignProps.onPledge}
              />
            </div>
          )}

          {/* Creator Tab - Placeholder */}
          {activeTab === 'creator' && (
            <div
              role="tabpanel"
              id="creator-panel"
              aria-labelledby="creator-tab"
            >
              <CreatorProfile
                creator={campaignProps.creator}
                otherProjects={campaignProps.otherProjects || []}
              />
            </div>
          )}

          {/* Leaderboard Tab - Placeholder */}
          {activeTab === 'leaderboard' && (
            <div
              role="tabpanel"
              id="leaderboard-panel"
              aria-labelledby="leaderboard-tab"
            >
              <Leaderboard />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampaignTabs;
