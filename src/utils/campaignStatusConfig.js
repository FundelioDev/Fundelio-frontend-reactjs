/**
 * Campaign Status Configuration
 * Defines allowed actions, badge colors, and behavior for each campaign status
 */

export const CAMPAIGN_STATUS_CONFIG = {
  DRAFT: {
    label: 'Bản nháp',
    badgeColor: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    actions: {
      canEdit: true,
      canViewStats: false,
      canDelete: true,
      canEnd: false,
      canSubmit: true,
      editButtonType: 'edit', // 'edit' or 'view' (Eye icon)
      isReadOnly: false,
    },
  },
  PENDING: {
    label: 'Chờ duyệt',
    badgeColor: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    actions: {
      canEdit: false,
      canViewStats: false,
      canDelete: false,
      canEnd: true,
      canSubmit: false,
      editButtonType: 'view', // Eye icon, read-only
      isReadOnly: true,
    },
  },
  PAUSED: {
    label: 'Tạm dừng',
    badgeColor: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    actions: {
      canEdit: true,
      canViewStats: true,
      canDelete: false,
      canEnd: false,
      canSubmit: true,
      editButtonType: 'edit',
      isReadOnly: false,
    },
    rewardRules: {
      markExistingAsOld: true,
      preventDeletingOldRewards: true,
      preventOldRewardItemUpserts: true,
    },
    itemRules: {
      markExistingAsOld: true,
      preventDeletingOldItems: true,
      lockOldItemPrice: true,
    },
  },
  APPROVED: {
    label: 'Đã duyệt',
    badgeColor: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    actions: {
      canEdit: false,
      canViewStats: false,
      canDelete: false,
      canEnd: false,
      canSubmit: false,
      editButtonType: 'view', // Eye icon, read-only
      isReadOnly: true,
    },
  },
  REJECTED: {
    label: 'Đã từ chối',
    badgeColor: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    actions: {
      canEdit: true,
      canViewStats: false,
      canDelete: false,
      canEnd: false,
      canSubmit: false,
      editButtonType: 'edit',
      isReadOnly: false,
    },
  },
  ACTIVE: {
    label: 'Đang hoạt động',
    badgeColor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    actions: {
      canEdit: true,
      canViewStats: true,
      canDelete: false,
      canEnd: true,
      canSubmit: false, // Disabled submit button
      editButtonType: 'edit',
      isReadOnly: false,
    },
    rewardRules: {
      markExistingAsOld: true,
      preventDeletingOldRewards: true,
      preventOldRewardItemUpserts: true,
    },
    itemRules: {
      markExistingAsOld: true,
      preventDeletingOldItems: true,
      lockOldItemPrice: true,
    },
  },
  SUCCESSFUL: {
    label: 'Thành công',
    badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    actions: {
      canEdit: true,
      canViewStats: true,
      canDelete: false,
      canEnd: true,
      canSubmit: false, // Disabled submit button
      editButtonType: 'edit',
      isReadOnly: false,
    },
    rewardRules: {
      markExistingAsOld: true,
      preventDeletingOldRewards: true,
      preventOldRewardItemUpserts: true,
    },
    itemRules: {
      markExistingAsOld: true,
      preventDeletingOldItems: true,
      lockOldItemPrice: true,
    },
  },
  FAILED: {
    label: 'Thất bại',
    badgeColor: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    actions: {
      canEdit: false,
      canViewStats: true,
      canDelete: false,
      canEnd: false,
      canSubmit: false,
      editButtonType: 'view', // Eye icon, read-only
      isReadOnly: true,
    },
  },
  ENDED: {
    label: 'Đã kết thúc',
    badgeColor: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    actions: {
      canEdit: false,
      canViewStats: true,
      canDelete: false,
      canEnd: false,
      canSubmit: false,
      editButtonType: 'view', // Eye icon, read-only
      isReadOnly: true,
    },
  },
};

const DEFAULT_REWARD_RULES = Object.freeze({
  markExistingAsOld: false,
  preventDeletingOldRewards: false,
  preventOldRewardItemUpserts: false,
});

const DEFAULT_ITEM_RULES = Object.freeze({
  markExistingAsOld: false,
  preventDeletingOldItems: false,
  lockOldItemPrice: false,
});

/**
 * Get status configuration
 * @param {string} status - Campaign status
 * @returns {object} Status configuration
 */
export const getStatusConfig = (status) => {
  return CAMPAIGN_STATUS_CONFIG[status] || CAMPAIGN_STATUS_CONFIG.DRAFT;
};

/**
 * Get status label
 * @param {string} status - Campaign status
 * @returns {string} Status label
 */
export const getStatusLabel = (status) => {
  return getStatusConfig(status).label;
};

/**
 * Get status badge color classes
 * @param {string} status - Campaign status
 * @returns {string} Badge color classes
 */
export const getStatusBadgeColor = (status) => {
  return getStatusConfig(status).badgeColor;
};

/**
 * Check if action is allowed for status
 * @param {string} status - Campaign status
 * @param {string} action - Action to check ('canEdit', 'canViewStats', etc.)
 * @returns {boolean} Whether action is allowed
 */
export const canPerformAction = (status, action) => {
  const config = getStatusConfig(status);
  return config.actions[action] || false;
};

/**
 * Check if campaign is in read-only mode
 * @param {string} status - Campaign status
 * @returns {boolean} Whether campaign is read-only
 */
export const isReadOnly = (status) => {
  return getStatusConfig(status).actions.isReadOnly;
};

/**
 * Get edit button type ('edit' or 'view')
 * @param {string} status - Campaign status
 * @returns {string} Button type
 */
export const getEditButtonType = (status) => {
  return getStatusConfig(status).actions.editButtonType;
};

/**
 * Get reward-level restrictions for a status
 * @param {string} status
 * @returns {{markExistingAsOld: boolean, preventDeletingOldRewards: boolean, preventOldRewardItemUpserts: boolean}}
 */
export const getRewardRules = (status) => {
  const config = getStatusConfig(status);
  return {
    ...DEFAULT_REWARD_RULES,
    ...(config.rewardRules || {}),
  };
};

/**
 * Get item-level restrictions for a status
 * @param {string} status
 * @returns {{markExistingAsOld: boolean, preventDeletingOldItems: boolean, lockOldItemPrice: boolean}}
 */
export const getItemRules = (status) => {
  const config = getStatusConfig(status);
  return {
    ...DEFAULT_ITEM_RULES,
    ...(config.itemRules || {}),
  };
};

