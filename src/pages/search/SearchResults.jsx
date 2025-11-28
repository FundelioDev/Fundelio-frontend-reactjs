import React, { useMemo } from 'react';
import ProjectCard from '@/components/home/ProjectCard';

/**
 * SearchResults - Grid of campaign cards using the shared ProjectCard UI
 */
const SearchResults = ({ campaigns = [] }) => {
    const preparedCampaigns = useMemo(() => {
        return campaigns.map((campaign) => {
            const campaignId = campaign.campaignId || campaign.id;
            return {
                ...campaign,
                campaignId,
                pledgedAmount: campaign.pledgedAmount ?? 0,
                goalAmount: campaign.goalAmount ?? campaign.goal ?? 0,
                introImageUrl: campaign.introImageUrl ?? campaign.imageUrl,
                campaignCategory: campaign.campaignCategory,
            };
        });
    }, [campaigns]);

    if (preparedCampaigns.length === 0) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {preparedCampaigns.map((campaign) => (
                <ProjectCard
                    key={campaign.campaignId}
                    project={campaign}
                    asLink={`/campaigns/${campaign.campaignId}`}
                />
            ))}
        </div>
    );
};

export default SearchResults;
