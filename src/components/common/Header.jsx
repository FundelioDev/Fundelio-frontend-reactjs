import React, { useState, useEffect } from 'react';
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

export const Header = ({ variant = 'transparent' }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'dark';
    return localStorage.getItem('theme') || 'dark';
  });

  // Theo dõi scroll để thay đổi background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Áp dụng theme vào html và phát sự kiện cho các section lắng nghe
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
    window.dispatchEvent(new Event('themechange'));
  }, [theme]);

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
        ? 'bg-background/80 backdrop-blur-md text-foreground shadow-md'
        : 'bg-transparent text-foreground',
      title: 'text-foreground',
      navLink: 'text-foreground hover:text-primary',
      dropdown: 'bg-card border border-border text-foreground',
      dropdownItem: 'hover:bg-muted text-foreground hover:text-primary',
      button: 'text-foreground',
    },
    light: {
      container: 'bg-background text-foreground shadow-md',
      title: 'text-foreground',
      navLink: 'text-foreground hover:text-primary',
      dropdown: 'bg-card border border-border text-foreground',
      dropdownItem: 'hover:bg-muted text-foreground hover:text-primary',
      button: 'text-foreground',
    },
    primary: {
      container: 'bg-primary text-foreground shadow-md',
      title: 'text-foreground',
      navLink: 'text-foreground hover:text-secondary',
      dropdown: 'bg-primary border border-secondary text-foreground',
      dropdownItem:
        'hover:bg-secondary/10 text-foreground hover:text-secondary',
      button: 'text-foreground',
    },
  };

  const currentVariant = headerVariants[variant];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 py-3 px-4 sm:py-4 sm:px-6 transition-all duration-300 ${currentVariant.container}`}
    >
      <div className='mx-auto max-w-[1400px] flex items-center justify-between lg:grid lg:grid-cols-[1fr_auto_1fr]'>
        {/* Left - Logo & Explore */}
        <div className='flex items-center gap-2 sm:gap-4'>
          <h1
            className={`text-xl sm:text-2xl font-bold ${currentVariant.title}`}
          >
            Fundelio
          </h1>

          {/* Dropdown menu danh mục - Desktop only */}
          <div
            className='relative hidden lg:block'
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <button
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${currentVariant.navLink} hover:bg-white/10 transition-colors`}
            >
              <span className='font-medium text-sm'>Khám phá</span>
              <ChevronDown className='w-4 h-4' />
            </button>

            {isDropdownOpen && (
              <>
                {/* Bridge vô hình để không bị tắt menu khi di chuột */}
                <div className='absolute top-full left-0 w-48 h-4 bg-transparent'></div>

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
                        <IconComponent className='w-4 h-4' />
                        <span className='text-sm font-medium'>
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
        <nav className='hidden lg:block'>
          <ul className='flex space-x-6'>
            <li>
              <a
                href='#'
                className={`${currentVariant.navLink} transition-colors font-medium text-sm`}
              >
                Trang chủ
              </a>
            </li>
            <li>
              <a
                href='#'
                className={`${currentVariant.navLink} transition-colors font-medium text-sm`}
              >
                Về chúng tôi
              </a>
            </li>
            <li>
              <a
                href='#'
                className={`${currentVariant.navLink} transition-colors font-medium text-sm`}
              >
                Liên hệ
              </a>
            </li>
          </ul>
        </nav>

        {/* Right - Actions */}
        <div className='flex items-center gap-2 sm:gap-3 justify-self-end'>
          {/* Theme Toggle - Desktop only */}
          <button
            className={`hidden md:block p-2 rounded-lg ${currentVariant.navLink} hover:bg-foreground/10 transition-colors`}
            title='Chuyển đổi chế độ sáng/tối'
            aria-pressed={theme === 'dark'}
            onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
          >
            {theme === 'dark' ? (
              <Sun className='w-5 h-5' />
            ) : (
              <Moon className='w-5 h-5' />
            )}
          </button>

          {/* Language Toggle - Desktop only */}
          <button
            className={`hidden md:block p-2 rounded-lg ${currentVariant.navLink} hover:bg-white/10 transition-colors`}
            title='Chuyển đổi ngôn ngữ'
          >
            <Globe className='w-5 h-5' />
          </button>

          {/* Auth Buttons - Responsive */}
          <Button size='md' className='hidden sm:inline-flex'>
            Đăng ký
          </Button>
          <Button
            variant='outline'
            size='md'
            className='hidden sm:inline-flex border-current'
          >
            Đăng nhập
          </Button>

          {/* Mobile Menu Button */}
          <button
            className={`lg:hidden p-2 rounded-lg ${currentVariant.button}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label='Toggle menu'
          >
            {isMobileMenuOpen ? (
              <X className='w-6 h-6' />
            ) : (
              <Menu className='w-6 h-6' />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className='lg:hidden mt-4 py-4 border-t border-white/20'>
          <nav className='space-y-2'>
            <a
              href='#'
              className={`block px-4 py-2 rounded-lg ${currentVariant.navLink} hover:bg-white/10 transition-colors font-medium`}
            >
              Trang chủ
            </a>
            <a
              href='#'
              className={`block px-4 py-2 rounded-lg ${currentVariant.navLink} hover:bg-white/10 transition-colors font-medium`}
            >
              Về chúng tôi
            </a>
            <a
              href='#'
              className={`block px-4 py-2 rounded-lg ${currentVariant.navLink} hover:bg-white/10 transition-colors font-medium`}
            >
              Liên hệ
            </a>

            {/* Categories in mobile */}
            <div className='pt-2 border-t border-white/20 mt-2'>
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
                    className={`flex items-center space-x-3 px-4 py-2 rounded-lg ${currentVariant.navLink} hover:bg-white/10 transition-colors`}
                  >
                    <IconComponent className='w-4 h-4' />
                    <span className='text-sm'>{category.name}</span>
                  </a>
                );
              })}
            </div>

            {/* Mobile Auth Buttons */}
            <div className='flex gap-2 px-4 pt-4 sm:hidden'>
              <Button size='sm' className='flex-1'>
                Đăng ký
              </Button>
              <Button variant='outline' size='sm' className='flex-1'>
                Đăng nhập
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
