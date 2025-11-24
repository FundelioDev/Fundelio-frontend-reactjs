import {
  Palette,
  Pencil,
  Shirt,
  Film,
  UtensilsCrossed,
  Gamepad2,
  Music,
  Camera,
  BookOpen,
  Monitor,
  Lightbulb,
} from 'lucide-react';

// Mapping categories từ API (tiếng Anh) sang tiếng Việt
export const CATEGORY_LABELS = {
  ART: 'Nghệ thuật',
  DESIGN: 'Thiết kế',
  FASHION: 'Thời trang',
  FILM: 'Phim & Video',
  FOOD: 'Thực phẩm & Thủ công',
  GAMES: 'Trò chơi',
  MUSIC: 'Âm nhạc',
  PHOTOGRAPHY: 'Nhiếp ảnh',
  PUBLISHING: 'Xuất bản',
  TECHNOLOGY: 'Công nghệ',
  OTHER: 'Khác',
};

// Mapping icons cho từng category
export const CATEGORY_ICONS = {
  ART: Palette,
  DESIGN: Pencil,
  FASHION: Shirt,
  FILM: Film,
  FOOD: UtensilsCrossed,
  GAMES: Gamepad2,
  MUSIC: Music,
  PHOTOGRAPHY: Camera,
  PUBLISHING: BookOpen,
  TECHNOLOGY: Monitor,
  OTHER: Lightbulb,
};

// Mapping colors cho từng category
export const CATEGORY_COLORS = {
  ART: 'text-purple-400',
  DESIGN: 'text-blue-400',
  FASHION: 'text-pink-400',
  FILM: 'text-red-400',
  FOOD: 'text-orange-400',
  GAMES: 'text-green-400',
  MUSIC: 'text-indigo-400',
  PHOTOGRAPHY: 'text-yellow-400',
  PUBLISHING: 'text-teal-400',
  TECHNOLOGY: 'text-cyan-400',
  OTHER: 'text-gray-400',
};

/**
 * Lấy tên tiếng Việt của category
 * @param {string} categoryKey - Key của category (VD: 'ART', 'TECHNOLOGY')
 * @returns {string} - Tên tiếng Việt
 */
export const getCategoryLabel = (categoryKey) => {
  return CATEGORY_LABELS[categoryKey] || categoryKey;
};

/**
 * Lấy icon component của category
 * @param {string} categoryKey - Key của category
 * @returns {Component} - Icon component từ lucide-react
 */
export const getCategoryIcon = (categoryKey) => {
  return CATEGORY_ICONS[categoryKey] || Lightbulb;
};

/**
 * Lấy màu của category
 * @param {string} categoryKey - Key của category
 * @returns {string} - Tailwind class cho màu
 */
export const getCategoryColor = (categoryKey) => {
  return CATEGORY_COLORS[categoryKey] || 'text-gray-400';
};

/**
 * Format category object từ API thành format UI-friendly
 * @param {string|object} category - Category từ API (có thể là string hoặc object)
 * @returns {object} - Category với label, icon, color
 */
export const formatCategory = (category) => {
  if (!category) return null;
  
  // Nếu category là string (VD: 'ART', 'GAMES')
  if (typeof category === 'string') {
    return {
      id: category,
      key: category,
      name: getCategoryLabel(category),
      icon: getCategoryIcon(category),
      color: getCategoryColor(category),
      href: `/category/${category.toLowerCase()}`,
    };
  }
  
  // Nếu category là object, xử lý các format khác nhau
  // Format từ API: { categoryId, categoryName, categoryValue }
  // Format đã format: { id, key, name, icon, color }
  const categoryValue = category.categoryValue || category.key;
  const categoryName = category.categoryName || category.name;
  const categoryId = category.categoryId || category.id;
  
  // Lấy key để map với CATEGORY_LABELS, CATEGORY_ICONS, etc.
  // categoryValue là enum value như 'FILM', 'ART', etc.
  const key = categoryValue || category.key || categoryId || categoryName;
  
  // Nếu không có key hợp lệ, skip category này
  if (!key) return null;
  
  return {
    id: categoryId || key,
    key: key,
    name: categoryName || getCategoryLabel(key),
    icon: getCategoryIcon(key),
    color: getCategoryColor(key),
    href: categoryId ? `/search?category=${categoryId}` : `/category/${key.toLowerCase()}`,
  };
};

/**
 * Format array categories từ API
 * @param {array} categories - Array categories từ API
 * @returns {array} - Array categories đã format
 */
export const formatCategories = (categories) => {
  if (!Array.isArray(categories)) return [];
  return categories.map(formatCategory).filter(Boolean);
};
