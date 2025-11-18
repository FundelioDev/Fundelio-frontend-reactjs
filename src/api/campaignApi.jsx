import { httpService } from './http';

export const campaignApi = {
    getAllCampaigns(params = {}) {
        const { filter, page = 1, size = 10, sort } = params;

        // Build params object
        const requestParams = {
            page,
            size,
        };

        // Add filter if provided (will be URL encoded by httpService)
        if (filter) {
            requestParams.filter = filter;
        }

        // Add sort if provided
        if (sort) {
            requestParams.sort = sort;
        }

        return httpService.get('/campaigns', {
            requireToken: false,
            params: requestParams,
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
    },

    getAllCampaignStatus() {
        return httpService.get('/campaigns/statuses', {
            requireToken: false,
        });
    },

    submitMyCampaign(campaignId) {
        return httpService.post(`/campaigns/${campaignId}/submit-review`, null, {
            requireToken: true,
        });
    },

    endMyCampaign(campaignId) {
        return httpService.post(`/campaigns/${campaignId}/end`, null, {
            requireToken: true,
        });
    }
}