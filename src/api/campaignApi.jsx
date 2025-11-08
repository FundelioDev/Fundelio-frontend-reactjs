import { httpService } from './http';

export const campaignApi = {
    getAllCampaigns(params) {
        return httpService.get('/campaigns', {
            requireToken: true,
            params,
        });
    },

    getCampaignById(campaignId) {
        return httpService.get(`/campaigns/${campaignId}`, {
            requireToken: true,
        });
    },

    createCampaign(campaignData) {
        console.log('Creating campaign with data:', campaignData);
        return httpService.post('/campaigns', campaignData, {
            requireToken: true,
        });
    },

    getUserCampaigns(userId, params = {}) {
        const { page = 1, size = 10, sort = 'createdAt,desc' } = params;
        return httpService.get('/campaigns', {
            requireToken: true,
            params: {
                filter: `owner.userId:'${userId}'`,
                page,
                size,
                sort,
            },
        });
    },
}