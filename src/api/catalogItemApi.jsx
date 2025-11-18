import { httpService } from './http';

export const catalogItemApi = {

    getCatalogItems(campaignId) {
        return httpService.get(`/campaigns/${campaignId}/catalog-items`, {
            requireToken: true,
        });
    },

    getCatalogItemDetails(campaignId, itemId) {
        return httpService.get(`/campaigns/${campaignId}/catalog-items/${itemId}`, {
            requireToken: true,
        });
    },
    
    createCatalogItem(campaignId, catalogItemData) {
        return httpService.post(`/campaigns/${campaignId}/catalog-items`, catalogItemData, {
            requireToken: true,
        });
    },

    updateCatalogItem(campaignId, itemId, catalogItemData) {
        return httpService.patch(`/campaigns/${campaignId}/catalog-items/${itemId}`, catalogItemData, {
            requireToken: true,
        });
    },

    deleteCatalogItem(campaignId, itemId) {
        return httpService.delete(`/campaigns/${campaignId}/catalog-items/${itemId}`, {
            requireToken: true,
        });
    }
}