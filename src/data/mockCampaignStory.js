/**
 * Mock saved campaign story data (campaign_sections table in ERD)
 * Generated from CreateCampaignPage save functionality
 */

export const mockCampaignStory = {
  version: 1,
  createdAt: '2025-10-02T10:30:00.000Z',
  // Based on campaign_sections table schema
  sections: [
    {
      campaign_section_id: 'section-001',
      campaign_id: 'odin-3',
      tab_title: 'Giới thiệu dự án',
      format_title: '<b>Giới thiệu dự án</b>',
      item_data: `
        <p>Chào mừng bạn đến với dự án <b>FundFountain</b> - nền tảng gây quỹ cộng đồng hàng đầu Việt Nam.</p>
        <p>Chúng tôi tin rằng mọi ý tưởng tuyệt vời đều xứng đáng được hiện thực hóa. Với FundFountain, bạn có thể:</p>
        <ul>
          <li>Tạo chiến dịch gây quỹ dễ dàng</li>
          <li>Kết nối với cộng đồng đam mê</li>
          <li>Biến ý tưởng thành hiện thực</li>
        </ul>
      `,
      order_index: 0,
    },
    {
      campaign_section_id: 'section-002',
      campaign_id: 'odin-3',
      tab_title: 'Câu chuyện của chúng tôi',
      format_title: 'Câu chuyện của chúng tôi',
      item_data: `
        <h2 class="text-2xl font-bold mt-4 mb-2 dark:text-white">Khởi đầu từ một ý tưởng</h2>
        <p>Năm 2024, chúng tôi nhận ra rằng nhiều dự án tuyệt vời không thể khởi động vì thiếu nguồn vốn ban đầu. Từ đó, FundFountain ra đời với sứ mệnh <i>kết nối những người có ý tưởng với những người sẵn sàng hỗ trợ</i>.</p>
        <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800" class="max-w-full h-auto block mx-auto my-4 rounded-xl" alt="Team collaboration" />
        <p>Đội ngũ của chúng tôi bao gồm các chuyên gia trong lĩnh vực công nghệ, tài chính và marketing.</p>
      `,
      order_index: 1,
    },
    {
      campaign_section_id: 'section-003',
      campaign_id: 'odin-3',
      tab_title: 'Mục tiêu chiến dịch',
      format_title: '<span style="color: #0894e2;">Mục tiêu chiến dịch</span>',
      item_data: `
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
      order_index: 2,
    },
    {
      campaign_section_id: 'section-004',
      campaign_id: 'odin-3',
      tab_title: 'Video giới thiệu',
      format_title: 'Video giới thiệu',
      item_data: `
        <p>Xem video giới thiệu chi tiết về dự án của chúng tôi:</p>
        <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" allowfullscreen class="w-full aspect-video rounded-xl my-4"></iframe>
        <p><i>Video trên giới thiệu tổng quan về tầm nhìn và sứ mệnh của FundFountain.</i></p>
      `,
      order_index: 3,
    },
    {
      campaign_section_id: 'section-005',
      campaign_id: 'odin-3',
      tab_title: 'Kế hoạch thực hiện',
      format_title: 'Kế hoạch thực hiện',
      item_data: `
        <h2 class="text-2xl font-bold mt-4 mb-2 dark:text-white">Timeline dự án</h2>
        <p><b>Quý 1/2025:</b> Hoàn thiện MVP và beta testing</p>
        <p><b>Quý 2/2025:</b> Ra mắt chính thức và chiến dịch marketing</p>
        <p><b>Quý 3/2025:</b> Mở rộng tính năng và hỗ trợ thanh toán quốc tế</p>
        <p><b>Quý 4/2025:</b> Đạt 10,000 người dùng và 1,000 chiến dịch thành công</p>
        <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800" class="max-w-full h-auto block mx-auto my-4 rounded-xl" alt="Planning" />
      `,
      order_index: 4,
    },
    {
      campaign_section_id: 'section-006',
      campaign_id: 'odin-3',
      tab_title: 'Đội ngũ thực hiện',
      format_title: '<b><u>Đội ngũ thực hiện</u></b>',
      item_data: `
        <p>Dự án được thực hiện bởi một đội ngũ giàu kinh nghiệm:</p>
        <h2 class="text-2xl font-bold mt-4 mb-2 dark:text-white">Core Team</h2>
        <p>🧑‍💻 <b>Nguyễn Văn A</b> - CEO & Founder</p>
        <p>👩‍💻 <b>Trần Thị B</b> - CTO</p>
        <p>🎨 <b>Lê Văn C</b> - Head of Design</p>
        <p>📊 <b>Phạm Thị D</b> - Marketing Manager</p>
        <p><i>Tổng cộng 15+ năm kinh nghiệm trong lĩnh vực fintech và crowdfunding.</i></p>
      `,
      order_index: 5,
    },
    {
      campaign_section_id: 'section-007',
      campaign_id: 'odin-3',
      tab_title: 'Lời cảm ơn',
      format_title: 'Lời cảm ơn',
      item_data: `
        <p>Cảm ơn bạn đã dành thời gian tìm hiểu về dự án của chúng tôi! ❤️</p>
        <p>Sự ủng hộ của bạn không chỉ là nguồn tài chính mà còn là động lực tinh thần to lớn giúp chúng tôi tiếp tục phát triển.</p>
        <h2 class="text-2xl font-bold mt-4 mb-2 dark:text-white">Hãy cùng chúng tôi tạo nên sự khác biệt!</h2>
        <p><b>Mọi đóng góp đều được ghi nhận và tri ân.</b> Hãy trở thành một phần của hành trình này!</p>
        <p style="color: #0894e2; font-size: 18px;"><b>🚀 Cùng nhau, chúng ta sẽ bay cao hơn!</b></p>
      `,
      order_index: 6,
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

// Backward compatibility - map to old structure
export function getBlanksFromSections(sections) {
  return sections.map(section => ({
    id: section.campaign_section_id,
    order: section.order_index,
    title_text: section.tab_title,
    title_html: section.format_title,
    content_html: section.item_data,
  }));
}
