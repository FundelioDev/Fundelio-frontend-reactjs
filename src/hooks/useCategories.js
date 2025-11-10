import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../store/categoriesSlice';
import { formatCategories } from '../utils/categoryUtils';

const CACHE_DURATION = 30 * 60 * 1000; // 30 phút (categories ít thay đổi)

/**
 * Custom hook để lấy categories với caching
 * @param {boolean} forceRefetch - Bắt buộc fetch lại dù đã có cache
 * @returns {object} - { categories, loading, error, refetch }
 */
export const useCategories = (forceRefetch = false) => {
  const dispatch = useDispatch();
  const { items, loading, error, lastFetched } = useSelector((state) => state.categories);

  useEffect(() => {
    const shouldFetch = 
      forceRefetch || 
      !items.length || 
      !lastFetched || 
      (Date.now() - lastFetched > CACHE_DURATION);

    if (shouldFetch && !loading) {
      console.log('📡 Fetching categories from API...');
      dispatch(fetchCategories());
    } else if (items.length > 0) {
      const timeLeft = Math.ceil((CACHE_DURATION - (Date.now() - lastFetched)) / 1000 / 60);
      console.log(`✅ Using cached categories. Cache expires in ${timeLeft} minutes.`);
    }
  }, [dispatch, forceRefetch, items.length, lastFetched, loading]);

  const refetch = () => {
    console.log('🔄 Force refetching categories...');
    dispatch(fetchCategories());
  };

  return {
    categories: formatCategories(items),
    loading,
    error,
    refetch,
  };
};
