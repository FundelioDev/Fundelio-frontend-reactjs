import React from 'react';
import Button from '../common/Button';
import { Sparkles } from 'lucide-react';

export const PrimaryCTA = ({
  heading = 'Biến ý tưởng thành hiện thực',
  subheading = 'Bắt đầu chiến dịch gây quỹ của bạn ngay hôm nay và kết nối với hàng ngàn người ủng hộ đam mê',
  buttonText = 'Khởi tạo dự án ngay',
  buttonHref = '/create',
}) => {
  return (
    <section
      className="pb-14 sm:pb-16 lg:pb-20 bg-gray-50 dark:bg-darker transition-colors duration-300"
      role="region"
      aria-label="Lời kêu gọi hành động"
    >
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        {/* CTA Card */}
        <div
          className="relative rounded-3xl p-10 sm:p-12 lg:p-16 text-center shadow-2xl ring-1 ring-black/5 dark:ring-white/10 overflow-hidden transition-all duration-300"
          style={{
            background:
              'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-400) 35%, var(--color-secondary-400) 70%, var(--color-secondary) 100%)',
          }}
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-darker-2-light/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          {/* Content */}
          <div className="relative z-10 max-w-3xl mx-auto">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-white/20 backdrop-blur-sm">
              <Sparkles className="w-8 h-8 text-white" />
            </div>

            {/* Heading */}
            <h2 className="text-3xl sm:text-hero font-bold text-white mb-4 sm:mb-6 leading-tight">
              {heading}
            </h2>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-white/90 mb-8 sm:mb-10 leading-relaxed max-w-2xl mx-auto">
              {subheading}
            </p>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                as="a"
                href={buttonHref}
                variant="secondary"
                size="lg"
                className="min-w-[220px] bg-white text-primary hover:bg-white/90 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                {buttonText}
              </Button>
              <Button
                as="a"
                href="/explore"
                variant="outline"
                size="lg"
                className="min-w-[220px] border-2 border-white text-white hover:bg-white/10 backdrop-blur-sm"
              >
                Khám phá dự án
              </Button>
            </div>

            {/* Additional Info */}
            <div className="mt-10 sm:mt-12 flex flex-wrap justify-center gap-6 sm:gap-8 text-white/80">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                  10,000+
                </div>
                <div className="text-sm">Dự án thành công</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                  $50M+
                </div>
                <div className="text-sm">Tổng số tiền gây quỹ</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                  500K+
                </div>
                <div className="text-sm">Người ủng hộ</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrimaryCTA;
