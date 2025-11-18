import { createSlice } from '@reduxjs/toolkit';

// Helper to get date strings
const getDateString = (daysOffset = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split('T')[0];
};

const initialState = {
  // BASICS STATE - Empty by default
  basics: {
    title: '',
    description: '',
    goalAmount: '',
    campaignCategory: '',
    introImageUrl: '',
    introVideoUrl: '',
    startDate: getDateString(0), // Today
    endDate: getDateString(60), // 60 days from now
    acceptedTerms: false, // Not sent to API, only for UI validation
  },

  // STORY STATE - WITH SAMPLE BLANKS
  story: {
    blanksById: {
      'sample-001': {
        id: 'sample-001',
        order: 0,
        titleHtml: '<b>Giới thiệu dự án</b>',
        titleText: 'Giới thiệu dự án',
        contentHtml: '<p>Đây là một dự án crowdfunding tuyệt vời mà chúng tôi đang phát triển. Chúng tôi tin rằng nó sẽ mang lại giá trị cho cộng đồng.</p>',
      },
      'sample-002': {
        id: 'sample-002',
        order: 1,
        titleHtml: '<span style="color: #0894e2;">Mục tiêu chiến dịch</span>',
        titleText: 'Mục tiêu chiến dịch',
        contentHtml: '<p>Mục tiêu của chúng tôi là gây quỹ để hoàn thiện sản phẩm và đưa nó đến tay người dùng trong năm nay.</p>',
      },
    },
    order: ['sample-001', 'sample-002'],
  },

  // REWARDS STATE - WITH SAMPLE DATA
  rewards: {
    items: [],
    rewards: [
      {
        id: 'reward-sample-001',
        title: 'Early Bird Special - Phiên bản giới hạn',
        description: 'Ưu đãi đặc biệt cho những người ủng hộ sớm! Bao gồm sản phẩm chính thức cùng các phần thưởng độc quyền chỉ dành cho Early Bird. Số lượng có hạn!',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop',
        price: 49,
        items: [],
        delivery: { 
          month: new Date().getMonth() + 4, // 3 months from now
          year: new Date().getFullYear() 
        },
        shipping: 'anywhere',
        limitTotal: 100,
        limitPerBacker: 2,
        allowAddOns: true,
      },
      {
        id: 'reward-sample-002',
        title: 'Standard Backer Reward',
        description: 'Phần thưởng tiêu chuẩn cho các backer ủng hộ dự án. Bao gồm sản phẩm chính và các bonus items.',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=400&fit=crop',
        price: 79,
        items: [],
        delivery: { 
          month: new Date().getMonth() + 4,
          year: new Date().getFullYear() 
        },
        shipping: 'anywhere',
        limitTotal: null,
        limitPerBacker: null,
        allowAddOns: true,
      },
    ],
    addOns: [
      {
        id: 'addon-sample-001',
        title: 'Gói phụ kiện cao cấp',
        description: 'Nâng cao trải nghiệm của bạn với bộ sưu tập phụ kiện được tuyển chọn kỹ lưỡng. Bao gồm case bảo vệ và các items độc quyền.',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=400&fit=crop',
        price: 15,
        items: [],
        delivery: { 
          month: new Date().getMonth() + 4,
          year: new Date().getFullYear() 
        },
        limitTotal: null,
        offeredWithRewardIds: ['reward-sample-001', 'reward-sample-002'],
      },
    ],
  },
};

const campaignSlice = createSlice({
  name: 'campaign',
  initialState,
  reducers: {
    // ============ BASICS ACTIONS ============
    setBasics: (state, action) => {
      state.basics = action.payload;
    },
    updateBasicsField: (state, action) => {
      const { field, value } = action.payload;
      state.basics[field] = value;
    },
    resetBasics: (state) => {
      state.basics = initialState.basics;
    },

    // ============ STORY ACTIONS ============
    initializeStory: (state, action) => {
      const { blanksById, order } = action.payload;
      state.story.blanksById = blanksById || {};
      state.story.order = order || [];
    },
    addBlank: (state, action) => {
      const { id, blank } = action.payload;
      state.story.blanksById[id] = blank;
      state.story.order.push(id);
    },
    updateBlankTitle: (state, action) => {
      const { id, titleHtml, titleText } = action.payload;
      if (state.story.blanksById[id]) {
        state.story.blanksById[id].titleHtml = titleHtml;
        state.story.blanksById[id].titleText = titleText;
      }
    },
    updateBlankContent: (state, action) => {
      const { id, contentHtml } = action.payload;
      if (state.story.blanksById[id]) {
        state.story.blanksById[id].contentHtml = contentHtml;
      }
    },
    reorderBlanks: (state, action) => {
      state.story.order = action.payload;
    },
    deleteBlank: (state, action) => {
      const id = action.payload;
      delete state.story.blanksById[id];
      state.story.order = state.story.order.filter((blankId) => blankId !== id);
    },
    resetStory: (state) => {
      state.story = initialState.story;
    },

    // ============ REWARDS ACTIONS ============
    // Items
    setItems: (state, action) => {
      state.rewards.items = action.payload;
    },
    addItem: (state, action) => {
      state.rewards.items.push(action.payload);
    },
    updateItem: (state, action) => {
      const index = state.rewards.items.findIndex((item) => 
        item.catalogItemId === action.payload.catalogItemId
      );
      if (index !== -1) {
        state.rewards.items[index] = action.payload;
      }
    },
    deleteItem: (state, action) => {
      state.rewards.items = state.rewards.items.filter((item) => 
        item.catalogItemId !== action.payload
      );
    },

    // Rewards
    addReward: (state, action) => {
      state.rewards.rewards.push(action.payload);
    },
    updateReward: (state, action) => {
      const index = state.rewards.rewards.findIndex((reward) => reward.id === action.payload.id);
      if (index !== -1) {
        state.rewards.rewards[index] = action.payload;
      }
    },
    deleteReward: (state, action) => {
      state.rewards.rewards = state.rewards.rewards.filter((reward) => reward.id !== action.payload);
    },
    duplicateReward: (state, action) => {
      const reward = state.rewards.rewards.find((r) => r.id === action.payload);
      if (reward) {
        const newReward = {
          ...reward,
          id: `r${Date.now()}`,
          title: `${reward.title} (Bản sao)`,
        };
        state.rewards.rewards.push(newReward);
      }
    },

    // AddOns
    addAddOn: (state, action) => {
      state.rewards.addOns.push(action.payload);
    },
    updateAddOn: (state, action) => {
      const index = state.rewards.addOns.findIndex((addon) => addon.id === action.payload.id);
      if (index !== -1) {
        state.rewards.addOns[index] = action.payload;
      }
    },
    deleteAddOn: (state, action) => {
      state.rewards.addOns = state.rewards.addOns.filter((addon) => addon.id !== action.payload);
    },

    // Set rewards state (for backward compatibility)
    setRewardsState: (state, action) => {
      state.rewards = action.payload;
    },
    resetRewards: (state) => {
      state.rewards = initialState.rewards;
    },

    // ============ GLOBAL ACTIONS ============
    resetCampaign: () => initialState,
    
    // Load sample data (useful for testing)
    loadSampleData: () => initialState,
  },
});

export const {
  // Basics
  setBasics,
  updateBasicsField,
  resetBasics,
  // Story
  initializeStory,
  addBlank,
  updateBlankTitle,
  updateBlankContent,
  reorderBlanks,
  deleteBlank,
  resetStory,
  // Rewards - Items
  setItems,
  addItem,
  updateItem,
  deleteItem,
  // Rewards - Rewards
  addReward,
  updateReward,
  deleteReward,
  duplicateReward,
  // Rewards - AddOns
  addAddOn,
  updateAddOn,
  deleteAddOn,
  // Rewards - General
  setRewardsState,
  resetRewards,
  // Global
  resetCampaign,
  loadSampleData,
} = campaignSlice.actions;

export default campaignSlice.reducer;
