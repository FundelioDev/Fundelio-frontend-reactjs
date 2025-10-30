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
    sessionStorage.setItem(previewId, JSON.stringify(dataToSave));
    return true;
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
