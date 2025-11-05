/**
 * Utility functions for managing campaign preview data in sessionStorage
 * Uses hybrid approach: React Router state + sessionStorage for persistence
 */

const PREVIEW_PREFIX = 'fundelio_preview_';

/**
 * Generate unique preview ID
 * @returns {string} Preview ID with timestamp
 */
export function generatePreviewId() {
  return `${PREVIEW_PREFIX}${Date.now()}`;
}

/**
 * Save campaign data to sessionStorage for preview
 * Handles QuotaExceededError by removing base64 images if needed
 * @param {string} previewId - Unique preview ID
 * @param {Object} campaignData - Campaign data to save
 * @returns {boolean} Success status
 */
export function savePreviewData(previewId, campaignData) {
  try {
    const dataToSave = {
      ...campaignData,
      savedAt: new Date().toISOString(),
    };
    
    // Try to save with full data first
    try {
      sessionStorage.setItem(previewId, JSON.stringify(dataToSave));
      return true;
    } catch (quotaError) {
      if (quotaError.name === 'QuotaExceededError') {
        console.warn('QuotaExceededError: Saving preview without base64 images...');
        
        // Create a lighter version without base64 images
        const lightData = {
          ...dataToSave,
          basics: dataToSave.basics ? {
            ...dataToSave.basics,
            image_url: dataToSave.basics.image_url?.startsWith('data:') 
              ? null 
              : dataToSave.basics.image_url,
            intro_video_url: dataToSave.basics.intro_video_url?.startsWith('data:')
              ? null
              : dataToSave.basics.intro_video_url,
          } : dataToSave.basics,
          rewards: dataToSave.rewards ? {
            ...dataToSave.rewards,
            items: (dataToSave.rewards.items || []).map(item => ({
              ...item,
              image: item.image?.startsWith('data:') ? null : item.image,
            })),
            rewards: (dataToSave.rewards.rewards || []).map(reward => ({
              ...reward,
              image: reward.image?.startsWith('data:') ? null : reward.image,
            })),
            addOns: (dataToSave.rewards.addOns || []).map(addon => ({
              ...addon,
              image: addon.image?.startsWith('data:') ? null : addon.image,
            })),
          } : dataToSave.rewards,
        };
        
        sessionStorage.setItem(previewId, JSON.stringify(lightData));
        console.info('✅ Preview saved without base64 images (images will be passed via router state)');
        return true;
      }
      throw quotaError;
    }
  } catch (error) {
    console.error('Error saving preview data:', error);
    return false;
  }
}

/**
 * Get campaign data from sessionStorage
 * @param {string} previewId - Unique preview ID
 * @returns {Object|null} Campaign data or null if not found
 */
export function getPreviewData(previewId) {
  try {
    const data = sessionStorage.getItem(previewId);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting preview data:', error);
    return null;
  }
}

/**
 * Clear specific preview data from sessionStorage
 * @param {string} previewId - Unique preview ID
 */
export function clearPreviewData(previewId) {
  try {
    sessionStorage.removeItem(previewId);
  } catch (error) {
    console.error('Error clearing preview data:', error);
  }
}

/**
 * Clear all old preview data (older than 24 hours)
 * Call this on app initialization to prevent sessionStorage buildup
 */
export function clearOldPreviewData() {
  try {
    const now = Date.now();
    const keys = Object.keys(sessionStorage);
    
    keys.forEach(key => {
      if (key.startsWith(PREVIEW_PREFIX)) {
        try {
          const data = JSON.parse(sessionStorage.getItem(key));
          const savedAt = new Date(data.savedAt).getTime();
          
          // Clear if older than 24 hours
          if (now - savedAt > 24 * 60 * 60 * 1000) {
            sessionStorage.removeItem(key);
          }
        } catch (e) {
          // Invalid data, remove it
          sessionStorage.removeItem(key);
        }
      }
    });
  } catch (error) {
    console.error('Error clearing old preview data:', error);
  }
}

/**
 * Check if an ID is a preview ID
 * @param {string} id - ID to check
 * @returns {boolean} True if preview ID
 */
export function isPreviewId(id) {
  return typeof id === 'string' && id.startsWith(PREVIEW_PREFIX);
}
