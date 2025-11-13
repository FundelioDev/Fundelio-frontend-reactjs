import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  Search,
  User,
  Settings,
  Wallet,
  Activity,
  LogOut,
  Plus,
  Bookmark,
  Star,
  FolderOpen,
  LayoutDashboard,
} from 'lucide-react';
import Button from './Button';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useCategories } from '../../hooks/useCategories';

export const Header = ({ variant = 'transparent', isFixed = true, landing = false }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showCoinModal, setShowCoinModal] = useState(false);
  const { toggleTheme, isDark } = useTheme();
  const { isLoggedIn, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Sử dụng custom hook để lấy categories
  const { categories, loading: loadingCategories } = useCategories();

  // Mock search results
  const [searchResults, setSearchResults] = useState({
    categories: [],
    creators: [],
    campaigns: [],
  });

  // Theo dõi scroll để thay đổi background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Tạo avatar URL từ tên nếu không có avatar
  const avatarUrl = useMemo(() => {
    if (user?.avatar) {
      return user.avatar;
    }

    // Lấy tên từ user để tạo avatar
    const firstName = user?.firstName || user?.first_name || '';
    const lastName = user?.lastName || user?.last_name || '';
    const fullName =
      `${firstName} ${lastName}`.trim() || user?.email || user?.name || 'User';

    // Encode tên để dùng trong URL
    const encodedName = encodeURIComponent(fullName);
    return `https://ui-avatars.com/api/?name=${encodedName}&size=150&background=random`;
  }, [user]);

  // Lấy tên hiển thị
  const displayName = useMemo(() => {
    if (user?.firstName || user?.first_name) {
      const firstName = user?.firstName || user?.first_name || '';
      const lastName = user?.lastName || user?.last_name || '';
      return (
        `${firstName} ${lastName}`.trim() || user?.email || user?.name || 'User'
      );
    }
    return user?.email || user?.name || 'User';
  }, [user]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-menu-container')) {
        setIsUserMenuOpen(false);
      }
      if (!event.target.closest('.search-container')) {
        setIsSearchFocused(false);
      }
      if (!event.target.closest('.coin-modal') && !event.target.closest('.coin-button')) {
        setShowCoinModal(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle search
  useEffect(() => {
    if (searchQuery.length >= 3) {
      // Mock search - replace with actual API call
      setSearchResults({
        categories: [
          { id: 1, name: 'Công nghệ', icon: Monitor },
          { id: 2, name: 'Âm nhạc', icon: Music },
        ],
        creators: [
          { id: 1, name: 'Nguyễn Văn A', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Creator1' },
          { id: 2, name: 'Trần Thị B', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Creator2' },
        ],
        campaigns: [
          { id: 1, name: 'Dự án A', category: 'Công nghệ', raised: 50000 },
          { id: 2, name: 'Dự án B', category: 'Âm nhạc', raised: 30000 },
        ],
      });
    } else {
      setSearchResults({ categories: [], creators: [], campaigns: [] });
    }
  }, [searchQuery]);

  // Định nghĩa các variant cho header
  const headerVariants = {
    transparent: {
      container: isScrolled
        ? 'bg-white/95 dark:bg-background-header-dark backdrop-blur-md text-text-primary dark:text-white shadow-md transition-colors duration-300'
        : 'bg-transparent text-text-white',
      title: isScrolled
        ? 'text-text-primary dark:text-white transition-colors duration-300'
        : 'text-text-white',
      navLink: isScrolled
        ? 'text-text-primary dark:text-white hover:text-primary dark:hover:text-primary-400 transition-colors duration-300'
        : 'text-text-white hover:text-secondary',
      dropdown:
        'bg-white dark:bg-darker border border-gray-200 dark:border-gray-700 text-text-primary dark:text-white transition-colors duration-300',
      dropdownItem:
        'hover:bg-gray-50 dark:hover:bg-gray-900 text-text-primary dark:text-white hover:text-primary dark:hover:text-primary-400 transition-colors duration-300',
      button: isScrolled
        ? 'text-text-primary dark:text-white transition-colors duration-300'
        : 'text-text-white',
    },
    light: {
      container:
        'bg-white dark:bg-background-header-dark text-text-primary dark:text-white shadow-md transition-colors duration-300',
      title:
        'text-text-primary dark:text-white transition-colors duration-300',
      navLink:
        'text-text-primary dark:text-white hover:text-primary dark:hover:text-primary-400 transition-colors duration-300',
      dropdown:
        'bg-white dark:bg-darker border border-gray-200 dark:border-gray-700 text-text-primary dark:text-white transition-colors duration-300',
      dropdownItem:
        'hover:bg-gray-50 dark:hover:bg-gray-700 text-text-primary dark:text-white hover:text-primary dark:hover:text-primary-400 transition-colors duration-300',
      button:
        'text-text-primary dark:text-white transition-colors duration-300',
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

  const handleCoinClick = () => {
    if (!user?.coins || user.coins === 0) {
      setShowCoinModal(true);
    }
  };

  const handleTopUpConfirm = () => {
    setShowCoinModal(false);
    navigate('/wallet');
  };

  const formatNumber = (num) => {
    if (num === null || num === undefined) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <header
      className={`${isFixed ? 'fixed' : 'relative'} top-0 left-0 right-0 z-50 py-3 px-4 sm:py-4 sm:px-6 transition-all duration-300 ${currentVariant.container}`}
    >
      <div className="mx-auto max-w-container flex items-center justify-between gap-4">
        {/* Left - Logo & Explore */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Link to="/home">
            <img src="/logo.png" alt="Fundelio" className="w-10 h-10 md:w-12 md:h-12" />
          </Link>

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
                  {loadingCategories ? (
                    <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                      Đang tải...
                    </div>
                  ) : categories.length > 0 ? (
                    categories.map((category, index) => {
                      const IconComponent = category.icon;
                      return (
                        <Link
                          key={category.id}
                          to={category.href}
                          className={`flex items-center space-x-3 px-4 py-3 transition-colors ${currentVariant.dropdownItem
                            } ${index === 0 ? 'rounded-t-lg' : ''} ${index === categories.length - 1 ? 'rounded-b-lg' : ''
                            }`}
                        >
                          <IconComponent className={`w-4 h-4 ${category.color}`} />
                          <span className='text-sm font-medium'>
                            {category.name}
                          </span>
                        </Link>
                      );
                    })
                  ) : (
                    <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                      Không có danh mục
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Center - Search Bar (Desktop) */}
        {!landing && (
          <div className="hidden md:block flex-1 max-w-xl search-container">
            <div className="relative">
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${currentVariant.navLink}`} />
                <input
                  type="text"
                  placeholder="Tìm kiếm danh mục, nhà sáng tạo, chiến dịch..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${isScrolled || variant !== 'transparent'
                    ? 'bg-white dark:bg-darker border-gray-300 dark:border-gray-600 text-text-primary dark:text-white'
                    : 'bg-white/20 border-white/30 text-white placeholder-white/70'
                    } focus:outline-none focus:ring-2 focus:ring-primary transition-colors`}
                />
              </div>

              {/* Search Results Dropdown */}
              {isSearchFocused && searchQuery.length >= 3 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-darker rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto z-50">
                  {/* Categories */}
                  {searchResults.categories.length > 0 && (
                    <div className="p-2">
                      <p className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-text-white uppercase">
                        Danh mục
                      </p>
                      {searchResults.categories.map((category) => {
                        const IconComponent = category.icon;
                        return (
                          <a
                            key={category.id}
                            href="#"
                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                          >
                            <IconComponent className="w-5 h-5 text-primary" />
                            <span className="text-sm text-text-primary dark:text-white">{category.name}</span>
                          </a>
                        );
                      })}
                    </div>
                  )}

                  {/* Creators */}
                  {searchResults.creators.length > 0 && (
                    <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                      <p className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-text-white uppercase">
                        Nhà sáng tạo
                      </p>
                      {searchResults.creators.map((creator) => (
                        <a
                          key={creator.id}
                          href="#"
                          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                        >
                          <img
                            src={creator.avatar}
                            alt={creator.name}
                            className="w-8 h-8 rounded-full"
                          />
                          <span className="text-sm text-text-primary dark:text-white">{creator.name}</span>
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Campaigns */}
                  {searchResults.campaigns.length > 0 && (
                    <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                      <p className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-text-white uppercase">
                        Chiến dịch
                      </p>
                      {searchResults.campaigns.map((campaign) => (
                        <a
                          key={campaign.id}
                          href="#"
                          className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                        >
                          <div>
                            <p className="text-sm font-medium text-text-primary dark:text-white">{campaign.name}</p>
                            <p className="text-xs text-gray-500 dark:text-text-white">{campaign.category}</p>
                          </div>
                          <span className="text-xs font-semibold text-primary">
                            {campaign.raised.toLocaleString()} <img src="/packages/coin.svg" alt="Coin" className="inline-block w-4 h-4 mb-0.5" />
                          </span>
                        </a>
                      ))}
                    </div>
                  )}

                  {/* No results */}
                  {searchResults.categories.length === 0 &&
                    searchResults.creators.length === 0 &&
                    searchResults.campaigns.length === 0 && (
                      <div className="p-8 text-center text-gray-500 dark:text-text-white">
                        <p>Không tìm thấy kết quả</p>
                      </div>
                    )}
                </div>
              )}

              {searchQuery.length > 0 && searchQuery.length < 3 && isSearchFocused && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-darker rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 z-50">
                  <p className="text-sm text-gray-500 dark:text-text-white text-center">
                    Nhập ít nhất 3 ký tự để tìm kiếm
                  </p>
                </div>
              )}
            </div>
          </div>)}

        {/* Right - Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Coin Display - Desktop only */}
          {isLoggedIn && user && (
            <button
              onClick={handleCoinClick}
              className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg ${(user.coins === 0 || user.coins === undefined)
                ? 'hover:bg-red-100 dark:hover:bg-red-900/30'
                : 'bg-primary/10 dark:bg-primary/20 hover:bg-primary/20 dark:hover:bg-primary/30'
                } transition-all duration-200 hover:scale-105 coin-button relative`}
              title={(user.coins === 0 || user.coins === undefined) ? 'Nạp coin' : 'Số coin hiện có'}
            >

              <span className={`text-md font-bold ${(user.coins === 0 || user.coins === undefined)
                ? 'text-red-400 dark:text-red-400'
                : 'text-primary dark:text-primary-400'
                }`}>
                {formatNumber(user.coins)} VND


              </span>
            </button>
          )}

          {/* Coin Modal */}
          {showCoinModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] coin-modal">
              <div className="bg-white dark:bg-darker rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
                <div className="text-center mb-6">
                  {/* <img src="/packages/coin.svg" alt="Coin" className="w-16 h-16 mx-auto mb-4" /> */}
                  <h3 className="text-xl font-bold text-text-primary dark:text-white mb-2">
                    Bạn chưa có số dư trong ví
                  </h3>
                  <p className="text-muted-foreground dark:text-text-white">
                    Bạn có muốn nạp vào ví để tham gia các chiến dịch không?
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowCoinModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-text-primary dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
                  >
                    Để sau
                  </button>
                  <button
                    onClick={handleTopUpConfirm}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
                  >
                    Nạp ngay
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Theme Toggle - Desktop only */}
          <button
            onClick={toggleTheme}
            className={`hidden md:block p-2 rounded-lg ${currentVariant.navLink} hover:bg-white/10 transition-all duration-200 hover:scale-105`}
            title={
              isDark ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'
            }
          >
            {isDark ? (
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

          {/* User Menu or Auth Buttons */}
          {isLoggedIn && user ? (
            <div className="relative user-menu-container">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1 rounded-full transition-all group hover:cursor-pointer relative"
              >
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className='w-9 h-9 rounded-full ring-2 ring-gray-200 dark:ring-gray-700'
                  onError={(e) => {
                    // Fallback nếu avatar lỗi
                    const firstName = user?.firstName || user?.first_name || '';
                    const lastName = user?.lastName || user?.last_name || '';
                    const fullName =
                      `${firstName} ${lastName}`.trim() ||
                      user?.email ||
                      user?.name ||
                      'User';
                    const encodedName = encodeURIComponent(fullName);
                    console.log('Fallback avatar for:', encodedName);
                    e.target.src = `https://ui-avatars.com/api/?name=${encodedName}&size=150&background=random`;
                  }}
                />
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-[280px] max-w-[calc(100vw-2rem)] bg-white dark:bg-darker rounded-lg shadow-xl border border-border overflow-hidden z-50">
                  <div className="p-4">
                    {/* Your Account Section */}
                    <h4 className="text-xs font-bold text-text-primary dark:text-white mb-3 uppercase">
                      Tài khoản
                    </h4>
                    <div className="space-y-1 mb-3">
                      <Link
                        to="/dashboard"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 text-sm text-text-primary dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Bảng điều khiển</span>
                      </Link>

                       {/* thêm link để connect đến page profile */}
                      <Link
                        to="/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 text-sm text-text-primary dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
                      >
                        <User className="w-4 h-4" />
                        <span>Hồ sơ</span>
                      </Link>

                      <a
                        href="#"
                        className="flex items-center gap-3 px-3 py-2 text-sm text-text-primary dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Cài đặt</span>
                      </a>
                      <Link
                        to="/your-projects"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 text-sm text-text-primary dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
                      >
                        <FolderOpen className="w-4 h-4" />
                        <span>Dự án của bạn</span>
                      </Link>
                      <Link
                        to="/wallet"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 text-sm text-text-primary dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
                      >
                        <Wallet className="w-4 h-4" />
                        <span>Ví</span>
                      </Link>
                    </div>

                    {/* Divider */}
                    <div className="border-t-2 border-border my-3"></div>

                    {/* Create New Campaign Button */}
                    <Link
                      to="/campaigns/create"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    >
                      <div className="w-10 h-10 flex-shrink-0 bg-primary/10 rounded flex items-center justify-center border-2 border-dashed border-primary">
                        <Plus className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-medium">Tạo chiến dịch mới</span>
                    </Link>

                    {/* Logout */}
                    <div className="border-t-2 border-border mt-3 pt-3">
                      <button
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                          navigate('/auth', { state: { mode: 'login' } });
                        }}
                        className="flex items-center gap-3 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors w-full"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Button size="md" className="hidden sm:inline-flex"
                onClick={() => {
                  navigate('/auth', { state: { mode: 'register' } });
                  setIsMobileMenuOpen(false);
                }}>
                Đăng ký
              </Button>
              <Button
                variant="outline"
                size="md"
                className="hidden sm:inline-flex border-current"
                onClick={() => {
                  navigate('/auth', { state: { mode: 'login' } });
                  setIsMobileMenuOpen(false);
                }}
              >
                Đăng nhập
              </Button>
            </>
          )}

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
        <div className='lg:hidden mt-4 py-4 border-t border-white/20 dark:border-gray-700 transition-colors duration-300'>
          <nav className='space-y-2'>
            <Link
              to="/dashboard"
              onClick={() => setIsUserMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 text-sm text-text-primary dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Bảng điều khiển</span>
            </Link>
            <div className="border-t-2 border-border my-3"></div>
            <Link
              to='/home'
              className={`block px-4 py-2 rounded-lg ${currentVariant.navLink
                } hover:bg-white/10 dark:hover:bg-darker-2-light/40 transition-colors font-medium ${location.pathname === '/home'
                  ? 'text-primary dark:text-primary-400'
                  : ''
                }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Trang chủ
            </Link>
            <Link
              to='/campaigns/create'
              className={`block px-4 py-2 rounded-lg ${currentVariant.navLink
                } hover:bg-white/10 dark:hover:bg-darker-2-light/40 transition-colors font-medium ${location.pathname === '/campaigns/create'
                  ? 'text-primary dark:text-primary-400'
                  : ''
                }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Tạo chiến dịch
            </Link>
            <a
              href="#about"
              className={`block px-4 py-2 rounded-lg ${currentVariant.navLink} hover:bg-white/10 dark:hover:bg-darker-2 transition-colors font-medium`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Về chúng tôi
            </a>
            <a
              href="#contact"
              className={`block px-4 py-2 rounded-lg ${currentVariant.navLink} hover:bg-white/10 dark:hover:bg-darker-2 transition-colors font-medium`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Liên hệ
            </a>

            {/* Categories in mobile */}
            <div className='pt-2 border-t border-white/20 dark:border-gray-700 mt-2 transition-colors duration-300'>
              <p
                className={`px-4 py-2 text-sm font-semibold ${currentVariant.title}`}
              >
                Khám phá
              </p>
              {loadingCategories ? (
                <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                  Đang tải danh mục...
                </div>
              ) : categories.length > 0 ? (
                categories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <Link
                      key={category.id}
                      to={category.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-2 rounded-lg ${currentVariant.navLink} hover:bg-white/10 dark:hover:bg-darker-2-light/40 transition-colors`}
                    >
                      <IconComponent className={`w-4 h-4 ${category.color}`} />
                      <span className='text-sm'>{category.name}</span>
                    </Link>
                  );
                })
              ) : (
                <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                  Không có danh mục
                </div>
              )}
            </div>

            {/* Mobile Theme Toggle */}
            <div className='px-4 py-2 border-t border-white/20 dark:border-gray-700 mt-2 transition-colors duration-300'>
              <button
                onClick={toggleTheme}
                className={`flex items-center space-x-3 w-full px-4 py-2 rounded-lg ${currentVariant.navLink} hover:bg-white/10 dark:hover:bg-darker-2-light/40 transition-colors`}
              >
                {isDark ? (
                  <>
                    <Sun className='w-4 h-4' />
                    <span className='text-sm'>Chế độ sáng</span>
                  </>
                ) : (
                  <>
                    <Moon className='w-4 h-4' />
                    <span className='text-sm'>Chế độ tối</span>
                  </>
                )}
              </button>
            </div>

            {/* Mobile Auth Buttons */}
            <div className='flex gap-2 px-4 pt-4 sm:hidden'>
              <Button
                size='sm'
                className='flex-1'
                onClick={() => {
                  navigate('/auth', { state: { mode: 'register' } });
                  setIsMobileMenuOpen(false);
                }}
              >
                Đăng ký
              </Button>
              <Button
                variant='outline'
                size='sm'
                className='flex-1 border-current dark:border-gray-600'
                onClick={() => {
                  navigate('/auth', { state: { mode: 'login' } });
                  setIsMobileMenuOpen(false);
                }}
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
