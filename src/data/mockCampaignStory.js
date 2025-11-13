/**
 * Mock saved campaign story data (campaign_sections table in ERD)
 * Generated from CreateCampaignPage save functionality
 * Using camelCase convention
 */

export const mockCampaignStory = {
  version: 1,
  createdAt: '2025-10-02T10:30:00.000Z',
  // Based on campaign_sections table schema
  sections: [
    {
      campaignSectionId: 'section-001',
      campaignId: 'odin-3',
      tabTitle: 'Giới thiệu dự án',
      formatTitle: '<b>Giới thiệu dự án</b>',
      itemData: `
        <p>Chào mừng bạn đến với dự án <b>FundFountain</b> - nền tảng gây quỹ cộng đồng hàng đầu Việt Nam.</p>
        <p>Chúng tôi tin rằng mọi ý tưởng tuyệt vời đều xứng đáng được hiện thực hóa. Với FundFountain, bạn có thể:</p>
        <ul>
          <li>Tạo chiến dịch gây quỹ dễ dàng</li>
          <li>Kết nối với cộng đồng đam mê</li>
          <li>Biến ý tưởng thành hiện thực</li>
        </ul>
      `,
      orderIndex: 0,
    },
    {
      campaignSectionId: 'section-002',
      campaignId: 'odin-3',
      tabTitle: 'Câu chuyện của chúng tôi',
      formatTitle: 'Câu chuyện của chúng tôi',
      itemData: `
        <h2 class="text-2xl font-bold mt-4 mb-2 dark:text-white">Khởi đầu từ một ý tưởng</h2>
        <p>Năm 2024, chúng tôi nhận ra rằng nhiều dự án tuyệt vời không thể khởi động vì thiếu nguồn vốn ban đầu. Từ đó, FundFountain ra đời với sứ mệnh <i>kết nối những người có ý tưởng với những người sẵn sàng hỗ trợ</i>.</p>
        <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800" class="max-w-full h-auto block mx-auto my-4 rounded-xl" alt="Team collaboration" />
        <p>Đội ngũ của chúng tôi bao gồm các chuyên gia trong lĩnh vực công nghệ, tài chính và marketing.</p>
      `,
      orderIndex: 1,
    },
    {
      campaignSectionId: 'section-003',
      campaignId: 'odin-3',
      tabTitle: 'Mục tiêu chiến dịch',
      formatTitle: '<span style="color: #0894e2;">Mục tiêu chiến dịch</span>',
      itemData: `
        <h2 class="text-2xl font-bold mt-4 mb-2 dark:text-white">Chúng tôi cần 100,000,000 VNĐ</h2>
        <p>Số tiền này sẽ được sử dụng để:</p>
        <ul>
          <li><b>Phát triển nền tảng:</b> 40% (40,000,000 VNĐ)</li>
          <li><b>Marketing & PR:</b> 30% (30,000,000 VNĐ)</li>
          <li><b>Vận hành:</b> 20% (20,000,000 VNĐ)</li>
          <li><b>Dự phòng:</b> 10% (10,000,000 VNĐ)</li>
        </ul>
        <p>Mỗi đồng góp đều có ý nghĩa to lớn với chúng tôi! 💙</p>
      `,
      orderIndex: 2,
    },
    {
      campaignSectionId: 'section-004',
      campaignId: 'odin-3',
      tabTitle: 'Video giới thiệu',
      formatTitle: 'Video giới thiệu',
      itemData: `
        <p>Xem video giới thiệu chi tiết về dự án của chúng tôi:</p>
        <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" allowfullscreen class="w-full aspect-video rounded-xl my-4"></iframe>
        <p><i>Video trên giới thiệu tổng quan về tầm nhìn và sứ mệnh của FundFountain.</i></p>
      `,
      orderIndex: 3,
    },
    {
      campaignSectionId: 'section-005',
      campaignId: 'odin-3',
      tabTitle: 'Kế hoạch thực hiện',
      formatTitle: 'Kế hoạch thực hiện',
      itemData: `
        <h2 class="text-2xl font-bold mt-4 mb-2 dark:text-white">Timeline dự án</h2>
        <p><b>Quý 1/2025:</b> Hoàn thiện MVP và beta testing</p>
        <p><b>Quý 2/2025:</b> Ra mắt chính thức và chiến dịch marketing</p>
        <p><b>Quý 3/2025:</b> Mở rộng tính năng và hỗ trợ thanh toán quốc tế</p>
        <p><b>Quý 4/2025:</b> Đạt 10,000 người dùng và 1,000 chiến dịch thành công</p>
        <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800" class="max-w-full h-auto block mx-auto my-4 rounded-xl" alt="Planning" />
      `,
      orderIndex: 4,
    },
    {
      campaignSectionId: 'section-006',
      campaignId: 'odin-3',
      tabTitle: 'Đội ngũ thực hiện',
      formatTitle: '<b><u>Đội ngũ thực hiện</u></b>',
      itemData: `
        <p>Dự án được thực hiện bởi một đội ngũ giàu kinh nghiệm:</p>
        <h2 class="text-2xl font-bold mt-4 mb-2 dark:text-white">Core Team</h2>
        <p>🧑‍💻 <b>Nguyễn Văn A</b> - CEO & Founder</p>
        <p>👩‍💻 <b>Trần Thị B</b> - CTO</p>
        <p>🎨 <b>Lê Văn C</b> - Head of Design</p>
        <p>📊 <b>Phạm Thị D</b> - Marketing Manager</p>
        <p><i>Tổng cộng 15+ năm kinh nghiệm trong lĩnh vực fintech và crowdfunding.</i></p>
      `,
      orderIndex: 5,
    },
    {
      campaignSectionId: 'section-007',
      campaignId: 'odin-3',
      tabTitle: 'Lời cảm ơn',
      formatTitle: 'Lời cảm ơn',
      itemData: `
        <p>Cảm ơn bạn đã dành thời gian tìm hiểu về dự án của chúng tôi! ❤️</p>
        <p>Sự ủng hộ của bạn không chỉ là nguồn tài chính mà còn là động lực tinh thần to lớn giúp chúng tôi tiếp tục phát triển.</p>
        <h2 class="text-2xl font-bold mt-4 mb-2 dark:text-white">Hãy cùng chúng tôi tạo nên sự khác biệt!</h2>
        <p><b>Mọi đóng góp đều được ghi nhận và tri ân.</b> Hãy trở thành một phần của hành trình này!</p>
        <p style="color: #0894e2; font-size: 18px;"><b>🚀 Cùng nhau, chúng ta sẽ bay cao hơn!</b></p>
      `,
      orderIndex: 6,
    },
  ],
};

/**
 * Function to load mock data into CreateCampaignPage
 * Can be used for testing or demo purposes
 */
export function loadMockCampaignStory() {
  return mockCampaignStory;
}

/**
 * Transform sections to blanks format for display
 * Now uses camelCase consistently
 */
export function getBlanksFromSections(sections) {
  console.log('getBlanksFromSections - input sections:', sections);
  
  if (!sections || !Array.isArray(sections)) {
    console.warn('getBlanksFromSections - sections is not an array:', sections);
    return [];
  }

  const blanks = sections.map(section => ({
    id: section.campaignSectionId,
    order: section.orderIndex,
    titleText: section.tabTitle,
    titleHtml: section.formatTitle,
    contentHtml: section.itemData,
  }));

  console.log('getBlanksFromSections - output blanks:', blanks);
  return blanks;
}
