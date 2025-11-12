import { httpService } from './http';

export const campaignSectionApi = {

    getCampaignSections(campaignId) {
        return httpService.get(`/campaigns/${campaignId}/sections`, {
            requireToken: true,
        });
    },

    addSectionToCampaign(campaignId, campaignSectionData) {
        console.log('Creating campaign section with data:', campaignSectionData);
        return httpService.post(`/campaigns/${campaignId}/sections`, campaignSectionData, {
            requireToken: true,
        });
    },

    updateSectionToCampaign(campaignId, sectionId, campaignSectionData) {
        return httpService.patch(`/campaigns/${campaignId}/sections/${sectionId}`, campaignSectionData, {
            requireToken: true,
        });
    },

    reorderSections(campaignId, reorderData) {
        return httpService.put(`/campaigns/${campaignId}/sections/reorder`, reorderData, {
            requireToken: true,
        });
    },

    deleteSectionFromCampaign(campaignId, sectionId) {
        return httpService.delete(`/campaigns/${campaignId}/sections/${sectionId}`, {
            requireToken: true,
        });
    }
}