import { useState, useEffect } from 'react';
import { campaignApi } from '@/api/campaignApi';

/**
 * Custom hook to fetch campaigns with filters
 * @param {Object} params - Query parameters
 * @param {string} params.filter - Filter string (e.g., "campaignStatus:'ACTIVE'")
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.size - Page size (default: 10)
 * @param {string} params.sort - Sort string (e.g., "createdAt,desc")
 * @param {boolean} params.enabled - Whether to fetch data (default: true)
 */
export const useCampaigns = (params = {}) => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    size: 10,
    totalPages: 0,
    totalElements: 0,
  });

  const {
    filter,
    page = 1,
    size = 10,
    sort,
    enabled = true,
  } = params;

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await campaignApi.getAllCampaigns({
          filter,
          page,
          size,
          sort,
        });

        console.log('📊 Campaigns response:', response);

        // Handle response structure
        const data = response?.data?.data;
        
        if (data.content) {
          // Paginated response
          setCampaigns(data.content);
          setPagination({
            page: data.number + 1, // Backend uses 0-indexed pages
            size: data.size,
            totalPages: data.totalPages,
            totalElements: data.totalElements,
          });
        } else if (Array.isArray(data)) {
          // Direct array response
          setCampaigns(data);
        } else {
          console.warn('Unexpected response structure:', data);
          setCampaigns([]);
        }
      } catch (err) {
        console.error('❌ Error fetching campaigns:', err);
        setError(err);
        setCampaigns([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
    console.log('DDDDD', campaigns);
  }, [filter, page, size, sort, enabled]);

  return {
    campaigns,
    loading,
    error,
    pagination,
  };
};


