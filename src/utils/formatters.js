/**
 * Format number as Vietnamese currency
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

/**
 * Format date to Vietnamese locale
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
};

/**
 * Format number with thousand separators
 * @param {number} num - Number to format
 * @returns {string} Formatted number string
 */
export const formatNumber = (num) => {
  return new Intl.NumberFormat('vi-VN').format(num);
};

/**
 * Calculate days left until end date
 * @param {Date|string} endDate - End date
 * @returns {number} Number of days left (negative if past due)
 */
export const calculateDaysLeft = (endDate) => {
  if (!endDate) return 0;

  const now = new Date();
  const end = new Date(endDate);
  const diffTime = end.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
};

/**
 * Calculate funding progress percentage
 * @param {number} currentAmount - Current funded amount
 * @param {number} fundingGoal - Target funding goal
 * @returns {number} Progress percentage (0-100+)
 */
export const calculateProgress = (currentAmount, fundingGoal) => {
  if (!fundingGoal || fundingGoal === 0) return 0;

  const progress = (currentAmount / fundingGoal) * 100;
  return Math.round(progress * 100) / 100; // Round to 2 decimal places
};
