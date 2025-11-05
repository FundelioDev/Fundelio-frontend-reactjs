import { useState } from 'react';
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const { toggleTheme, isDark } = useTheme();

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className='flex h-screen bg-gray-50 dark:bg-darker'>
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-white dark:bg-darker-2 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className='h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800'>
          {sidebarOpen && (
            <Link to='/admin' className='flex items-center space-x-2'>
               <img src="/logo.png" alt="Fundelio" className="w-10 h-10 md:w-12 md:h-12" />
            </Link>
          )}
          <Button
            variant='ghost'
            size='icon'
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className='ml-auto'
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} className='text-gray-700 dark:text-gray-300' />}
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
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                  active
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
              // Handle logout
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
            <Button
              variant='ghost'
              size='icon'
              className='text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            >
              <Bell size={20} />
            </Button>
            <Button
              variant='ghost'
              size='icon'
              className='text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            >
              <Settings size={20} />
            </Button>
            <div className='flex items-center space-x-3'>
              <img
                src='https://i.pravatar.cc/150?img=1'
                alt='Admin'
                className='w-9 h-9 rounded-full ring-2 ring-gray-200 dark:ring-gray-700'
              />
              <div className='hidden md:block'>
                <p className='text-sm font-medium text-gray-800 dark:text-gray-100'>
                  Admin User
                </p>
                <p className='text-xs text-gray-500 dark:text-text-white'>
                  admin@fundelio.com
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
