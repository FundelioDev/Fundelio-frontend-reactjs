import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  Sun,
  Moon,
  Menu,
  Search,
  Wallet,
  LogOut,
  User,           
  LayoutDashboard,
  FolderOpen,     
  Plus,           
  Settings        
} from 'lucide-react';
import Button from './Button';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useCategories } from '../../hooks/useCategories';
import { walletApi } from '@/api/walletApi';

export const Header = ({ variant = 'transparent', isFixed = true, landing = false }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [headerBalance, setHeaderBalance] = useState(0);
  
  const { toggleTheme, isDark } = useTheme();
  const { isLoggedIn, user, logout } = useAuth();
  const location = useLocation(); 
  const navigate = useNavigate();

  const { categories, loading: loadingCategories } = useCategories();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isLoggedIn && user) {
      const fetchBalance = async () => {
        try {
          const res = await walletApi.getWalletInfo();
          if (res?.data?.success) {
            const rawBalance = res.data.data.balance;
            const cleanBalance = Number(String(rawBalance).replace(/\./g, ''));
            setHeaderBalance(cleanBalance);
          }
        } catch (error) {
          console.error("Header: Lỗi tải số dư", error);
        }
      };
      fetchBalance();
    } else {
        setHeaderBalance(0);
    }
  }, [isLoggedIn, user, location.pathname]); 

  const formatPrice = (value) => {
    return new Intl.NumberFormat('vi-VN').format(value || 0);
  };

  const avatarUrl = useMemo(() => {
    if (user?.avatar) return user.avatar;
    const fullName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || user?.email || 'User';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&size=150&background=random`;
  }, [user]);

  const displayName = useMemo(() => {
    const fullName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim();
    return fullName || user?.email || 'User';
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
        if (!event.target.closest('.user-menu-container')) setIsUserMenuOpen(false);
        if (!event.target.closest('.search-container')) setIsSearchFocused(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const headerVariants = {
    transparent: {
        container: isScrolled ? 'bg-white/95 dark:bg-background-header-dark backdrop-blur-md text-text-primary dark:text-white shadow-md transition-colors duration-300' : 'bg-transparent text-text-white',
        title: isScrolled ? 'text-text-primary dark:text-white' : 'text-text-white',
        navLink: isScrolled ? 'text-text-primary dark:text-white hover:text-primary dark:hover:text-primary-400' : 'text-text-white hover:text-secondary',
        dropdown: 'bg-white dark:bg-darker border border-gray-200 dark:border-gray-700 text-text-primary dark:text-white',
        dropdownItem: 'hover:bg-gray-50 dark:hover:bg-gray-900 text-text-primary dark:text-white hover:text-primary dark:hover:text-primary-400',
        button: isScrolled ? 'text-text-primary dark:text-white' : 'text-text-white',
    },
    light: { container: 'bg-white dark:bg-background-header-dark text-text-primary dark:text-white shadow-md', title: 'text-text-primary dark:text-white', navLink: 'text-text-primary dark:text-white hover:text-primary', dropdown: 'bg-white dark:bg-darker border border-gray-200 dark:border-gray-700', dropdownItem: 'hover:bg-gray-50 dark:hover:bg-gray-700', button: 'text-text-primary dark:text-white' },
    primary: { container: 'bg-primary dark:bg-primary-700 text-text-white shadow-md', title: 'text-text-white', navLink: 'text-text-white hover:text-secondary', dropdown: 'bg-primary dark:bg-primary-700 border border-secondary', dropdownItem: 'hover:bg-secondary/10 text-text-white', button: 'text-text-white' },
  };
  const currentVariant = headerVariants[variant] || headerVariants.light;

  const handleCoinClick = () => navigate('/wallet');

  return (
    <header className={`${isFixed ? 'fixed' : 'relative'} top-0 left-0 right-0 z-50 py-3 px-4 sm:py-4 sm:px-6 transition-all duration-300 ${currentVariant.container}`}>
      <div className="mx-auto max-w-container flex items-center justify-between gap-4">
        {/* Left */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Link to="/home"><img src="/logo.png" alt="Fundelio" className="w-10 h-10 md:w-12 md:h-12" /></Link>
          <div className='relative hidden lg:block' onMouseEnter={() => setIsDropdownOpen(true)} onMouseLeave={() => setIsDropdownOpen(false)}>
            <button className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${currentVariant.navLink} hover:bg-white/10 transition-colors`}>
              <span className='font-medium text-sm'>Khám phá</span>
              <ChevronDown className='w-4 h-4' />
            </button>
            {isDropdownOpen && (
               <div className={`absolute top-full left-0 mt-4 w-48 rounded-lg shadow-lg z-50 ${currentVariant.dropdown}`}>
                 {loadingCategories ? <div className="px-4 py-3 text-sm">Đang tải...</div> : categories.map((cat, i) => {
                    const Icon = cat.icon; return <Link key={cat.id} to={cat.href} className={`flex items-center space-x-3 px-4 py-3 ${currentVariant.dropdownItem}`}><Icon className={`w-4 h-4 ${cat.color}`} /><span className='text-sm font-medium'>{cat.name}</span></Link>
                 })}
               </div>
            )}
          </div>
        </div>

        {!landing && <div className="hidden md:block flex-1 max-w-xl search-container"><div className="relative"><Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${currentVariant.navLink}`} /><input type="text" placeholder="Tìm kiếm..." className={`w-full pl-10 pr-4 py-2 rounded-lg border bg-transparent ${isScrolled ? 'border-gray-300' : 'border-white/30 text-white'}`} /></div></div>}

        <div className="flex items-center gap-2 sm:gap-3">
          
          {isLoggedIn && user && (
            <button onClick={handleCoinClick} className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg ${Number(headerBalance) === 0 ? 'hover:bg-red-100 dark:hover:bg-red-900/30' : 'bg-primary/10 hover:bg-primary/20'} transition-all duration-200 hover:scale-105 coin-button relative`}>
              <span className={`text-md font-bold ${Number(headerBalance) === 0 ? 'text-red-500 dark:text-red-400' : 'text-primary dark:text-primary-400'}`}>
                {formatPrice(headerBalance)} VND
              </span>
            </button>
          )}

          <button onClick={toggleTheme} className={`hidden md:block p-2 rounded-lg ${currentVariant.navLink}`}>{isDark ? <Sun className='w-5 h-5'/> : <Moon className='w-5 h-5'/>}</button>

          {isLoggedIn && user ? (
            <div className="relative user-menu-container">
              <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}><img src={avatarUrl} className='w-9 h-9 rounded-full' alt="User"/></button>
              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-[280px] bg-white dark:bg-darker rounded-lg shadow-xl border border-border z-50 p-2">
                    
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 mb-2">
                        <p className="text-sm font-semibold text-text-primary dark:text-white truncate">{displayName}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                    </div>

                    <div className="space-y-1">
                        <Link to="/profile" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-text-primary dark:text-white">
                            <User className="w-4 h-4 text-gray-500"/><span>Hồ sơ cá nhân</span>
                        </Link>
                        
                        <Link to="/dashboard" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-text-primary dark:text-white">
                            <LayoutDashboard className="w-4 h-4 text-gray-500"/><span>Bảng điều khiển</span>
                        </Link>

                        <Link to="/your-projects" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-text-primary dark:text-white">
                            <FolderOpen className="w-4 h-4 text-gray-500"/><span>Dự án của tôi</span>
                        </Link>

                        <Link to="/campaigns/create" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-primary font-medium">
                            <Plus className="w-4 h-4"/><span>Tạo chiến dịch</span>
                        </Link>
                        
                        <div className="h-px bg-gray-100 dark:bg-gray-700 my-1"></div>

                        <Link to="/wallet" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-text-primary dark:text-white">
                            <Wallet className="w-4 h-4 text-gray-500"/>
                            <div className="flex justify-between w-full items-center">
                                <span>Ví của tôi</span>
                                <span className="text-xs font-bold text-primary">{formatPrice(headerBalance)} đ</span>
                            </div>
                        </Link>
                        
                        <button onClick={() => { logout(); navigate('/auth'); }} className="flex items-center gap-3 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg w-full text-left transition-colors">
                            <LogOut className="w-4 h-4"/><span>Đăng xuất</span>
                        </button>
                    </div>
                </div>
              )}
            </div>
          ) : (
            <Button size="md" onClick={() => navigate('/auth')}>Đăng nhập</Button>
          )}
          
          <button className={`lg:hidden p-2 rounded-lg ${currentVariant.button}`} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}><Menu className='w-6 h-6'/></button>
        </div>
      </div>
    </header>
  );
};
export default Header;