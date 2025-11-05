/**
 * Storage Service - Quản lý lưu trữ token và dữ liệu người dùng
 */

const ACCESS_TOKEN_KEY = 'accessToken';
const USER_KEY = 'user';

export const storageService = {
  /**
   * Lưu access token
   */
  setAccessToken(token) {
    if (token) {
      localStorage.setItem(ACCESS_TOKEN_KEY, token);
    }
  },

  /**
   * Lấy access token
   */
  getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  /**
   * Xóa access token
   */
  removeAccessToken() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  },

  /**
   * Lưu thông tin user
   */
  setUser(user) {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  },

  /**
   * Lấy thông tin user
   */
  getUser() {
    const userStr = localStorage.getItem(USER_KEY);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
        return null;
      }
    }
    return null;
  },

  /**
   * Xóa thông tin user
   */
  removeUser() {
    localStorage.removeItem(USER_KEY);
  },

  /**
   * Kiểm tra đã đăng nhập chưa
   */
  isAuthenticated() {
    return !!this.getAccessToken();
  },

  /**
   * Xóa tất cả dữ liệu authentication
   */
  clearAuth() {
    this.removeAccessToken();
    this.removeUser();
  },
};
