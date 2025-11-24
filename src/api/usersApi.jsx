import { httpService } from './http';

export const usersApi = {
  /**
   * Lấy danh sách users với phân trang
   */
  getUsers: async (params) => {
    return httpService.get('/users?page=1&size=100', {
      params,
      requireToken: true,
    });
  },

  /**
   * Lấy thông tin chi tiết của một user theo ID
   */
  getUserById: async (userId) => {
    return httpService.get(`/users/${userId}`, {
      requireToken: true,
    });
  },

  /**
   * Tạo mới một user
   */
  createUser: async (data) => {
    return httpService.post('/users', data, {
      requireToken: true,
    });
  },

  /**
   * Cập nhật thông tin của một user
   */
  updateUser: async (userId, data) => {
    console.log("sao ko có token", data)
    return httpService.patch(`/users/${userId}`, data, {
      requireToken: true,
    });
  },

  /**
   * Xóa một user
   */
  deleteUser: async (userId) => {
    return httpService.delete(`/users/${userId}`, {
      requireToken: true,
    });
  },

  /**
   * Mời user mới
   */
  inviteUser: async (data) => {
    return httpService.post('/users/invite', data, {
      requireToken: true,
    });
  },

  /**
   * Cập nhật roles cho một user
   */
  updateUserRoles: async (userId, roles) => {
    return httpService.patch(
      `/users/${userId}/roles`,
      { roleIds: roles },
      {
        requireToken: true,
      }
    );
  },

  /**
   * Xóa roles khỏi một user
   */
  removeRoles: async (userId, roleIds) => {
    return httpService.delete(`/users/${userId}/roles`, {
      data: { roleIds },
      requireToken: true,
    });
  },
};

