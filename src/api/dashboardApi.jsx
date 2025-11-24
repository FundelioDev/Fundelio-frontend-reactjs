import { httpService } from './http';

export const dashboardApi = {
    getAdminDashboardData: async () => {
        return httpService.get('/admin/dashboard', {
            requireToken: true,
        });
    },
    getFounderDashboardData: async () => {
        return httpService.get('/founder/dashboard', {
            requireToken: true,
        });
    },
    getCampaignDashboardData: async (campaignId) => {
        return httpService.get(`/campaigns/${campaignId}/statistics`, {
            requireToken: true,
        });
    },
};