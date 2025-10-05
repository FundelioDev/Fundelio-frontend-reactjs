import React from 'react';
import CampaignHeader from '@/components/campaign/CampaignHeader';
import CampaignTabs from '@/components/campaign/CampaignTabs';

/**
 * CampaignDetailPage Component
 * Displays the full campaign detail page with header and additional content
 */
export default function CampaignDetailPage() {
  // Mock campaign data
  const campaignData = {
    title: 'Odin 3: The Ultimate 6" 120Hz OLED Gaming Handheld',
    highlights: [
      '8 Elite | Exclusive 6" 120Hz AMOLED Touch Screen',
      'Full Size Stick | 8000mAh | 390g | Ergonomic Grip',
      'Premium Build Quality with Advanced Cooling System',
    ],
    creator: {
      name: 'AYN Technologies',
      location: 'Shenzhen, China',
      link: '#creator-profile',
    },
    imageUrl:
      'https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=1200&auto=format&fit=crop',
    currency: 'USD',
    pledged: 7697612,
    goal: 50000,
    backers: 2018,
    daysLeft: 4,
  };

  // Mock rewards data
  const rewards = [
    {
      id: 'reward-1',
      title: 'DiskPro 1TB [Kickstarter Price]',
      priceLabel: 'US$ 199',
      description: `DiskPro Kickstarter Price! 16.7% Off the retail price!\n\nBuilt-in 1TB SSD for massive storage capacity. Ultra-fast read/write speeds up to 550MB/s. Compact and portable design fits in your pocket.`,
      coverUrl:
        'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?q=80&w=600&auto=format&fit=crop',
      backers: 4,
      shipsTo: 'Only certain countries',
      eta: 'Dec 2025',
      itemsIncluded: 4,
      thumbnails: [
        'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?q=80&w=150&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=150&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?q=80&w=150&auto=format&fit=crop',
      ],
      addOnCount: 1,
      detailsHref: '#reward-1-details',
      pledgeActionLabel: 'Pledge US$ 199',
    },
    {
      id: 'reward-2',
      title: 'Early Bird Special - 2TB Edition',
      priceLabel: 'US$ 349',
      description: `Limited Early Bird offer! 2TB storage for power users.\n\nDouble the storage, same blazing-fast speed. Perfect for professionals and content creators. Only 50 units available at this price!`,
      coverUrl:
        'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=600&auto=format&fit=crop',
      backers: 12,
      shipsTo: 'Worldwide',
      eta: 'Jan 2026',
      itemsIncluded: 5,
      thumbnails: [
        'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=150&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?q=80&w=150&auto=format&fit=crop',
      ],
      addOnCount: 2,
      detailsHref: '#reward-2-details',
      pledgeActionLabel: 'Pledge US$ 349',
    },
  ];

  // Mock creator data
  const creator = {
    name: 'BEAVERLAB TECH',
    created: 5,
    backed: 9,
    avatarUrl: 'https://i.pravatar.cc/150?img=12',
    bio: "BEAVERLAB is a trailblazer in merging optics and technology innovation. We create cutting-edge products that push the boundaries of what's possible.",
    moreHref: '#creator-profile',
  };

  // Mock story blanks
  const blanks = [
    {
      id: 'blank-intro',
      order: 0,
      title_text: 'Our Commitments - Two 100%',
      title_html: 'Our Commitments - Two 100%',
      content_html: `
        <h2 class="text-2xl font-bold mt-4 mb-2">Khởi đầu từ một ý tưởng</h2>
        <p>Dự án này bắt đầu từ một ý tưởng đơn giản: tạo ra một thiết bị lưu trữ di động vừa mạnh mẽ, vừa tiện lợi. Sau nhiều tháng nghiên cứu và phát triển, chúng tôi tự hào giới thiệu DiskPro - giải pháp lưu trữ hoàn hảo cho thế kỷ 21.</p>
        <img src="https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?q=80&w=1200&auto=format&fit=crop" class="max-w-full h-auto block mx-auto my-4 rounded-xl" alt="Product concept" />
        <p>Với tốc độ đọc/ghi lên đến 550MB/s và thiết kế siêu gọn nhẹ, DiskPro là người bạn đồng hành lý tưởng cho mọi chuyến đi.</p>
      `,
    },
    {
      id: 'blank-video',
      order: 1,
      title_text: 'Video giới thiệu',
      title_html: 'Video giới thiệu',
      content_html: `
        <p>Xem video giới thiệu chi tiết về dự án và tìm hiểu thêm về công nghệ đằng sau DiskPro:</p>
        <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" allowfullscreen class="w-full aspect-video rounded-xl my-4"></iframe>
        <p>Video này sẽ giúp bạn hiểu rõ hơn về quy trình sản xuất và những tính năng độc đáo của sản phẩm.</p>
      `,
    },
    {
      id: 'blank-features',
      order: 2,
      title_text: 'Tính năng nổi bật',
      title_html: 'Tính năng nổi bật',
      content_html: `
        <h3 class="text-xl font-semibold mt-4 mb-2">Công nghệ tiên tiến</h3>
        <ul>
          <li>Chip điều khiển thế hệ mới nhất</li>
          <li>Tốc độ truyền dữ liệu siêu nhanh</li>
          <li>Tiết kiệm năng lượng tối ưu</li>
          <li>Chống sốc và chống nước IP67</li>
        </ul>
        <h3 class="text-xl font-semibold mt-4 mb-2">Thiết kế hoàn hảo</h3>
        <p>Chúng tôi đã dành hàng trăm giờ để tối ưu hóa từng chi tiết, từ chất liệu vỏ nhôm cao cấp đến đèn LED thông minh báo trạng thái.</p>
        <img src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=1200&auto=format&fit=crop" class="max-w-full h-auto block mx-auto my-4 rounded-xl" alt="Design details" />
      `,
    },
    
  ];

  // Handler functions
  const handlePickPerk = () => {
    console.log('Pick Your Perk clicked');
    // Navigate to perks section or show perks modal
  };

  const handleSave = () => {
    console.log('Save For Later clicked');
    // Save campaign to user's saved list
  };

  const handleShare = () => {
    console.log('Share clicked');
    // Open share modal or native share dialog
  };

  const handlePledge = (pledgeData) => {
    console.log('Pledge:', pledgeData);
    // Handle pledge action
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black pt-20">
      {/* Campaign Header Section */}
      <CampaignHeader
        campaign={campaignData}
        onPickPerk={handlePickPerk}
        onSave={handleSave}
        onShare={handleShare}
      />

      {/* Tabbed Content */}
      <CampaignTabs
        initialTab="campaign"
        campaignProps={{
          rewards,
          creator,
          blanks,
          currency: campaignData.currency,
          onPledge: handlePledge,
        }}
      />
    </div>
  );
}

// Export named for backward compatibility
export { CampaignDetailPage };
