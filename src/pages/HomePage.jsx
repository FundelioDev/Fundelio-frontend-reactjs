import Hero from '@/components/common/Hero';
import HowItWorks from '@/components/home/HowItWorks';
import Rankings from '@/components/home/Rankings';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import CrowdfundingTips from '@/components/home/CrowdfundingTips';
import PrimaryCTA from '@/components/home/PrimaryCTA';
import React from 'react';
import RecentSavedCampaigns from '@/components/home/RecentSavedCampaigns';
import PopularCampaigns from '@/components/home/PopularCampaigns';
import FeaturedSpotlight from '@/components/home/FeaturedSpotlight';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background-light-2 dark:bg-darker overflow-x-hidden">
      {/* Hero Section */}
      <Hero />

      {/* Featured & Spotlight Section - Layout giống ảnh tham khảo */}
      <FeaturedSpotlight />

      {/* Popular Campaigns */}
      <PopularCampaigns />

      {/* How It Works */}
      <HowItWorks />

      <RecentSavedCampaigns />

      {/* Rankings - Top 10 by Funding & Audience */}
      <Rankings />

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
