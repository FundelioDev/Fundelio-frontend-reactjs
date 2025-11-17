import { httpService } from '@/api/http';

export const rewardApi = {

    getRewards: async (campaignId, params) => {
        return httpService.get(`/campaigns/${campaignId}/rewards`, {
            params,
            requireToken: true,
        });
    },

    getRewardsWithItems: async (campaignId, params) => {
        return httpService.get(`/campaigns/${campaignId}/rewards?itemType=included,add-on`, {
            params,
            requireToken: true,
        });
    },

    getRewardById: async (campaignId, rewardId) => {
        return httpService.get(`/campaigns/${campaignId}/rewards/${rewardId}?itemType=included,add-on`, {
            requireToken: true,
        });
    },

    createReward: async (campaignId, data) => {
        return httpService.post(`/campaigns/${campaignId}/rewards`, data, {
            requireToken: true,
        });
    },

    updateReward: async (campaignId, rewardId, data) => {
        return httpService.patch(`/campaigns/${campaignId}/rewards/${rewardId}`, data, {
            requireToken: true,
        });
    },

    deleteReward: async (campaignId, rewardId) => {
        return httpService.delete(`/campaigns/${campaignId}/rewards/${rewardId}`, {
            requireToken: true,
        });
    },

    upsertCatalogItemsToReward: async (campaignId, rewardId, data) => {
        return httpService.post(`/campaigns/${campaignId}/rewards/${rewardId}/items`, data, {
            requireToken: true,
        });
    },

    deleteCatalogItemsToReward: async (campaignId, rewardId, rewardItemIds) => {
        return httpService.delete(`/campaigns/${campaignId}/rewards/${rewardId}/items`, {
            data: { rewardItemIds: rewardItemIds },
            requireToken: true,
        });
    },

    getRewardContainingACatalogItem: async (campaignId, catalogItemIds) => {
        return httpService.post(`/campaigns/${campaignId}/rewards/search-by-catalog-items`, {
            catalogItemIds
        }, {
            requireToken: true,
        });
    }

}