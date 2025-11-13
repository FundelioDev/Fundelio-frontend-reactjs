import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, resetRetry } from '../store/categoriesSlice';
import { formatCategories } from '../utils/categoryUtils';

const CACHE_DURATION = 30 * 60 * 1000; // 30 phút (categories ít thay đổi)
const MAX_RETRY_COUNT = 3; // Số lần retry tối đa
const RETRY_DELAY_BASE = 5000; // Delay cơ bản: 5 giây

/**
 * Tính toán thời gian delay với exponential backoff
 * @param {number} retryCount - Số lần đã retry
 * @returns {number} - Thời gian delay tính bằng ms
 */
const getRetryDelay = (retryCount) => {
  // Exponential backoff: 5s, 10s, 20s
  return RETRY_DELAY_BASE * Math.pow(2, retryCount);
};

/**
 * Custom hook để lấy categories với caching và retry logic
 * @param {boolean} forceRefetch - Bắt buộc fetch lại dù đã có cache
 * @returns {object} - { categories, loading, error, refetch }
 */
export const useCategories = (forceRefetch = false) => {
  const dispatch = useDispatch();
  const { items, loading, error, lastFetched, lastError, retryCount } = useSelector((state) => state.categories);

  useEffect(() => {
    // Nếu đang loading thì không fetch nữa
    if (loading) return;

    // Nếu đã vượt quá số lần retry tối đa
    if (retryCount >= MAX_RETRY_COUNT && error) {
      console.error(`❌ Failed to fetch categories after ${MAX_RETRY_COUNT} attempts. Please try again later.`);
      return;
    }

    // Nếu có lỗi và chưa đến thời gian retry
    if (lastError && retryCount > 0) {
      const retryDelay = getRetryDelay(retryCount - 1);
      const timeSinceError = Date.now() - lastError;
      
      if (timeSinceError < retryDelay) {
        const timeToWait = Math.ceil((retryDelay - timeSinceError) / 1000);
        console.log(`⏳ Waiting ${timeToWait}s before retry attempt ${retryCount + 1}/${MAX_RETRY_COUNT}...`);
        return;
      }
    }

    const shouldFetch = 
      forceRefetch || 
      !items.length || 
      !lastFetched || 
      (Date.now() - lastFetched > CACHE_DURATION);

    if (shouldFetch) {
      console.log('📡 Fetching categories from API...');
      dispatch(fetchCategories());
    } else if (items.length > 0) {
      const timeLeft = Math.ceil((CACHE_DURATION - (Date.now() - lastFetched)) / 1000 / 60);
      console.log(`✅ Using cached categories. Cache expires in ${timeLeft} minutes.`);
    }
  }, [dispatch, forceRefetch, items.length, lastFetched, loading, error, lastError, retryCount]);

  const refetch = () => {
    console.log('🔄 Force refetching categories...');
    dispatch(resetRetry()); // Reset retry count when manually refetching
    dispatch(fetchCategories());
  };

  return {
    categories: formatCategories(items),
    loading,
    error,
    refetch,
    retryCount,
    canRetry: retryCount < MAX_RETRY_COUNT,
  };
};
