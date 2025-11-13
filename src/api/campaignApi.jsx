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
        return httpService.post('/campaigns', campaignData, {
            requireToken: true,
        });
    },

    updateCampaign(campaignId, campaignData) {
        console.log('Updating campaign:', campaignId, 'with data:', campaignData);
        return httpService.patch(`/campaigns/${campaignId}`, campaignData, {
            requireToken: true,
        });
    },

    updateCampaignStatus(campaignId, statusData) {
        return httpService.put(`/campaigns/${campaignId}/status`, statusData, {
            requireToken: true,
        });
    },

    deleteCampaign(campaignId) {
        return httpService.delete(`/campaigns/${campaignId}`, {
            requireToken: true,
        });
    },

    // Campaign Sections (Story)
    createCampaignSection(campaignId, sectionData) {
        console.log('Creating campaign section for:', campaignId, 'with data:', sectionData);
        return httpService.post(`/campaigns/${campaignId}/sections`, sectionData, {
            requireToken: true,
        });
    },

    updateCampaignSection(campaignId, sectionId, sectionData) {
        console.log('Updating section:', sectionId, 'for campaign:', campaignId, 'with data:', sectionData);
        return httpService.patch(`/campaigns/${campaignId}/sections/${sectionId}`, sectionData, {
            requireToken: true,
        });
    },

    deleteCampaignSection(campaignId, sectionId) {
        console.log('Deleting section:', sectionId, 'from campaign:', campaignId);
        return httpService.delete(`/campaigns/${campaignId}/sections/${sectionId}`, {
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

    getAllCategories() {
        return httpService.get('/campaigns/categories', {
            requireToken: false,
        });
    }
}