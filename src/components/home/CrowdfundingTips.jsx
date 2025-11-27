import React from 'react';
import { Clock, ArrowRight } from 'lucide-react';

const defaultTips = [
  {
    id: 'tip-001',
    title: '10 Chiến lược Marketing Hiệu quả cho Crowdfunding',
    excerpt:
      'Khám phá các phương pháp đã được chứng minh để tiếp cận và thu hút người ủng hộ tiềm năng cho dự án của bạn.',
    href: '/blog/marketing-strategies',
    imageUrl:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    category: 'Marketing',
    readTime: '8 phút đọc',
  },
  {
    id: 'tip-002',
    title: 'Cách Viết Pitch Deck Thu Hút Nhà Đầu Tư',
    excerpt:
      'Hướng dẫn chi tiết về cách tạo một bản trình bày dự án ấn tượng và chuyên nghiệp thu hút sự chú ý.',
    href: '/blog/pitch-deck-guide',
    imageUrl:
      'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80',
    category: 'Chiến lược',
    readTime: '6 phút đọc',
  },
  {
    id: 'tip-003',
    title: 'Xây Dựng Cộng Đồng Trung Thành Trước Khi Launch',
    excerpt:
      'Tạo momentum và xây dựng base fan vững chắc trước ngày ra mắt để đảm bảo thành công ngay từ đầu.',
    href: '/blog/build-community',
    imageUrl:
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
    category: 'Cộng đồng',
    readTime: '7 phút đọc',
  },
  {
    id: 'tip-004',
    title: 'Tối Ưu Video Campaign để Tăng Conversion',
    excerpt:
      'Video là yếu tố then chốt trong crowdfunding. Học cách tạo video campaign chuyên nghiệp với ngân sách hạn chế.',
    href: '/blog/video-optimization',
    imageUrl:
      'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=800&q=80',
    category: 'Content',
    readTime: '10 phút đọc',
  },
  {
    id: 'tip-005',
    title: 'Quản Lý Tài Chính và Fulfillment Hiệu Quả',
    excerpt:
      'Hướng dẫn quản lý ngân sách, thuế và giao hàng để đảm bảo dự án hoàn thành đúng hạn và ngân sách.',
    href: '/blog/financial-management',
    imageUrl:
      'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80',
    category: 'Quản lý',
    readTime: '12 phút đọc',
  },
  {
    id: 'tip-006',
    title: 'Tâm Lý Học Đằng Sau Quyết Định Ủng Hộ',
    excerpt:
      'Hiểu rõ động lực và tâm lý người ủng hộ để tạo ra campaign có sức ảnh hưởng và kết nối cảm xúc.',
    href: '/blog/backer-psychology',
    imageUrl:
      'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&q=80',
    category: 'Tâm lý',
    readTime: '9 phút đọc',
  },
];

export const CrowdfundingTips = ({
  tips = defaultTips,
  title = 'Bí quyết Crowdfunding thành công',
  subtitle = 'Học hỏi từ những chiến dịch xuất sắc và chuyên gia hàng đầu',
}) => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-background-light-2 dark:bg-darker transition-colors duration-300">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-hero font-bold text-text-primary dark:text-white mb-4 transition-colors duration-300">
            {title}
          </h2>
          <p className="text-lg text-text-secondary dark:text-text-white max-w-2xl mx-auto transition-colors duration-300">
            {subtitle}
          </p>
        </div>

        {/* Tips Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {tips.map((tip) => (
            <article
              key={tip.id}
              className="group bg-white dark:bg-darker-2 rounded-2xl overflow-hidden shadow-sm border-border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:ring-black/10 dark:hover:ring-primary-500/50"
            >
              {/* Image */}
              <div className="relative aspect-[16/9] overflow-hidden">
                <img
                  src={tip.imageUrl}
                  alt={tip.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary text-white shadow-lg">
                    {tip.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 sm:p-6">
                {/* Read Time */}
                {tip.readTime && (
                  <div className="flex items-center gap-2 text-xs text-text-secondary dark:text-text-white mb-3 transition-colors duration-300">
                    <Clock className="w-4 h-4" />
                    <span>{tip.readTime}</span>
                  </div>
                )}

                {/* Title */}
                <h3 className="text-xl font-bold text-text-primary dark:text-white mb-3 line-clamp-2 transition-colors duration-300 group-hover:text-primary dark:group-hover:text-primary-400">
                  {tip.title}
                </h3>

                {/* Excerpt */}
                <p className="text-text-secondary dark:text-text-white line-clamp-2 mb-4 leading-relaxed transition-colors duration-300">
                  {tip.excerpt}
                </p>

                {/* Read More Link */}
                <a
                  href={tip.href}
                  className="inline-flex items-center gap-2 text-primary dark:text-primary-400 font-semibold hover:gap-3 transition-all duration-300"
                >
                  Đọc tiếp
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CrowdfundingTips;
