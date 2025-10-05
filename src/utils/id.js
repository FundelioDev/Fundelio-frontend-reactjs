/**
 * Generate a unique ID for blank sections
 * @returns {string} Unique ID in format 'blank-xxxxx'
 */
export const uid = () => 'blank-' + Math.random().toString(36).slice(2, 9);
