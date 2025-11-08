import { useReducer } from 'react';

const initialState = {
  rewards: [],
  addOns: [],
  items: [],
};

function rewardsReducer(state, action) {
  switch (action.type) {
    // REWARD ACTIONS
    case 'ADD_REWARD':
      return {
        ...state,
        rewards: [...state.rewards, action.payload],
      };
    case 'UPDATE_REWARD':
      return {
        ...state,
        rewards: state.rewards.map((r) => (r.id === action.payload.id ? action.payload : r)),
      };
    case 'DELETE_REWARD':
      return {
        ...state,
        rewards: state.rewards.filter((r) => r.id !== action.payload),
      };
    case 'DUPLICATE_REWARD': {
      const reward = state.rewards.find((r) => r.id === action.payload);
      if (!reward) return state;
      const newReward = {
        ...reward,
        id: `r${Date.now()}`,
        title: `${reward.title} (bản sao)`,
      };
      return {
        ...state,
        rewards: [...state.rewards, newReward],
      };
    }

    // ADDON ACTIONS
    case 'ADD_ADDON':
      return {
        ...state,
        addOns: [...state.addOns, action.payload],
      };
    case 'UPDATE_ADDON':
      return {
        ...state,
        addOns: state.addOns.map((a) => (a.id === action.payload.id ? action.payload : a)),
      };
    case 'DELETE_ADDON':
      return {
        ...state,
        addOns: state.addOns.filter((a) => a.id !== action.payload),
      };

    // ITEM ACTIONS
    case 'ADD_ITEM':
      return {
        ...state,
        items: [...state.items, action.payload],
      };
    case 'UPDATE_ITEM':
      return {
        ...state,
        items: state.items.map((i) => (i.id === action.payload.id ? action.payload : i)),
      };
    case 'DELETE_ITEM':
      return {
        ...state,
        items: state.items.filter((i) => i.id !== action.payload),
      };

    default:
      return state;
  }
}

export function useRewardsState() {
  const [state, dispatch] = useReducer(rewardsReducer, initialState);
  return { state, dispatch };
}
