import React from 'react';
import { Shield, Zap, Users, Award, Heart, TrendingUp } from 'lucide-react';

const defaultReasons = [
  {
    icon: <Shield className="w-8 h-8" />,
    title: 'An toàn & Bảo mật',
    description:
      'Hệ thống thanh toán được mã hóa và bảo vệ bởi các công nghệ bảo mật hàng đầu. Tiền của bạn được đảm bảo an toàn.',
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: 'Nhanh chóng & Hiệu quả',
    description:
      'Khởi tạo dự án chỉ trong vài phút. Tiếp cận người ủng hộ ngay lập tức và nhận tiền nhanh chóng khi đạt mục tiêu.',
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: 'Cộng đồng Năng động',
    description:
      'Kết nối với hơn 500,000 người ủng hộ đam mê. Cộng đồng luôn sẵn sàng hỗ trợ và chia sẻ ý tưởng sáng tạo.',
  },
  {
    icon: <Award className="w-8 h-8" />,
    title: 'Tỷ lệ Thành công Cao',
    description:
      '85% dự án đạt được mục tiêu gây quỹ. Chúng tôi cung cấp công cụ và hỗ trợ để tối ưu hóa chiến dịch của bạn.',
  },
  {
    icon: <Heart className="w-8 h-8" />,
    title: 'Hỗ trợ Tận tình',
    description:
      'Đội ngũ chuyên gia luôn sẵn sàng tư vấn 24/7. Từ lập kế hoạch đến thực hiện, chúng tôi đồng hành cùng bạn.',
  },
  {
    icon: <TrendingUp className="w-8 h-8" />,
    title: 'Công cụ Marketing Mạnh mẽ',
    description:
      'Tích hợp mạng xã hội, email marketing, và analytics chi tiết. Theo dõi và tối ưu chiến dịch theo thời gian thực.',
  },
];

export const WhyChooseUs = ({
  reasons = defaultReasons,
  title = 'Tại sao chọn chúng tôi?',
  subtitle = 'Nền tảng crowdfunding hàng đầu dành cho những người có ý tưởng táo bạo',
}) => {
  return (
    <section className="pb-12 sm:py-16 lg:py-20 bg-background-light-2 dark:bg-darker transition-colors duration-300">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-hero font-bold text-text-primary dark:text-text-white mb-4 transition-colors duration-300">
            {title}
          </h2>
          <p className="text-lg text-text-secondary dark:text-gray-400 max-w-2xl mx-auto transition-colors duration-300">
            {subtitle}
          </p>
        </div>

        {/* Reasons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:ring-primary/50 dark:hover:ring-primary-500/50"
            >
              {/* Background Gradient Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent dark:from-primary/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div className="inline-flex p-3 rounded-xl bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-400 mb-4 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary dark:group-hover:bg-primary-500 group-hover:text-white">
                  {reason.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-bold text-text-primary dark:text-text-white mb-3 transition-colors duration-300">
                  {reason.title}
                </h3>

                {/* Description */}
                <p className="text-text-secondary dark:text-gray-400 leading-relaxed transition-colors duration-300">
                  {reason.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12 sm:mt-16">
          <p className="text-lg text-text-secondary dark:text-gray-400 mb-6 transition-colors duration-300">
            Hơn{' '}
            <strong className="text-primary dark:text-primary-400">
              10,000+
            </strong>{' '}
            nhà sáng tạo đã tin tưởng và thành công cùng chúng tôi
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/success-stories"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-600 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg"
            >
              Khám phá câu chuyện thành công
            </a>
            <a
              href="/about"
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 hover:border-primary dark:hover:border-primary-400 text-text-primary dark:text-text-white font-semibold rounded-lg transition-all duration-300"
            >
              Tìm hiểu về chúng tôi
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
