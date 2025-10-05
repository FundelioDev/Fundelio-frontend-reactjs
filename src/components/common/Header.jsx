import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ChevronDown,
  Monitor,
  Music,
  Film,
  Shirt,
  Gamepad2,
  Palette,
  Sun,
  Moon,
  Globe,
  Menu,
  X,
} from 'lucide-react';
import Button from './Button';
import { useTheme } from '../../contexts/ThemeContext';

export const Header = ({ variant = 'transparent' }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { toggleTheme, isDark } = useTheme();
  const location = useLocation();

  // Theo dõi scroll để thay đổi background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Định nghĩa các danh mục
  const categories = [
    { name: 'Công nghệ', icon: Monitor, href: '#technology' },
    { name: 'Âm nhạc', icon: Music, href: '#music' },
    { name: 'Phim', icon: Film, href: '#film' },
    { name: 'Thời trang', icon: Shirt, href: '#fashion' },
    { name: 'Game', icon: Gamepad2, href: '#game' },
    { name: 'Nghệ thuật', icon: Palette, href: '#art' },
  ];

  // Định nghĩa các variant cho header
  const headerVariants = {
    transparent: {
      container: isScrolled
        ? 'bg-white/95 dark:bg-darker backdrop-blur-md text-text-primary dark:text-text-white shadow-md transition-colors duration-300'
        : 'bg-transparent text-text-white',
      title: isScrolled
        ? 'text-text-primary dark:text-text-white transition-colors duration-300'
        : 'text-text-white',
      navLink: isScrolled
        ? 'text-text-primary dark:text-text-white hover:text-primary dark:hover:text-primary-400 transition-colors duration-300'
        : 'text-text-white hover:text-secondary',
      dropdown:
        'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-text-primary dark:text-text-white transition-colors duration-300',
      dropdownItem:
        'hover:bg-gray-50 dark:hover:bg-gray-700 text-text-primary dark:text-text-white hover:text-primary dark:hover:text-primary-400 transition-colors duration-300',
      button: isScrolled
        ? 'text-text-primary dark:text-text-white transition-colors duration-300'
        : 'text-text-white',
    },
    light: {
      container:
        'bg-white dark:bg-darker text-text-primary dark:text-text-white shadow-md transition-colors duration-300',
      title:
        'text-text-primary dark:text-text-white transition-colors duration-300',
      navLink:
        'text-text-primary dark:text-text-white hover:text-primary dark:hover:text-primary-400 transition-colors duration-300',
      dropdown:
        'bg-white dark:bg-black border border-gray-200 dark:border-gray-700 text-text-primary dark:text-text-white transition-colors duration-300',
      dropdownItem:
        'hover:bg-gray-50 dark:hover:bg-gray-700 text-text-primary dark:text-text-white hover:text-primary dark:hover:text-primary-400 transition-colors duration-300',
      button:
        'text-text-primary dark:text-text-white transition-colors duration-300',
    },
    primary: {
      container:
        'bg-primary dark:bg-primary-700 text-text-white shadow-md transition-colors duration-300',
      title: 'text-text-white',
      navLink:
        'text-text-white hover:text-secondary dark:hover:text-secondary-400 transition-colors duration-300',
      dropdown:
        'bg-primary dark:bg-primary-700 border border-secondary dark:border-secondary-600 text-text-white transition-colors duration-300',
      dropdownItem:
        'hover:bg-secondary/10 dark:hover:bg-secondary/20 text-text-white hover:text-secondary dark:hover:text-secondary-400 transition-colors duration-300',
      button: 'text-text-white',
    },
  };

  const currentVariant = headerVariants[variant];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 py-3 px-4 sm:py-4 sm:px-6 transition-all duration-300 ${currentVariant.container}`}
    >
      <div className="mx-auto max-w-[1400px] flex items-center justify-between lg:grid lg:grid-cols-[1fr_auto_1fr]">
        {/* Left - Logo & Explore */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Link to="/">
            <h1
              className={`text-xl sm:text-2xl font-bold ${currentVariant.title} cursor-pointer hover:opacity-80 transition-opacity`}
            >
              Fundelio
            </h1>
          </Link>

          {/* Dropdown menu danh mục - Desktop only */}
          <div
            className="relative hidden lg:block"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <button
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${currentVariant.navLink} hover:bg-white/10 transition-colors`}
            >
              <span className="font-medium text-sm">Khám phá</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {isDropdownOpen && (
              <>
                {/* Bridge vô hình để không bị tắt menu khi di chuột */}
                <div className="absolute top-full left-0 w-48 h-4 bg-transparent"></div>

                <div
                  className={`absolute top-full left-0 mt-4 w-48 rounded-lg shadow-lg z-50 ${currentVariant.dropdown}`}
                >
                  {categories.map((category, index) => {
                    const IconComponent = category.icon;
                    return (
                      <a
                        key={index}
                        href={category.href}
                        className={`flex items-center space-x-3 px-4 py-3 transition-colors ${
                          currentVariant.dropdownItem
                        } ${index === 0 ? 'rounded-t-lg' : ''} ${
                          index === categories.length - 1 ? 'rounded-b-lg' : ''
                        }`}
                      >
                        <IconComponent className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {category.name}
                        </span>
                      </a>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Center - Navigation (Desktop only) */}
        <nav className="hidden lg:block">
          <ul className="flex space-x-6">
            <li>
              <Link
                to="/"
                className={`${
                  currentVariant.navLink
                } transition-colors font-medium text-sm ${
                  location.pathname === '/'
                    ? 'text-primary dark:text-primary-400'
                    : ''
                }`}
              >
                Trang chủ
              </Link>
            </li>
            <li>
              <Link
                to="/campaign/create"
                className={`${
                  currentVariant.navLink
                } transition-colors font-medium text-sm ${
                  location.pathname === '/campaign/create'
                    ? 'text-primary dark:text-primary-400'
                    : ''
                }`}
              >
                Tạo chiến dịch
              </Link>
            </li>
            <li>
              <a
                href="#about"
                className={`${currentVariant.navLink} transition-colors font-medium text-sm`}
              >
                Về chúng tôi
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className={`${currentVariant.navLink} transition-colors font-medium text-sm`}
              >
                Liên hệ
              </a>
            </li>
          </ul>
        </nav>

        {/* Right - Actions */}
        <div className="flex items-center gap-2 sm:gap-3 justify-self-end">
          {/* Theme Toggle - Desktop only */}
          <button
            onClick={toggleTheme}
            className={`hidden md:block p-2 rounded-lg ${currentVariant.navLink} hover:bg-white/10 transition-all duration-200 hover:scale-105`}
            title={
              isDark ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'
            }
          >
            {isDark ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>

          {/* Language Toggle - Desktop only */}
          <button
            className={`hidden md:block p-2 rounded-lg ${currentVariant.navLink} hover:bg-white/10 transition-colors`}
            title="Chuyển đổi ngôn ngữ"
          >
            <Globe className="w-5 h-5" />
          </button>

          {/* Auth Buttons - Desktop only */}
          <Button size="md" className="hidden sm:inline-flex">
            Đăng ký
          </Button>
          <Button
            variant="outline"
            size="md"
            className="hidden sm:inline-flex border-current"
          >
            Đăng nhập
          </Button>

          {/* Mobile Menu Button */}
          <button
            className={`lg:hidden p-2 rounded-lg ${currentVariant.button}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden mt-4 py-4 border-t border-white/20 dark:border-gray-700 transition-colors duration-300">
          <nav className="space-y-2">
            <Link
              to="/"
              className={`block px-4 py-2 rounded-lg ${
                currentVariant.navLink
              } hover:bg-white/10 dark:hover:bg-gray-800 transition-colors font-medium ${
                location.pathname === '/'
                  ? 'text-primary dark:text-primary-400'
                  : ''
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Trang chủ
            </Link>
            <Link
              to="/create-campaign"
              className={`block px-4 py-2 rounded-lg ${
                currentVariant.navLink
              } hover:bg-white/10 dark:hover:bg-gray-800 transition-colors font-medium ${
                location.pathname === '/create-campaign'
                  ? 'text-primary dark:text-primary-400'
                  : ''
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Tạo chiến dịch
            </Link>
            <a
              href="#about"
              className={`block px-4 py-2 rounded-lg ${currentVariant.navLink} hover:bg-white/10 dark:hover:bg-gray-800 transition-colors font-medium`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Về chúng tôi
            </a>
            <a
              href="#contact"
              className={`block px-4 py-2 rounded-lg ${currentVariant.navLink} hover:bg-white/10 dark:hover:bg-gray-800 transition-colors font-medium`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Liên hệ
            </a>

            {/* Categories in mobile */}
            <div className="pt-2 border-t border-white/20 dark:border-gray-700 mt-2 transition-colors duration-300">
              <p
                className={`px-4 py-2 text-sm font-semibold ${currentVariant.title}`}
              >
                Khám phá
              </p>
              {categories.map((category, index) => {
                const IconComponent = category.icon;
                return (
                  <a
                    key={index}
                    href={category.href}
                    className={`flex items-center space-x-3 px-4 py-2 rounded-lg ${currentVariant.navLink} hover:bg-white/10 dark:hover:bg-gray-800 transition-colors`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="text-sm">{category.name}</span>
                  </a>
                );
              })}
            </div>

            {/* Mobile Theme Toggle */}
            <div className="px-4 py-2 border-t border-white/20 dark:border-gray-700 mt-2 transition-colors duration-300">
              <button
                onClick={toggleTheme}
                className={`flex items-center space-x-3 w-full px-4 py-2 rounded-lg ${currentVariant.navLink} hover:bg-white/10 dark:hover:bg-gray-800 transition-colors`}
              >
                {isDark ? (
                  <>
                    <Sun className="w-4 h-4" />
                    <span className="text-sm">Chế độ sáng</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4" />
                    <span className="text-sm">Chế độ tối</span>
                  </>
                )}
              </button>
            </div>

            {/* Mobile Auth Buttons */}
            <div className="flex gap-2 px-4 pt-4 sm:hidden">
              <Button size="sm" className="flex-1">
                Đăng ký
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 border-current dark:border-gray-600"
              >
                Đăng nhập
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
