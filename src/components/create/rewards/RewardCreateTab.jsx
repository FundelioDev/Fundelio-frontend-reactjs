import { useState, useReducer, useEffect } from "react"
import { useLocalStorage } from "@/hooks/useLocalStorge"
import ComponentsTab from "./tabs/ComponenstTab"
import RewardsTab from "./tabs/RewardsTab"
import AddOnsTab from "./tabs/AddOnsTab"
import { Gift, Plus, Zap } from "lucide-react"

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

const initialState = {
  items: [
    { id: "1", title: "Sách in", image: null, rewardRefs: [] },
    { id: "2", title: "Sticker set", image: null, rewardRefs: [] },
  ],
  rewards: [
    {
      id: "r1",
      title: "Phiên bản giới hạn có chữ ký",
      description: "Nhận bản in sớm nhất",
      image: 'https://images.unsplash.com/photo-1761165308325-e54c62985813?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=987',
      price: 1,
      items: [{ itemId: "1", qty: 1 }],
      delivery: { month: 1, year: 2025 },
      shipping: "anywhere",
      allowAddOns: false,
    },
  ],
  addOns: [],
}

function rewardsReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM":
      return {
        ...state,
        items: [...state.items, action.payload],
      }
    case "UPDATE_ITEM":
      return {
        ...state,
        items: state.items.map((item) => (item.id === action.payload.id ? action.payload : item)),
      }
    case "DELETE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      }
    case "ADD_REWARD":
      return {
        ...state,
        rewards: [...state.rewards, action.payload],
      }
    case "UPDATE_REWARD":
      return {
        ...state,
        rewards: state.rewards.map((reward) => (reward.id === action.payload.id ? action.payload : reward)),
      }
    case "DELETE_REWARD":
      return {
        ...state,
        rewards: state.rewards.filter((reward) => reward.id !== action.payload),
      }
    case "DUPLICATE_REWARD":
      const rewardToDuplicate = state.rewards.find((r) => r.id === action.payload)
      if (!rewardToDuplicate) return state
      return {
        ...state,
        rewards: [
          ...state.rewards,
          {
            ...rewardToDuplicate,
            id: `r${Date.now()}`,
            title: `${rewardToDuplicate.title} (Bản sao)`,
          },
        ],
      }
    case "ADD_ADDON":
      return {
        ...state,
        addOns: [...state.addOns, action.payload],
      }
    case "UPDATE_ADDON":
      return {
        ...state,
        addOns: state.addOns.map((addon) => (addon.id === action.payload.id ? action.payload : addon)),
      }
    case "DELETE_ADDON":
      return {
        ...state,
        addOns: state.addOns.filter((addon) => addon.id !== action.payload),
      }
    case "SET_STATE":
      return action.payload
    default:
      return state
  }
}

export default function RewardCreateTab({ setIsEditing, setSaveCallback, setCancelCallback }) {
  const [state, dispatch] = useReducer(rewardsReducer, initialState)
  const [activeTab, setActiveTab] = useState("component")
  const [mounted, setMounted] = useState(false)
  const { value: savedState, setValue: setSavedState } = useLocalStorage("ff:rewards", null)

  // Hydrate from localStorage
  useEffect(() => {
    setMounted(true)
    if (savedState) {
      dispatch({ type: "SET_STATE", payload: savedState })
    }
  }, [])

  // Debounced save to localStorage
  useEffect(() => {
    if (!mounted) return
    const timer = setTimeout(() => {
      setSavedState(state)
    }, 500)
    return () => clearTimeout(timer)
  }, [state, mounted, setSavedState])

  // Sync URL hash with active tab
  useEffect(() => {
    const hash = window.location.hash.slice(1) || "component"
    if (["component", "rewards", "addons"].includes(hash)) {
      setActiveTab(hash)
    }
  }, [])

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setIsEditing(false)
    window.location.hash = tab
  }

  if (!mounted) return null

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
              className={`flex items-center gap-2 px-4 py-3 font-semibold text-md border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
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
            state={state} 
            dispatch={dispatch} 
            setIsEditing={setIsEditing}
            setSaveCallback={setSaveCallback}
            setCancelCallback={setCancelCallback}
          />
        )}
        {activeTab === "rewards" && (
          <RewardsTab 
            state={state} 
            dispatch={dispatch} 
            setIsEditing={setIsEditing}
            setSaveCallback={setSaveCallback}
            setCancelCallback={setCancelCallback}
          />
        )}
        {activeTab === "addons" && (
          <AddOnsTab 
            state={state} 
            dispatch={dispatch} 
            setIsEditing={setIsEditing}
            setSaveCallback={setSaveCallback}
            setCancelCallback={setCancelCallback}
          />
        )}
      </div>
    </div>
  )
}
