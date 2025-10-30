import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Sun, Moon, X, Check, User, Settings, MessageSquare, Activity, LogOut, Plus, Bookmark, Star } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import Button from './Button';

/**
 * CreateCampaignHeader - Header for create campaign pages
 * @param {Object} props
 * @param {string} props.activeTab - Current active tab ('basic' | 'story' | 'rewards')
 * @param {Function} props.onTabChange - Callback when tab changes
 * @param {Function} props.onPreview - Callback when preview button clicked
 * @param {boolean} props.isEditing - Whether user is editing/creating a reward/component/addon
 * @param {Function} props.onCancel - Callback when cancel button clicked
 * @param {Function} props.onSave - Callback when save button clicked
 */
export const CreateCampaignHeader = ({ 
  activeTab = 'basic', 
  onTabChange,
  onPreview,
  isEditing = false,
  onCancel,
  onSave
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

  // Determine header height based on editing state
//   const headerHeight = isEditing ? 'md:h-20' : 'md:h-16';

  return (
    <header className={`fixed top-0 left-0 right-0 py-3 px-4 sm:py-4 sm:px-6 z-50 bg-white dark:bg-darker-2 border-b border-gray-200 dark:border-gray-700 transition-all duration-300 md:h-20`}>
      {/* Desktop - Single Row */}
      <div className="hidden md:block">
        <div className="mx-auto max-w-container px-4 sm:px-6 h-full flex items-center justify-between gap-4">
          {/* Left - Logo */}
          <Link to="/home" className="flex-shrink-0">
            <h1 className="text-xl sm:text-2xl font-bold text-text-primary dark:text-text-white cursor-pointer hover:opacity-80 transition-opacity">
              Fundelio
            </h1>
          </Link>

          {/* Center - Tabs */}
          <nav className="flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange?.(tab.id)}
                className={`px-2 py-3 font-semibold text-base transition-all relative ${
                  activeTab === tab.id
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
              className="p-2 rounded-lg text-text-primary dark:text-text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-105"
              title={isDark ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Conditional Buttons - Preview OR Cancel/Save */}
            {!isEditing ? (
              <Button
                variant="gradient"
                size="md"
                onClick={onPreview}
                className="flex items-center gap-2 rounded-sm"
              >
                <Eye className="w-4 h-4" />
                <span>Xem trước</span>
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="md"
                  onClick={onCancel}
                  className="flex items-center gap-2 rounded-sm"
                >
                  <X className="w-5 h-5" />
                  <span>Hủy</span>
                </Button>

                <Button
                  variant="gradient"
                  size="md"
                  onClick={onSave}
                  className="flex items-center gap-2 rounded-sm"
                >
                  <Check className="w-5 h-5" />
                  <span>Lưu</span>
                </Button>
              </>
            )}

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
                <div className="absolute right-0 top-full mt-2 w-[600px] max-w-[calc(100vw-2rem)] bg-white dark:bg-darker rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
                  <div className="flex flex-col md:flex-row">
                    {/* Left Column */}
                    <div className="flex-1 p-4 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700">
                      <h4 className="text-xs font-bold text-text-primary dark:text-text-white mb-3 uppercase">
                        Tài khoản
                      </h4>
                      <div className="space-y-1 mb-4">
                        <a
                          href="#"
                          className="flex items-center gap-3 px-3 py-2 text-sm text-text-primary dark:text-text-white hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
                        >
                          <Bookmark className="w-4 h-4" />
                          <span>Dự án đã lưu</span>
                        </a>
                        <a
                          href="#"
                          className="flex items-center gap-3 px-3 py-2 text-sm text-text-primary dark:text-text-white hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
                        >
                          <Star className="w-4 h-4" />
                          <span>Đề xuất cho bạn</span>
                        </a>
                        <a
                          href="#"
                          className="flex items-center gap-3 px-3 py-2 text-sm text-text-primary dark:text-text-white hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
                        >
                          <User className="w-4 h-4" />
                          <span>Đang theo dõi</span>
                        </a>
                      </div>

                      <div className="border-t border-gray-200 dark:border-gray-700 my-3"></div>

                      <div className="space-y-1">
                        <a
                          href="#"
                          className="flex items-center gap-3 px-3 py-2 text-sm text-text-primary dark:text-text-white hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
                        >
                          <User className="w-4 h-4" />
                          <span>Hồ sơ</span>
                        </a>
                        <a
                          href="#"
                          className="flex items-center gap-3 px-3 py-2 text-sm text-text-primary dark:text-text-white hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                          <span>Cài đặt</span>
                        </a>
                        <a
                          href="#"
                          className="flex items-center gap-3 px-3 py-2 text-sm text-text-primary dark:text-text-white hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span>Tin nhắn</span>
                        </a>
                        <a
                          href="#"
                          className="flex items-center gap-3 px-3 py-2 text-sm text-text-primary dark:text-text-white hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
                        >
                          <Activity className="w-4 h-4" />
                          <span>Hoạt động</span>
                        </a>
                      </div>

                      <div className="border-t border-gray-200 dark:border-gray-700 mt-3 pt-3">
                        <button
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors w-full"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Đăng xuất</span>
                        </button>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="flex-1 p-4">
                      <h4 className="text-xs font-bold text-text-primary dark:text-text-white mb-3 uppercase">
                        Chiến dịch đã tạo
                      </h4>
                      <div className="space-y-2">
                        <a
                          href="#"
                          className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
                        >
                          <div className="w-12 h-12 flex-shrink-0 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                            <img
                              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop"
                              alt="Project"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="text-sm text-text-primary dark:text-text-white line-clamp-2 flex-1">A Spaces project</span>
                        </a>

                        <a
                          href="#"
                          className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
                        >
                          <div className="w-12 h-12 flex-shrink-0 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                            <img
                              src="https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=100&h=100&fit=crop"
                              alt="Project"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="text-sm text-text-primary dark:text-text-white line-clamp-2 flex-1">A Product Design project</span>
                        </a>

                        <a
                          href="#"
                          className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
                        >
                          <div className="w-12 h-12 flex-shrink-0 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                            <img
                              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop"
                              alt="Project"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="text-sm text-text-primary dark:text-text-white line-clamp-2 flex-1">Tech Innovation Hub</span>
                        </a>

                        <div className="border-t border-gray-200 dark:border-gray-700 my-3"></div>

                        <Link
                          to="/campaigns/create"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        >
                          <div className="w-12 h-12 flex-shrink-0 bg-primary/10 rounded flex items-center justify-center border-2 border-dashed border-primary">
                            <Plus className="w-6 h-6" />
                          </div>
                          <span className="text-sm font-medium">Tạo chiến dịch mới</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile - Two Rows */}
      <div className="md:hidden">
        {/* Row 1 - Logo and Actions */}
        <div className="flex items-center justify-between px-4 h-14 dark:border-gray-700">
          {/* Logo */}
          <Link to="/home" className="flex-shrink-0">
            <h1 className="text-lg font-bold text-text-primary dark:text-text-white cursor-pointer hover:opacity-80 transition-opacity">
              Fundelio
            </h1>
          </Link>

          {/* Right - Actions */}
          <div className="flex items-center gap-2">
            {/* Conditional Buttons */}
            {!isEditing ? (
              <button
                onClick={onPreview}
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-text-primary dark:text-text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="Xem trước"
              >
                <Eye className="w-5 h-5" />
              </button>
            ) : (
              <>
                <button
                  onClick={onCancel}
                  className="p-2 rounded-sm border border-gray-300 dark:border-gray-600 text-text-primary dark:text-text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  title="Hủy"
                >
                  <X className="w-5 h-5" />
                </button>
                <button
                  onClick={onSave}
                  className="p-2 rounded-sm bg-primary text-white hover:bg-primary-600 transition-colors"
                  title="Lưu"
                >
                  <Check className="w-5 h-5" />
                </button>
              </>
            )}

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
        <div className="flex items-center justify-center h-12 dark:border-gray-700">
          <nav className="flex items-center gap-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange?.(tab.id)}
                className={`px-2 py-2 font-semibold text-sm whitespace-nowrap transition-all relative ${
                  activeTab === tab.id
                    ? 'text-primary'
                    : 'text-text-primary dark:text-text-white hover:text-primary'
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
