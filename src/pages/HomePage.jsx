import Hero from '@/components/common/Hero';
import HowItWorks from '@/components/home/HowItWorks';
import Rankings from '@/components/home/Rankings';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import CrowdfundingTips from '@/components/home/CrowdfundingTips';
import PrimaryCTA from '@/components/home/PrimaryCTA';
import React, { useState, useEffect, useMemo } from 'react';
import TrendingNewestCampaigns from '@/components/home/RecentSavedCampaigns';
import PopularCampaigns from '@/components/home/PopularCampaigns';
import FeaturedSpotlight from '@/components/home/FeaturedSpotlight';
import AlmostThereSection from '@/components/home/AlmostThereSection';
import EndingSoonSection from '@/components/home/EndingSoonSection';
import SuccessStoriesSection from '@/components/home/SuccessStoriesSection';
import QuickWinsMostBackedSection from '@/components/home/QuickWinsMostBackedSection';
import { campaignApi } from '@/api/campaignApi';

export default function HomePage() {
  const [allCampaigns, setAllCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all campaigns once
  useEffect(() => {
    const fetchAllCampaigns = async () => {
      try {
        setLoading(true);
        // Fetch both ACTIVE and SUCCESSFUL campaigns with large page size
        const response = await campaignApi.getAllCampaigns({
          filter: "campaignStatus in ['ACTIVE','SUCCESSFUL']",
          page: 0,
          size: 500, // Get enough campaigns for all sections
          sort: 'createdAt,desc',
        });

        const campaigns = response?.data?.data?.content || [];
        setAllCampaigns(campaigns);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllCampaigns();
  }, []);

  // Pre-filter campaigns for each section to avoid repeated filtering
  const filteredData = useMemo(() => {
    const now = new Date();

    return {
      // Featured & Spotlight
      featured: allCampaigns
        .filter(c => c.campaignStatus === 'ACTIVE')
        .sort((a, b) => (b.pledgedAmount || 0) - (a.pledgedAmount || 0))
        .slice(0, 6),

      spotlight: allCampaigns
        .filter(c => c.campaignStatus === 'ACTIVE')
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 6),

      // Trending & Newest
      trending: allCampaigns
        .filter(c => c.campaignStatus === 'ACTIVE')
        .sort((a, b) => (b.backersCount || 0) - (a.backersCount || 0))
        .slice(0, 12),

      newest: allCampaigns
        .filter(c => c.campaignStatus === 'ACTIVE')
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 12),

      // Almost There (80-99% funded)
      almostThere: allCampaigns
        .filter(c => {
          if (c.campaignStatus !== 'ACTIVE') return false;
          const progress = (c.pledgedAmount / c.goalAmount) * 100;
          return progress >= 80 && progress < 100;
        })
        .sort((a, b) => {
          const progressA = (a.pledgedAmount / a.goalAmount) * 100;
          const progressB = (b.pledgedAmount / b.goalAmount) * 100;
          return progressB - progressA;
        })
        .slice(0, 12),

      // Popular (Most Backed)
      popular: allCampaigns
        .filter(c => ['ACTIVE', 'SUCCESSFUL'].includes(c.campaignStatus))
        .sort((a, b) => (b.backersCount || 0) - (a.backersCount || 0))
        .slice(0, 12),

      // Success Stories
      successStories: allCampaigns
        .filter(c => c.campaignStatus === 'SUCCESSFUL')
        .sort((a, b) => (b.pledgedAmount || 0) - (a.pledgedAmount || 0))
        .slice(0, 12),

      // Quick Wins (goals <= 10M)
      quickWins: allCampaigns
        .filter(c => c.campaignStatus === 'ACTIVE' && (c.goalAmount || 0) <= 10000000)
        .sort((a, b) => {
          const progressA = (a.pledgedAmount / a.goalAmount) * 100;
          const progressB = (b.pledgedAmount / b.goalAmount) * 100;
          return progressB - progressA;
        })
        .slice(0, 12),

      // Most Backed
      mostBacked: allCampaigns
        .filter(c => ['ACTIVE', 'SUCCESSFUL'].includes(c.campaignStatus))
        .sort((a, b) => (b.backersCount || 0) - (a.backersCount || 0))
        .slice(0, 12),

      // Ending Soon (<= 7 days)
      endingSoon: allCampaigns
        .filter(c => {
          if (c.campaignStatus !== 'ACTIVE' || !c.endDate) return false;
          const daysLeft = Math.ceil((new Date(c.endDate) - now) / (1000 * 60 * 60 * 24));
          return daysLeft > 0 && daysLeft <= 7;
        })
        .sort((a, b) => new Date(a.endDate) - new Date(b.endDate))
        .slice(0, 12),
    };
  }, [allCampaigns]);

  return (
    <div className=" bg-background-light-2 dark:bg-darker overflow-x-hidden">
      {/* Hero Section */}
      <Hero />

      {/* Featured & Spotlight Section - Layout giống ảnh tham khảo */}
      <FeaturedSpotlight
        campaigns={{ featured: filteredData.featured, spotlight: filteredData.spotlight }}
        loading={loading}
      />

      {/* Trending & Newest Campaigns - Tabs */}
      <TrendingNewestCampaigns
        campaigns={{ trending: filteredData.trending, newest: filteredData.newest }}
        loading={loading}
      />

      {/* Almost There - Gần đạt mục tiêu (80-99%) */}
      <AlmostThereSection
        campaigns={filteredData.almostThere}
        loading={loading}
      />

      {/* How It Works */}
      <HowItWorks />

      {/* Popular Campaigns - Most Backed */}
      {/* <PopularCampaigns 
        campaigns={filteredData.popular}
        loading={loading}
      /> */}

      {/* Rankings - Top 10 by Funding & Audience */}
      <Rankings />

      {/* Success Stories - SUCCESSFUL campaigns */}
      <SuccessStoriesSection
        campaigns={filteredData.successStories}
        loading={loading}
      />

      {/* Quick Wins & Most Backed - Tabs */}
      <QuickWinsMostBackedSection
        campaigns={{ quickWins: filteredData.quickWins, mostBacked: filteredData.mostBacked }}
        loading={loading}
      />

      {/* Ending Soon - < 7 days */}
      <EndingSoonSection
        campaigns={filteredData.endingSoon}
        loading={loading}
      />

      {/* Why Choose Us */}
      <WhyChooseUs />

      {/* Crowdfunding Tips */}
      <CrowdfundingTips />

      {/* Primary CTA */}
      <PrimaryCTA />
    </div>
  );
}

// Export named for backward compatibility
export { HomePage };
