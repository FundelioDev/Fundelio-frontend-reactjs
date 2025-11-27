import React, { useState, useEffect } from 'react';
import TocMenu from './story/TocMenu';
import { RewardDetailSection } from './rewards/reward-detail/RewardDetalSection';
import { PledgeSummaryCard } from './rewards/reward-detail/PledgeSummaryCard';
import { Info } from 'lucide-react';

/**
 * Custom hook for scroll spy functionality
 */
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
          rootMargin: '-20% 0px -30% 0px',
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

const RewardsPage = ({ rewards = [], items = [], addOns = [], onPledge, campaignId, isPreview = false, isOwnerViewing = false }) => {
  const [selectedRewards, setSelectedRewards] = useState([]);
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const pledgeLocked = isPreview || isOwnerViewing;
  const lockedMessage = isPreview
    ? 'Bạn đang ở chế độ xem trước nên không thể ủng hộ.'
    : 'Nhà sáng tạo không thể ủng hộ chiến dịch của chính mình.';

  const rewardMenuItems = rewards.map((reward) => ({
    id: reward.rewardId,
    titleText: reward.title,
    order: rewards.indexOf(reward),
  }));

  const rewardIds = rewards.map((r) => String(r.rewardId || r.reward_id || r.id));
  const activeId = useScrollSpy(rewardIds);

  const handleSelectReward = (rewardData) => {
    if (pledgeLocked) return;
    // Always add as a new item instead of updating existing one
    // This allows users to add the same reward multiple times with different configurations
    setSelectedRewards([...selectedRewards, rewardData]);

    if (onPledge) {
      onPledge(rewardData);
    }
  };

  const handleSelectAddOn = (addon, isSelected) => {
    if (isSelected) {
      setSelectedAddOns([...selectedAddOns, { ...addon, quantity: 1 }]);
    } else {
      setSelectedAddOns(selectedAddOns.filter(a => a.id !== addon.id));
    }
  };

  const handleRemoveItem = (type, rewardIndex, addonIndex) => {
    if (type === 'reward') {
      setSelectedRewards(selectedRewards.filter((_, index) => index !== rewardIndex));
    } else if (type === 'addon') {
      if (rewardIndex !== undefined) {
        const updated = [...selectedRewards];
        updated[rewardIndex] = {
          ...updated[rewardIndex],
          addOns: updated[rewardIndex].addOns.filter((_, index) => index !== addonIndex),
        };
        setSelectedRewards(updated);
      } else {
        setSelectedAddOns(selectedAddOns.filter((_, index) => index !== addonIndex));
      }
    }
  };

  const handlePickAddOns = () => {
    console.log('Pick add-ons clicked');
  };

  const handleSubmit = () => {
    if (!pledgeLocked && selectedRewards.length > 0 && onPledge) {
      onPledge({
        rewards: selectedRewards,
        addOns: selectedAddOns,
      });
    }
  };

  console.log('RewardsPage render:', rewards);


  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(180px,220px)_minmax(0,1fr)_minmax(180px,220px)] xl:grid-cols-[minmax(220px,260px)_minmax(0,1fr)_minmax(220px,260px)] 2xl:grid-cols-[minmax(240px,280px)_minmax(0,1fr)_minmax(240px,280px)] gap-4 md:gap-5 lg:gap-6 xl:gap-8">
      {pledgeLocked && (
        <div className="lg:col-span-3 order-first">
          <div className="flex items-start gap-3 rounded-sm border border-amber-300 bg-amber-50 text-amber-900 px-4 py-3 text-sm max-w-fit">
            <Info className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <p>{lockedMessage}</p>
          </div>
        </div>
      )}
      {/* Left Column - TOC Menu */}
      <div className="order-2 lg:order-1 hidden lg:block">
        <TocMenu blanks={rewardMenuItems} activeId={activeId} />
      </div>

      {/* Center Column - Reward Cards */}
      <div className="order-1 lg:order-2" id="rewards-section">
        <RewardDetailSection
          rewards={rewards}
          items={items}
          addOns={addOns}
          onSelectReward={handleSelectReward}
          onSelectAddOn={handleSelectAddOn}
          campaignId={campaignId}
          isPreview={isPreview}
          isOwnerViewing={isOwnerViewing}
        />
      </div>

      {/* Right Column - Pledge Summary */}
      <div className="order-3 hidden lg:block">
        <PledgeSummaryCard
          selectedRewards={selectedRewards}
          selectedAddOns={selectedAddOns}
          onRemoveItem={handleRemoveItem}
          onPickAddOns={handlePickAddOns}
          onSubmit={handleSubmit}
          isPreview={isPreview}
          isOwnerViewing={isOwnerViewing}
        />
      </div>
    </div>
  );
};

export default RewardsPage;
