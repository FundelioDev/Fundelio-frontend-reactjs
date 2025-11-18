import React, { useState, useEffect } from 'react';
import RewardsColumn from './rewards/RewardsColumn';
import StoryWithMenu from './story/StoryWithMenu';
import TocMenu from './story/TocMenu';

const useScrollSpy = (sectionIds) => {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    if (!sectionIds || sectionIds.length === 0) {
      return;
    }

    let observer = null;
    let updateTimeout = null;

    const timeoutId = setTimeout(() => {
      observer = new IntersectionObserver(
        (entries) => {
          if (updateTimeout) {
            clearTimeout(updateTimeout);
          }

          updateTimeout = setTimeout(() => {
            const intersectingElements = [];

            sectionIds.forEach((id) => {
              const element = document.getElementById(id);
              if (element) {
                const rect = element.getBoundingClientRect();
                const viewportHeight = window.innerHeight;

                if (rect.top < viewportHeight * 0.5 && rect.bottom > viewportHeight * 0.2) {
                  intersectingElements.push({
                    id,
                    top: rect.top,
                    bottom: rect.bottom,
                    priority: Math.abs(rect.top - viewportHeight * 0.3)
                  });
                }
              }
            });

            intersectingElements.sort((a, b) => a.priority - b.priority);

            if (intersectingElements.length > 0) {
              const newActiveId = intersectingElements[0].id;
              setActiveId(prev => prev !== newActiveId ? newActiveId : prev);
            }
          }, 50);
        },
        {
          rootMargin: '-5% 0px -50% 0px',
          threshold: [0, 0.25, 0.5, 0.75, 1.0],
        }
      );

      sectionIds.forEach((id) => {
        const element = document.getElementById(id);
        if (element) {
          observer.observe(element);
        }
      });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (updateTimeout) {
        clearTimeout(updateTimeout);
      }
      if (observer) {
        observer.disconnect();
      }
    };
  }, [sectionIds]);

  return activeId;
};

const CampaignPage = ({
  rewards = [],
  creator,
  blanks = [],
  currency = 'USD',
  onPledge,
  campaignId,
}) => {
  // Sort blanks and get section IDs
  const sortedBlanks = [...blanks].sort((a, b) => a.order - b.order);
  const sectionIds = sortedBlanks.map((b) => b.id);

  // Use scroll spy to track active section
  const activeId = useScrollSpy(sectionIds);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)_360px] gap-6 lg:gap-8">
      <div className="order-1 hidden lg:block">
        <TocMenu blanks={sortedBlanks} activeId={activeId} />
      </div>

      <div className="order-2">
        <StoryWithMenu blanks={sortedBlanks} />
      </div>

      <div className="order-3">
        <RewardsColumn
          rewards={rewards}
          creator={creator}
          currency={currency}
          onPledge={onPledge}
          campaignId={campaignId}
        />
      </div>
    </div>
  );
};

export default CampaignPage;
