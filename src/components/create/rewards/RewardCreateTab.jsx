import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import ComponentsTab from "./tabs/ComponenstTab"
import RewardsTab from "./tabs/RewardsTab"
import AddOnsTab from "./tabs/AddOnsTab"

/**
 * @typedef {Object} Item
 * @property {string} id
 * @property {string} title
 * @property {string} [image]
 * @property {string[]} [rewardRefs]
 */

/**
 * @typedef {Object} Reward
 * @property {string} id
 * @property {string} title
 * @property {string} [description]
 * @property {string} [image]
 * @property {number} price
 * @property {Array<{itemId: string, qty: number}>} items
 * @property {{month: number, year: number}} delivery
 * @property {'anywhere' | 'custom'} shipping
 * @property {number} [limitTotal]
 * @property {number} [limitPerBacker]
 * @property {boolean} [allowAddOns]
 */

/**
 * @typedef {Object} AddOn
 * @property {string} id
 * @property {string} title
 * @property {number} price
 * @property {string} [image]
 * @property {Array<{itemId: string, qty: number}>} items
 * @property {{month: number, year: number}} [delivery]
 * @property {string[]} [offeredWithRewardIds]
 * @property {number} [limitTotal]
 */

/**
 * @typedef {Object} RewardsState
 * @property {Item[]} items
 * @property {Reward[]} rewards
 * @property {AddOn[]} addOns
 */

export default function RewardCreateTab() {
  const dispatch = useDispatch();
  const rewardsState = useSelector((state) => state.campaign.rewards);
  const [activeTab, setActiveTab] = useState("component");

  // Sync URL hash with active tab
  useEffect(() => {
    const hash = window.location.hash.slice(1) || "component";
    if (["component", "rewards", "addons"].includes(hash)) {
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
    { id: "addons", label: "Add-ons" },
  ]

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Phần thưởng & Add-ons</h2>
        <p className="text-muted-foreground">Quản lý các phần thưởng, thành phần và add-ons cho dự án của bạn</p>
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
            state={rewardsState}
            dispatch={dispatch}
          />
        )}
        {activeTab === "rewards" && (
          <RewardsTab
            state={rewardsState}
            dispatch={dispatch}
          />
        )}
        {activeTab === "addons" && (
          <AddOnsTab
            state={rewardsState}
            dispatch={dispatch}
          />
        )}
      </div>
    </div>
  )
}
