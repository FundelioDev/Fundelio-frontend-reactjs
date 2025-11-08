import React from 'react';
import { Lightbulb, Users, Rocket, ArrowRight } from 'lucide-react';

const defaultSteps = [
  {
    icon: <Lightbulb className="w-6 h-6" />,
    title: 'Tạo dự án',
    desc: 'Chia sẻ ý tưởng của bạn với cộng đồng. Thiết lập mục tiêu và thời gian gây quỹ phù hợp.',
    href: '/guide/create-project',
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Kết nối cộng đồng',
    desc: 'Tiếp cận hàng ngàn người ủng hộ tiềm năng. Xây dựng niềm tin qua câu chuyện chân thực.',
    href: '/guide/build-community',
  },
  {
    icon: <Rocket className="w-6 h-6" />,
    title: 'Khởi chạy mục tiêu',
    desc: 'Nhận được tài trợ và biến ý tưởng thành hiện thực. Cập nhật tiến độ thường xuyên với backers.',
    href: '/guide/launch',
  },
];

export const HowItWorks = ({ steps = defaultSteps }) => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-background-light-2 dark:bg-darker transition-colors duration-300">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-hero font-bold text-text-primary dark:text-white mb-4 transition-colors duration-300">
            Cách hoạt động
          </h2>
          <p className="text-lg text-text-secondary dark:text-text-white max-w-2xl mx-auto transition-colors duration-300">
            Ba bước đơn giản để biến ý tưởng của bạn thành hiện thực
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="group relative bg-white dark:bg-darker-2 rounded-3xl p-6 sm:p-8 border-border shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              {/* Step Number Badge */}
              <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg shadow-lg">
                {index + 1}
              </div>

              {/* Icon */}
              <div className="mb-6">
                <div className="inline-flex p-4 rounded-2xl bg-primary-100 dark:bg-primary-800/50 text-primary-600 dark:text-primary-400 transition-colors duration-300">
                  {step.icon}
                </div>
              </div>

              {/* Content */}
              <h3 className="text-xl sm:text-2xl font-bold text-text-primary dark:text-white mb-3 transition-colors duration-300">
                {step.title}
              </h3>
              <p className="text-text-secondary dark:text-text-white leading-relaxed mb-4 transition-colors duration-300">
                {step.desc}
              </p>

              {/* Learn More Link */}
              {step.href && (
                <a
                  href={step.href}
                  className="inline-flex items-center gap-2 text-primary dark:text-primary-400 font-semibold hover:gap-3 transition-all duration-300 group-hover:text-primary-600 dark:group-hover:text-primary-300"
                >
                  Tìm hiểu thêm
                  <ArrowRight className="w-4 h-4" />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
