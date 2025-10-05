import React, { useState, useEffect } from 'react';
import RewardsColumn from './rewards/RewardsColumn';
import StoryWithMenu from './story/StoryWithMenu';
import TocMenu from './story/TocMenu';

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
          console.log('📍 Scroll Spy Active:', intersecting.target.id);
          setActiveId(intersecting.target.id);
        }
      },
      {
        rootMargin: '0px 0px -60% 0px',
        threshold: 0.2,
      }
    );

    // Observe all sections
    console.log('👀 Observing sections:', sectionIds);
    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
        console.log('✅ Observing:', id);
      } else {
        console.warn('⚠️ Element not found:', id);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [sectionIds]);

  return activeId;
};

/**
 * CampaignPage Component
 * Main campaign page with 3 columns: Rewards / Story / Menu
 */
const CampaignPage = ({
  rewards = [],
  creator,
  blanks = [],
  currency = 'USD',
  onPledge,
}) => {
  // Sort blanks and get section IDs
  const sortedBlanks = [...blanks].sort((a, b) => a.order - b.order);
  const sectionIds = sortedBlanks.map((b) => b.id);

  // Use scroll spy to track active section
  const activeId = useScrollSpy(sectionIds);

  // Debug log
  useEffect(() => {
    console.log('🔍 CampaignPage State:', {
      totalBlanks: sortedBlanks.length,
      activeId,
    });
  }, [activeId, sortedBlanks.length]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[360px_minmax(0,1fr)_260px] gap-6 lg:gap-8">
      {/* Left Column - Rewards */}
      <div className="order-1">
        <RewardsColumn
          rewards={rewards}
          creator={creator}
          currency={currency}
          onPledge={onPledge}
        />
      </div>

      {/* Middle Column - Story */}
      <div className="order-2">
        <StoryWithMenu blanks={sortedBlanks} />
      </div>

      {/* Right Column - TOC Menu */}
      <div className="order-3 hidden lg:block">
        <TocMenu blanks={sortedBlanks} activeId={activeId} />
      </div>
    </div>
  );
};

export default CampaignPage;
