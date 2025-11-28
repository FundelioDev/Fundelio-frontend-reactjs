import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  Settings,
  ShieldCheck,
  X
} from "lucide-react";
import Button from "./Button";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { useCategories } from "../../hooks/useCategories";
import { walletApi } from "@/api/walletApi";
import { campaignApi } from "@/api/campaignApi";
import { XCircle } from "lucide-react";
export const Header = ({
  variant = "transparent",
  isFixed = true,
  landing = false,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [headerBalance, setHeaderBalance] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchTotal, setSearchTotal] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef(null);

  const { toggleTheme, isDark } = useTheme();
  const { isLoggedIn, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const { categories, loading: loadingCategories } = useCategories();

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

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isLoggedIn && user) {
      const fetchBalance = async () => {
        try {
          const res = await walletApi.getWalletInfo();
          if (res?.data?.success) {
            const rawBalance = res.data.data.balance;
            const cleanBalance = Number(String(rawBalance).replace(/\./g, ""));
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
    return new Intl.NumberFormat("vi-VN").format(value || 0);
  };

  const avatarUrl = useMemo(() => {
    if (user?.avatarUrl) return user.avatarUrl;
    const fullName =
      `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
      user?.email ||
      "User";
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      fullName
    )}&size=150&background=random`;
  }, [user]);

  const displayName = useMemo(() => {
    const fullName = `${user?.firstName || ""} ${user?.lastName || ""}`.trim();
    return fullName || user?.email || "User";
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".user-menu-container"))
        setIsUserMenuOpen(false);
      if (!event.target.closest(".search-container")) {
        setIsSearchFocused(false);
        setSearchResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const filter = `title ~~ '*${searchQuery.trim()}*' and (campaignStatus:'ACTIVE' or campaignStatus:'SUCCESSFUL')`;
        const response = await campaignApi.getAllCampaigns({
          filter,
          page: 0,
          size: 5,
        });
        const campaigns = response.data?.data?.content || [];
        const total = response.data?.data?.meta?.totalElements || 0;
        setSearchResults(campaigns);
        setSearchTotal(total);
      } catch (error) {
        console.error("Header: Lỗi tìm kiếm", error);
        setSearchResults([]);
        setSearchTotal(0);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  const headerVariants = {
    transparent: {
      container: isScrolled
        ? "bg-white/95 dark:bg-background-header-dark backdrop-blur-md text-text-primary dark:text-white shadow-md transition-colors duration-300"
        : "bg-white dark:bg-background-header-dark md:bg-transparent md:dark:bg-transparent text-text-primary dark:text-white md:text-text-white",
      title: isScrolled
        ? "text-text-primary dark:text-white"
        : "text-text-white",
      navLink: isScrolled
        ? "text-text-primary dark:text-white hover:text-primary dark:hover:text-primary-400"
        : "text-text-primary dark:text-white md:text-text-white hover:text-primary md:hover:text-secondary",
      dropdown:
        "bg-white dark:bg-darker border border-gray-200 dark:border-gray-700 text-text-primary dark:text-white",
      dropdownItem:
        "hover:bg-gray-50 dark:hover:bg-gray-900 text-text-primary dark:text-white hover:text-primary dark:hover:text-primary-400",
      button: isScrolled
        ? "text-text-primary dark:text-white"
        : "text-text-white",
    },
    light: {
      container:
        "bg-white dark:bg-background-header-dark text-text-primary dark:text-white shadow-md border-b border-gray-200 dark:border-gray-700",
      title: "text-text-primary dark:text-white",
      navLink: "text-text-primary dark:text-white hover:text-primary",
      dropdown:
        "bg-white dark:bg-darker border border-gray-200 dark:border-gray-700",
      dropdownItem: "hover:bg-gray-50 dark:hover:bg-gray-700",
      button: "text-text-primary dark:text-white",
    },
    primary: {
      container: "bg-primary dark:bg-primary-700 text-text-white shadow-md",
      title: "text-text-white",
      navLink: "text-text-white hover:text-secondary",
      dropdown: "bg-primary dark:bg-primary-700 border border-secondary",
      dropdownItem: "hover:bg-secondary/10 text-text-white",
      button: "text-text-white",
    },
  };
  const currentVariant = headerVariants[variant] || headerVariants.light;

  const handleCoinClick = () => navigate("/wallet");

  return (
    <header
      className={`${isFixed ? "fixed" : "relative"
        } top-0 left-0 right-0 z-50 py-3 px-4 sm:py-4 sm:px-6 transition-all duration-300 ${currentVariant.container
        }`}
    >
      <div className="mx-auto max-w-container flex items-center justify-between gap-4">
        {/* Left */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Link to="/home">
            <img
              src="https://i.postimg.cc/HLJPXtZ4/logo-(3)-(1)-(1).png"
              alt="Fundelio"
              className="w-10 h-10 md:w-12 md:h-12"
              width="48"
              height="48"
            />
          </Link>
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
                {/* Bridge element để lấp khoảng trống giữa button và dropdown */}
                <div className="absolute top-full left-0 w-48 h-4" />
                <div
                  className={`absolute top-full left-0 mt-4 w-48 rounded-lg shadow-lg z-50 ${currentVariant.dropdown}`}
                >
                  {loadingCategories ? (
                    <div className="px-4 py-3 text-sm">Đang tải...</div>
                  ) : (
                    categories.map((cat, i) => {
                      const Icon = cat.icon;
                      return (
                        <Link
                          key={cat.id}
                          to={buildSearchUrl({ category: cat.id })}
                          className={`flex items-center space-x-3 px-4 py-3 ${currentVariant.dropdownItem}`}
                        >
                          <Icon className={`w-4 h-4 ${cat.color}`} />
                          <span className="text-sm font-medium">{cat.name}</span>
                        </Link>
                      );
                    })
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {!landing && (
          <div className="hidden md:block flex-1 max-w-xl search-container">
            <div className="relative">
              <Search
                className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${currentVariant.navLink}`}
              />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border bg-transparent ${isScrolled || variant === 'light'
                  ? "text-text-primary dark:text-white border-gray-300 dark:border-gray-600 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                  : "text-white dark:text-white border-white/30 placeholder:text-gray-200 dark:placeholder:text-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-primary/50`}
              />
              {/* Search Results Dropdown */}
              {isSearchFocused && (searchQuery.trim() || searchResults.length > 0) && (
                <div className="absolute w-[600px] left-1/2 -translate-x-1/2 top-full mt-2 bg-white dark:bg-darker rounded-xs shadow-xl shadow-card z-50 max-h-96 overflow-y-auto scrollbar-hide">
                  {isSearching ? (
                    <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                      Đang tìm kiếm...
                    </div>
                  ) : searchResults.length > 0 ? (
                    <>
                      <div className="px-4 py-3 border-b text-center border-gray-200 dark:border-gray-700">
                        <h3 className="text-sm font-semibold text-text-primary dark:text-white">
                          PROJECTS: <span className="text-green-600 dark:text-green-400">{searchTotal}</span>
                        </h3>
                      </div>
                      <div className="py-2">
                        {searchResults.map((campaign) => {
                          const displayName = campaign.owner
                            ? `${campaign.owner.firstName || ""} ${campaign.owner.lastName || ""}`.trim() || "Unknown"
                            : "Unknown";
                          const thumbnail = campaign.introImageUrl || campaign.thumbnailUrl || "/placeholder.png";
                          return (
                            <Link
                              key={campaign.campaignId || campaign.id}
                              to={`/campaigns/${campaign.campaignId || campaign.id}`}
                              onClick={() => {
                                setSearchQuery("");
                                setSearchResults([]);
                                setIsSearchFocused(false);
                              }}
                              className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                              <img
                                src={thumbnail}
                                alt={campaign.title}
                                className="w-12 h-12 rounded object-cover flex-shrink-0"
                                onError={(e) => {
                                  e.target.src = "/placeholder.png";
                                }}
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1 line-clamp-2">
                                  {campaign.title}
                                </h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {displayName}
                                </p>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </>
                  ) : searchQuery.trim() ? (
                    <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                      Không tìm thấy kết quả
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mobile Search Input Overlay */}
        {isMobileSearchOpen ? (
          <div className="flex items-center w-full gap-2 md:hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full pl-9 pr-9 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-darker text-sm text-text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              onClick={() => {
                setIsMobileSearchOpen(false);
                setSearchQuery("");
                setSearchResults([]);
              }}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Mobile Search Results Dropdown */}
            {searchQuery.trim() && (
              <div className="absolute left-0 right-0 top-full mt-2 mx-4 bg-white dark:bg-darker rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 z-50 max-h-[60vh] overflow-y-auto">
                {isSearching ? (
                  <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                    Đang tìm kiếm...
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="py-2">
                    {searchResults.map((campaign) => (
                      <div
                        key={campaign.campaignId || campaign.id}
                        onMouseDown={(e) => {
                          e.preventDefault(); // Prevent focus loss
                          navigate(`/campaigns/${campaign.campaignId || campaign.id}`);
                          setIsMobileSearchOpen(false);
                          setSearchQuery("");
                          setSearchResults([]);
                        }}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-100 dark:border-gray-800 last:border-0 cursor-pointer"
                      >
                        <img
                          src={campaign.introImageUrl || campaign.thumbnailUrl || "/placeholder.png"}
                          alt={campaign.title}
                          className="w-10 h-10 rounded object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {campaign.title}
                          </h4>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                    Không tìm thấy kết quả
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Search Trigger */}
            <button
              onClick={() => setIsMobileSearchOpen(true)}
              className={`md:hidden p-2 rounded-lg ${currentVariant.navLink}`}
            >
              <Search className="w-5 h-5" />
            </button>

            {isLoggedIn && user && (
              <button
                onClick={handleCoinClick}
                className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg ${Number(headerBalance) === 0
                  ? "hover:bg-red-100 dark:hover:bg-red-900/30"
                  : "bg-primary/10 hover:bg-primary/20"
                  } transition-all duration-200 hover:scale-105 coin-button relative`}
              >
                <Wallet className="w-4 h-4 text-primary dark:text-primary-400" />
                <span
                  className={`text-md font-bold ${Number(headerBalance) === 0
                    ? "text-red-500 dark:text-red-400"
                    : "text-primary dark:text-primary-400"
                    }`}
                >
                  {formatPrice(headerBalance)} VND
                </span>
              </button>
            )}

            <button
              onClick={toggleTheme}
              className={`hidden md:block p-2 rounded-lg ${currentVariant.navLink}`}
            >
              {isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* Wallet Balance - Mobile */}
            {isLoggedIn && user && (
              <button
                onClick={handleCoinClick}
                className={`md:hidden flex items-center gap-1.5 px-2 py-1.5 rounded-lg ${Number(headerBalance) === 0
                  ? "hover:bg-red-100 dark:hover:bg-red-900/30"
                  : "bg-primary/10 hover:bg-primary/20"
                  } transition-all`}
              >
                <Wallet className="w-4 h-4 text-primary dark:text-primary-400" />
                <span
                  className={`text-xs font-bold ${Number(headerBalance) === 0
                    ? "text-red-500 dark:text-red-400"
                    : "text-primary dark:text-primary-400"
                    }`}
                >
                  {formatPrice(headerBalance)}
                </span>
              </button>
            )}

            {/* Theme Toggle - Mobile */}
            <button
              onClick={toggleTheme}
              className={`md:hidden p-2 rounded-lg ${currentVariant.navLink}`}
            >
              {isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {isLoggedIn && user ? (
              <div className="relative user-menu-container">
                <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
                  <img
                    src={avatarUrl}
                    className="w-9 h-9 rounded-full object-cover"
                    alt="User"
                  />
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-[280px] max-w-[calc(100vw-2rem)] bg-white dark:bg-darker rounded-lg shadow-xl border border-border overflow-hidden z-50">
                    <div className="p-4">
                      <div className="space-y-1">
                        {/* Admin link - only show if user has ADMIN role */}
                        {user?.rolesSecured?.some(
                          (role) => role.name === "ADMIN"
                        ) && (
                            <Link
                              to="/admin"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center gap-1.5 px-3 py-2 text-sm text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
                            >
                              <ShieldCheck className="w-4 h-4" />
                              <span>Quản trị hệ thống</span>
                            </Link>
                          )}
                        {user?.rolesSecured?.some(
                          (role) => role.name === "FOUNDER" || role.name === "ADMIN"
                        ) && (
                            <Link
                              to="/dashboard"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center gap-1.5 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 text-text-primary dark:text-white border-b border-amber-600 dark:border-amber-700"
                            >
                              <LayoutDashboard className="w-4 h-4 text-gray-500" />
                              <span>Bảng điều khiển</span>
                            </Link>
                          )}
                        <Link
                          to="/profile"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-1.5 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-text-primary dark:text-white"
                        >
                          <User className="w-4 h-4 text-gray-500" />
                          <span>Hồ sơ cá nhân</span>
                        </Link>

                        <Link
                          to="/my-pledges"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-1.5 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-text-primary dark:text-white"
                        >
                          <FolderOpen className="w-4 h-4 text-gray-500" />
                          <span>Dự án của tôi</span>
                        </Link>

                        <Link
                          to="/campaigns/create"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-1.5 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-primary font-medium"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Tạo chiến dịch</span>
                        </Link>

                        <div className="h-px bg-gray-100 dark:bg-gray-700 my-1"></div>

                        <Link
                          to="/wallet"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-1.5 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-text-primary dark:text-white"
                        >
                          <Wallet className="w-4 h-4 text-gray-500" />
                          <div className="flex justify-between w-full items-center">
                            <span>Ví của tôi</span>
                            <span className="text-xs font-bold text-primary">
                              {formatPrice(headerBalance)} đ
                            </span>
                          </div>
                        </Link>

                        <button
                          onClick={() => {
                            logout();
                            navigate("/auth");
                          }}
                          className="flex items-center gap-1.5 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg w-full text-left transition-colors"
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
                  className="!px-2 !py-1.5 !text-xs sm:!px-4 sm:!py-2 sm:!text-base"
                  onClick={() => {
                    navigate("/auth", { state: { mode: "register" } });
                  }}
                >
                  Đăng ký
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="!px-2 !py-1.5 !text-xs sm:!px-4 sm:!py-2 sm:!text-base border-current"
                  onClick={() => {
                    navigate("/auth", { state: { mode: "login" } });
                  }}
                >
                  Đăng nhập
                </Button>
              </>
            )}
          </div>
        )}
      </div>

    </header>
  );
};
export default Header;
