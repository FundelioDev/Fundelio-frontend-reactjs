import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  LayoutDashboard
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import Button from './Button';

/**
 * CreateCampaignHeader - Header for create campaign pages
 * @param {Object} props
 * @param {string} props.activeTab - Current active tab ('basic' | 'story' | 'rewards')
 * @param {Function} props.onTabChange - Callback when tab changes
 * @param {Function} props.onPreview - Callback when preview button clicked
 */
export const CreateCampaignHeader = ({
  activeTab = 'basic',
  onTabChange,
  onPreview
}) => {
  const { toggleTheme, isDark } = useTheme();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Mock user state
  const user = {
    name: 'Nguyen Van A',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  };

  const tabs = [
    { id: 'basic', label: 'Cơ bản' },
    { id: 'story', label: 'Câu chuyện' },
    { id: 'rewards', label: 'Phần thưởng' },
  ];

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

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-white dark:bg-darker-2 border-b border-gray-200 dark:border-gray-700 transition-all duration-300 h-20`}>
      {/* Desktop - Single Row */}
      <div className="hidden md:block h-full">
        <div className="mx-auto max-w-container px-4 sm:px-6 h-full flex items-center justify-between gap-4">
          {/* Left - Logo */}
          <Link to="/home" className="flex-shrink-0">
            <img src="/logo.png" alt="Fundelio" className="w-16 h-16" />
          </Link>

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

            {/* User Avatar with Dropdown */}
            <div className="relative user-menu-container">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex-shrink-0"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-gray-200 dark:border-gray-700 hover:ring-2 hover:ring-primary transition-all cursor-pointer"
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
                          // Handle logout
                          setIsUserMenuOpen(false);
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
          </div>
        </div>
      </div>

      {/* Mobile - Two Rows */}
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
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex-shrink-0"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full border-2 border-gray-200 dark:border-gray-700 hover:ring-2 hover:ring-primary transition-all cursor-pointer"
              />
            </button>
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
