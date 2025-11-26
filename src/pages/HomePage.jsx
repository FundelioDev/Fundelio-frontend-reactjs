import Hero from '@/components/common/Hero';
import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { campaignApi } from '@/api/campaignApi';

// Lazy load below-the-fold components
const HowItWorks = React.lazy(() => import('@/components/home/HowItWorks'));
const Rankings = React.lazy(() => import('@/components/home/Rankings'));
const WhyChooseUs = React.lazy(() => import('@/components/home/WhyChooseUs'));
const CrowdfundingTips = React.lazy(() => import('@/components/home/CrowdfundingTips'));
const PrimaryCTA = React.lazy(() => import('@/components/home/PrimaryCTA'));
const FeaturedSpotlight = React.lazy(() => import('@/components/home/FeaturedSpotlight'));
const AlmostThereSection = React.lazy(() => import('@/components/home/AlmostThereSection'));
const EndingSoonSection = React.lazy(() => import('@/components/home/EndingSoonSection'));
const SuccessStoriesSection = React.lazy(() => import('@/components/home/SuccessStoriesSection'));
const QuickWinsMostBackedSection = React.lazy(() => import('@/components/home/QuickWinsMostBackedSection'));

// Loading fallback
const SectionLoader = () => (
  <div className="py-12 flex justify-center">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

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
        .filter(c => ['ACTIVE', 'SUCCESSFUL'].includes(c.campaignStatus))
        .sort((a, b) => {
          const pledgedDiff = (b.pledgedAmount || 0) - (a.pledgedAmount || 0);
          if (pledgedDiff !== 0) return pledgedDiff;
          return (b.backersCount || 0) - (a.backersCount || 0);
        })
        .slice(0, 12),

      spotlight: allCampaigns
        .filter(c => c.campaignStatus === 'ACTIVE')
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),

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
        }),

      // Popular (Most Backed)
      popular: allCampaigns
        .filter(c => ['ACTIVE', 'SUCCESSFUL'].includes(c.campaignStatus))
        .sort((a, b) => (b.backersCount || 0) - (a.backersCount || 0))
        .slice(0, 12),

      // Success Stories
      successStories: allCampaigns
        .filter(c => c.campaignStatus === 'SUCCESSFUL')
        .sort((a, b) => (b.pledgedAmount || 0) - (a.pledgedAmount || 0)),

      // Quick Wins (goals <= 10M)
      quickWins: allCampaigns
        .filter(c => c.campaignStatus === 'ACTIVE' && (c.goalAmount || 0) <= 10000000)
        .sort((a, b) => {
          const progressA = (a.pledgedAmount / a.goalAmount) * 100;
          const progressB = (b.pledgedAmount / b.goalAmount) * 100;
          return progressB - progressA;
        })
        .slice(0, 12),

      // Overachievers (>100% Funded)
      overachievers: allCampaigns
        .filter(c => {
          if (!['ACTIVE', 'SUCCESSFUL'].includes(c.campaignStatus)) return false;
          if (!c.goalAmount || c.goalAmount === 0) return false;
          return (c.pledgedAmount || 0) >= c.goalAmount;
        })
        .sort((a, b) => {
          const ratioA = (a.pledgedAmount || 0) / a.goalAmount;
          const ratioB = (b.pledgedAmount || 0) / b.goalAmount;
          return ratioB - ratioA; // DESC - higher ratio first
        })
        .slice(0, 12),

      // Hidden Gems (goalAmount < 50M VND)
      hiddenGems: allCampaigns
        .filter(c => {
          if (!['ACTIVE', 'SUCCESSFUL'].includes(c.campaignStatus)) return false;
          return (c.goalAmount || 0) < 50000000; // < 50 million VND
        })
        .sort((a, b) => {
          const progressA = (a.pledgedAmount || 0) / (a.goalAmount || 1);
          const progressB = (b.pledgedAmount || 0) / (b.goalAmount || 1);
          return progressB - progressA; // DESC - higher progress first
        })
        .slice(0, 12),

      // Ending Soon (<= 7 days)
      endingSoon: allCampaigns
        .filter(c => {
          if (c.campaignStatus !== 'ACTIVE' || !c.endDate) return false;
          const daysLeft = Math.ceil((new Date(c.endDate) - now) / (1000 * 60 * 60 * 24));
          return daysLeft > 0 && daysLeft <= 7;
        })
        .sort((a, b) => new Date(a.endDate) - new Date(b.endDate)),
    };
  }, [allCampaigns]);

  return (
    <div className=" bg-background-light-2 dark:bg-darker overflow-x-hidden">
      {/* Hero Section */}
      <Hero />

      <Suspense fallback={<SectionLoader />}>
        {/* Featured & Spotlight Section - Layout giống ảnh tham khảo */}
        <FeaturedSpotlight
          campaigns={{ featured: filteredData.featured, spotlight: filteredData.spotlight }}
          loading={loading}
        />

        {/* Rankings - Top 10 by Funding & Audience */}
        <Rankings />

        {/* Almost There - Gần đạt mục tiêu (80-99%) */}
        <AlmostThereSection
          campaigns={filteredData.almostThere}
          loading={loading}
        />

        {/* How It Works */}
        <HowItWorks />

        {/* Success Stories - SUCCESSFUL campaigns */}
        <SuccessStoriesSection
          campaigns={filteredData.successStories}
          loading={loading}
        />

        {/* Hidden Gems - Tiềm năng */}
        <QuickWinsMostBackedSection
          campaigns={filteredData.hiddenGems}
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
      </Suspense>
    </div>
  );
}

// Export named for backward compatibility
export { HomePage };
