import React, { useState, useEffect } from 'react';
import TocMenu from './story/TocMenu';
import { RewardDetailSection } from './rewards/reward-detail/RewardDetalSection';

/**
 * Custom hook for scroll spy functionality
 */
const useScrollSpy = (sectionIds) => {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    if (!sectionIds || sectionIds.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the first intersecting entry
        const intersecting = entries.find((entry) => entry.isIntersecting);

        if (intersecting) {
          setActiveId(intersecting.target.id);
        }
      },
      {
        rootMargin: '0px 0px -60% 0px',
        threshold: 0.2,
      }
    );

    // Observe all sections
    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [sectionIds]);

  return activeId;
};

/**
 * RewardsPage Component
 * Displays reward details with TOC navigation
 */
const RewardsPage = ({ rewards = [], onPledge }) => {
  // Transform rewards to TOC menu items format
  const rewardMenuItems = rewards.map((reward) => ({
    id: reward.reward_id || reward.id,
    title_text: reward.title,
    order: rewards.indexOf(reward),
  }));

  // Use scroll spy to track active reward
  const activeId = useScrollSpy(rewards.map((r) => r.reward_id || r.id));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_280px] gap-6 lg:gap-8 ">
      {/* Left Column - Rewards Detail Sections */}
      <div className="order-1">
        <div className="space-y-8">
          {rewards.map((reward, index) => (
            <div key={reward.reward_id || reward.id}>
              <div
                id={reward.reward_id || reward.id}
                className="scroll-mt-28"
              >
                <RewardDetailSection reward={reward} />
              </div>
              {/* Horizontal rule between rewards, but not after the last one */}
              {index < rewards.length - 1 && (
                <hr className="my-16 border-t border-border/50" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right Column - TOC Menu */}
      <div className="order-2 hidden lg:block">
        <TocMenu
          blanks={rewardMenuItems}
          activeId={activeId}
        />
      </div>
    </div>
  );
};

export default RewardsPage;
