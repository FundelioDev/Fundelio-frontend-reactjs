import { httpService } from "@/api/http";

export const pledgeApi = {
    getPledgeByCampaign: async (campaignId) => {
        return httpService.get(`/campaigns/${campaignId}/pledges`, {
            requireToken: true,
        });
    },

    getTopBackersOfCampaign: async (campaignId) => {
        return httpService.get(`/campaigns/${campaignId}/backers`, {
            requireToken: true,
        });
    },

    getMyPledges: async (params = {}) => {
        return httpService.get('/users/me/pledges', {
            requireToken: true,
            params, // Pass params for pagination & filtering
        });
    }

}