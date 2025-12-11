import { useState, useMemo } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Shield,
  Key,
  Megaphone,
  Menu,
  X,
  LogOut,
  Settings,
  Bell,
  Sun,
  Moon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';

const sidebarItems = [
  {
    icon: LayoutDashboard,
    label: 'Tổng quan',
    path: '/admin',
  },
  {
    icon: Users,
    label: 'Người dùng',
    path: '/admin/users',
  },
  {
    icon: Shield,
    label: 'Vai trò',
    path: '/admin/roles',
  },
  {
    icon: Key,
    label: 'Quyền hạn',
    path: '/admin/permissions',
  },
  {
    icon: Megaphone,
    label: 'Chiến dịch',
    path: '/admin/campaigns',
  },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { toggleTheme, isDark } = useTheme();
  const { user, logout } = useAuth();

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  // Tạo avatar URL từ tên nếu không có avatar
  const defaultAvatar = useMemo(() => {
    const firstName = user?.firstName || user?.first_name || '';
    const lastName = user?.lastName || user?.last_name || '';
    const fullName =
      `${firstName} ${lastName}`.trim() || user?.email || user?.name || 'User';
    const encodedName = encodeURIComponent(fullName);
    return `https://ui-avatars.com/api/?name=${encodedName}&size=150&background=random`;
  }, [user]);

  const avatarUrl = useMemo(() => {
    if (user?.avatarUrl) return user.avatarUrl;
    if (user?.avatar) return user.avatar;
    return defaultAvatar;
  }, [defaultAvatar, user]);

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

  // Lấy email
  const userEmail = user?.email || '';

  return (
    <div className='flex min-h-screen min-w-full overflow-hidden bg-gray-50 dark:bg-darker'>
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? 'w-64' : 'w-20'
          } bg-white dark:bg-darker-2 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className='h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800'>
          {sidebarOpen && (
            <Link to='/' className='flex items-center space-x-2'>
              <img
                src='https://i.postimg.cc/HLJPXtZ4/logo-(3)-(1)-(1).png'
                alt='Fundelio'
                className='w-10 h-10 md:w-12 md:h-12'
                width='48'
                height='48'
              />
            </Link>
          )}
          <Button
            variant='ghost'
            size='icon'
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className='ml-auto'
          >
            {sidebarOpen ? (
              <X size={20} className='text-gray-700 dark:text-gray-300' />
            ) : (
              <Menu size={20} className='text-gray-700 dark:text-gray-300' />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className='flex-1 px-3 py-4 space-y-1 overflow-y-auto'>
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${active
                  ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
              >
                <Icon size={20} className='flex-shrink-0' />
                {sidebarOpen && (
                  <span className='font-medium text-sm'>{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className='p-3 border-t border-gray-200 dark:border-gray-800'>
          <Button
            variant='ghost'
            className='w-full justify-start text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            onClick={() => {
              logout();
              window.location.href = '/';
            }}
          >
            <LogOut size={20} />
            {sidebarOpen && <span className='ml-3'>Đăng xuất</span>}
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className='flex-1 flex flex-col overflow-hidden'>
        {/* Header */}
        <header className='h-16 bg-white dark:bg-darker-2 border-b border-gray-100 dark:border-darker-2 dark:shadow-sm dark:shadow-gray-800/50 flex items-center justify-between px-6'>
          <div>
            <h1 className='text-2xl font-bold text-gray-800 dark:text-gray-100'>
              {sidebarItems.find((item) => isActive(item.path))?.label ||
                'Admin Dashboard'}
            </h1>
          </div>
          <div className='flex items-center space-x-4'>
            <Button
              variant='ghost'
              size='icon'
              onClick={toggleTheme}
              className='text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              title={isDark ? 'Chế độ sáng' : 'Chế độ tối'}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </Button>
            <div className='flex items-center space-x-3'>
              <img
                src={avatarUrl}
                alt={displayName}
                className='w-9 h-9 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700'
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = defaultAvatar;
                }}
              />
              <div className='hidden md:block'>
                <p className='text-sm font-medium text-gray-800 dark:text-gray-100'>
                  {displayName}
                </p>
                <p className='text-xs text-gray-500 dark:text-gray-400'>
                  {userEmail || 'Chưa có email'}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className='flex-1 overflow-y-auto p-6'>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
