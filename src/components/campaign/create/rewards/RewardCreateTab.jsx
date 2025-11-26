import { useState, useEffect, useRef } from "react"
import ComponentsTab from "./tabs/ComponenstTab"
import RewardsTab from "./tabs/RewardsTab"

export default function RewardCreateTab({
  campaignId,
  isReadOnly = false,
  rewardRules = {},
  itemRules = {},
  initialOldItemIdsRef,
  initialOldRewardIdsRef,
}) {
  const [activeTab, setActiveTab] = useState("component");
  const fallbackInitialItemIdsRef = useRef(new Set())
  const fallbackInitialRewardIdsRef = useRef(new Set())
  const itemIdsRef = initialOldItemIdsRef || fallbackInitialItemIdsRef
  const rewardIdsRef = initialOldRewardIdsRef || fallbackInitialRewardIdsRef

  useEffect(() => {
    console.log('[RewardCreateTab] mount', {
      campaignId,
      providedItemRef: Boolean(initialOldItemIdsRef),
      providedRewardRef: Boolean(initialOldRewardIdsRef),
    })
    return () => {
      console.log('[RewardCreateTab] unmount', {
        finalItemOldCount: itemIdsRef.current.size,
        finalRewardOldCount: rewardIdsRef.current.size,
      })
    }
  }, [campaignId, initialOldItemIdsRef, initialOldRewardIdsRef, itemIdsRef, rewardIdsRef])

  useEffect(() => {
    console.log('[RewardCreateTab] sub-tab changed', {
      activeTab,
      snapshotItemOldCount: itemIdsRef.current.size,
      snapshotRewardOldCount: rewardIdsRef.current.size,
    })
  }, [activeTab, itemIdsRef, rewardIdsRef])

  // Sync URL hash with active tab
  useEffect(() => {
    const hash = window.location.hash.slice(1) || "component";
    if (["component", "rewards"].includes(hash)) {
      setActiveTab(hash);
    }
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    window.location.hash = tab
  }

  const tabs = [
    { id: "component", label: "Thành phần" },
    { id: "rewards", label: "Phần thưởng" },
  ]

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Phần thưởng</h2>
        <p className="text-muted-foreground">Quản lý các phần thưởng và thành phần cho dự án của bạn</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-border mb-6">
        <div className="flex gap-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-semibold text-md border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-text-primary dark:text-white hover:text-primary/70 hover:border-primary/70"
                }`}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === "component" && (
          <ComponentsTab
            campaignId={campaignId}
            isReadOnly={isReadOnly}
            itemRules={itemRules}
            initialOldItemIdsRef={itemIdsRef}
          />
        )}
        {activeTab === "rewards" && (
          <RewardsTab
            campaignId={campaignId}
            isReadOnly={isReadOnly}
            rewardRules={rewardRules}
            initialOldRewardIdsRef={rewardIdsRef}
          />
        )}
      </div>
    </div>
  )
}
