import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Eye,
  Sun,
  Moon,
  User,
  Settings,
  LogOut,
  Plus,
  FolderOpen,
  Wallet,
  LayoutDashboard,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import Button from './Button';
import { useAuth } from '../../contexts/AuthContext';
/**
 * CreateCampaignHeader - Header for create campaign pages
 * @param {Object} props
 * @param {string} props.activeTab - Current active tab ('basic' | 'story' | 'rewards')
 * @param {Function} props.onTabChange - Callback when tab changes
 * @param {Function} props.onPreview - Callback when preview button clicked
 * @param {boolean} props.isEditMode - Whether in edit mode
 * @param {string} props.campaignId - Campaign ID if editing
 */
export const CreateCampaignHeader = ({
  activeTab = 'basic',
  onTabChange,
  onPreview,
  isEditMode = false,
  campaignId,
}) => {
  const { toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { isLoggedIn, user, logout } = useAuth();

  const avatarUrl = useMemo(() => {
    if (user?.avatarUrl) {
      return user.avatarUrl;
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

  const tabs = [
    { id: 'basic', label: 'Cơ bản' },
    { id: 'story', label: 'Câu chuyện' },
    { id: 'rewards', label: 'Phần thưởng' },
  ];

  const buildSearchUrl = (params = {}) => {
    const searchParams = new URLSearchParams();
    if (params.status) {
      searchParams.set('status', params.status);
    }
    if (params.sort) {
      searchParams.set('sort', params.sort);
    }
    if (params.category) {
      searchParams.set('category', params.category);
    }
    const query = searchParams.toString();
    return `/search${query ? `?${query}` : ''}`;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-menu-container')) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleBackToOverview = () => {
    if (isEditMode && campaignId) {
      navigate(`/campaigns/${campaignId}/dashboard`);
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-white dark:bg-background-header-dark border-b border-border dark:border-border transition-all duration-300 h-20`}>
      {/* Desktop - Single Row */}
      <div className="hidden md:block h-full">
        <div className="mx-auto max-w-container px-4 sm:px-6 h-full flex items-center justify-between gap-4">
          {/* Left - Logo + Back Button (if edit mode) */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <Link to="/home" className="flex-shrink-0">
              <img src="/logo.png" alt="Fundelio" className="w-10 h-10 md:w-12 md:h-12" />
            </Link>

            {isEditMode && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToOverview}
                className="flex items-center gap-2 text-muted-foreground hover:text-primary"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Tổng quan</span>
              </Button>
            )}
          </div>

          {/* Center - Tabs */}
          <nav className="flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange?.(tab.id)}
                className={`px-2 py-3 font-semibold text-base transition-all relative ${activeTab === tab.id
                  ? 'text-primary'
                  : 'text-text-primary dark:text-white hover:text-primary dark:hover:text-primary-400'
                  }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></span>
                )}
              </button>
            ))}
          </nav>

          {/* Right - Actions */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-text-primary dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-105"
              title={isDark ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Preview Button */}
            <Button
              variant="gradient"
              size="md"
              onClick={onPreview}
              className="flex items-center gap-2 rounded-sm"
            >
              <Eye className="w-4 h-4" />
              <span>Xem trước</span>
            </Button>

            {/* User Menu or Auth Buttons */}
            {isLoggedIn && user ? (
              <div className="relative user-menu-container">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1 rounded-full transition-all group relative"
                >
                  {/* Gradient border effect */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-[2px]">
                    <div className="w-full h-full rounded-full bg-white dark:bg-darker-2"></div>
                  </div>
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className='w-9 h-9 rounded-full ring-2 ring-gray-200 dark:ring-gray-700 object-cover relative z-10'
                  />
                  {/* <ChevronDown
                    className={`w-4 h-4 text-text-primary dark:text-white transition-transform ${isUserMenuOpen ? 'rotate-180' : ''
                      }`}
                  /> */}
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

                        {/* Admin link - only show if user has ADMIN role */}
                        {user?.rolesSecured?.some(role => role.name === 'ADMIN') && (
                          <Link
                            to="/admin"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 text-sm text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors"
                          >
                            <ShieldCheck className="w-4 h-4" />
                            <span>Quản trị hệ thống</span>
                          </Link>
                        )}

                        <div className="border-t-2 border-border my-3"></div>
                        <a
                          href="#"
                          className="flex items-center gap-3 px-3 py-2 text-sm text-text-primary dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
                        >
                          <User className="w-4 h-4" />
                          <span>Hồ sơ</span>
                        </a>
                        <a
                          href="#"
                          className="flex items-center gap-3 px-3 py-2 text-sm text-text-primary dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                          <span>Cài đặt</span>
                        </a>
                        <Link
                          to="/my-pledges"
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
                <Button
                  size="sm"
                  onClick={() => navigate('/auth', { state: { mode: 'register' } })}
                >
                  Đăng ký
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-current"
                  onClick={() => navigate('/auth', { state: { mode: 'login' } })}
                >
                  Đăng nhập
                </Button>
              </>
            )}
          </div>
        </div>
      </div>      {/* Mobile - Two Rows */}
      <div className="md:hidden h-full flex flex-col">
        {/* Row 1 - Logo and Actions */}
        <div className="flex items-center justify-between px-4 h-1/2 border-b border-gray-200 dark:border-gray-700">
          {/* Logo */}
          <Link to="/home" className="flex-shrink-0">
            <img src="/logo.png" alt="Fundelio" className="w-8 h-8" />
          </Link>

          {/* Right - Actions */}
          <div className="flex items-center gap-2">
            {/* Preview Button */}
            <button
              onClick={onPreview}
              className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-text-primary dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Xem trước"
            >
              <Eye className="w-5 h-5" />
            </button>

            {/* User Avatar */}
            {isLoggedIn && user ? (
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex-shrink-0"
              >
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className='w-9 h-9 rounded-full ring-2 ring-gray-200 dark:ring-gray-700 object-cover'
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
                    e.target.src = `https://ui-avatars.com/api/?name=${encodedName}&size=150&background=random`;
                  }}
                />
              </button>
            ) : (
              <Button
                size="sm"
                onClick={() => navigate('/auth', { state: { mode: 'login' } })}
              >
                Đăng nhập
              </Button>
            )}
          </div>
        </div>

        {/* Row 2 - Tabs */}
        <div className="flex items-center justify-center h-1/2">
          <nav className="flex items-center gap-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange?.(tab.id)}
                className={`px-2 py-2 font-semibold text-sm whitespace-nowrap transition-all relative ${activeTab === tab.id
                  ? 'text-primary'
                  : 'text-text-primary dark:text-white hover:text-primary'
                  }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default CreateCampaignHeader;
