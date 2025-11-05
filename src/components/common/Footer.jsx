import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

export const Footer = () => {
  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#facebook' },
    { name: 'Instagram', icon: Instagram, href: '#instagram' },
    { name: 'LinkedIn', icon: Linkedin, href: '#linkedin' },
    { name: 'Twitter', icon: Twitter, href: '#twitter' },
  ];

  // Dữ liệu cho các section
  const footerSections = [
    {
      title: 'Giới thiệu',
      links: [
        { name: 'Về chúng tôi', href: '#about' },
        { name: 'Tuyển dụng', href: '#careers' },
        { name: 'Báo chí', href: '#press' },
      ],
    },
    {
      title: 'Hỗ trợ',
      links: [
        { name: 'Câu hỏi thường gặp', href: '#faq' },
        { name: 'Liên hệ', href: '#contact' },
        { name: 'Điều khoản sử dụng', href: '#terms' },
        { name: 'Chính sách bảo mật', href: '#privacy' },
      ],
    },
    {
      title: 'Cộng đồng',
      links: [
        { name: 'Blog', href: '#blog' },
        { name: 'Diễn đàn', href: '#forum' },
        { name: 'Sự kiện', href: '#events' },
      ],
    },
  ];

  return (
    <footer className="sticky top-[100vh] bg-white dark:bg-darker border-t border-gray-200 dark:border-gray-700 text-text-primary dark:text-white py-8 sm:py-10 lg:py-12 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-container">
        {/* Main Grid - 4 sections */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Section 1 - Logo & Social */}
          <div className="col-span-1">
            <h2 className="text-xl sm:text-2xl font-bold text-text-primary dark:text-white mb-3 sm:mb-4 transition-colors duration-300">
              Fundelio
            </h2>
            <p className="text-text-secondary dark:text-text-white text-sm mb-4 sm:mb-6 leading-relaxed transition-colors duration-300">
              Nền tảng gây quỹ cộng đồng cho các dự án sáng tạo và khởi nghiệp.
            </p>
            <div className="flex space-x-3 sm:space-x-4">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    className="p-2 rounded-lg text-text-secondary dark:text-text-white hover:text-primary dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-gray-800 transition-all duration-200"
                    title={social.name}
                  >
                    <IconComponent className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Sections 2, 3, 4 - Navigation Links */}
          {footerSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="col-span-1">
              <h3 className="text-base sm:text-lg font-semibold text-text-primary dark:text-white mb-3 sm:mb-4 transition-colors duration-300">
                {section.title}
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="text-text-secondary dark:text-text-white hover:text-primary dark:hover:text-primary-400 transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Separator Line */}
        <div className="border-t border-gray-300 dark:border-gray-700 pt-4 sm:pt-6 transition-colors duration-300">
          <div className="text-center">
            <p className="text-text-secondary dark:text-text-white text-xs sm:text-sm transition-colors duration-300">
              © 2025 Fundelio. Mọi quyền được bảo lưu.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
