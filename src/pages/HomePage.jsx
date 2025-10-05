import Hero from '@/components/common/Hero';
import HowItWorks from '@/components/home/HowItWorks';
import NearGoalMasonry from '@/components/home/NearGoalMasonry';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import CrowdfundingTips from '@/components/home/CrowdfundingTips';
import PrimaryCTA from '@/components/home/PrimaryCTA';
import React from 'react';
import RecentSavedCampaigns from '@/components/home/RecentSavedCampaigns';
import PopularCampaigns from '@/components/home/PopularCampaigns';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Hero Section */}
      <Hero />

      {/* Featured Projects Slider */}
      <PopularCampaigns />

      {/* How It Works */}
      <HowItWorks />

      <RecentSavedCampaigns />

      {/* Near Goal - Masonry Layout */}
      <NearGoalMasonry />

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
