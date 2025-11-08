import { httpService } from './http';

export const rolesApi = {
  /**
   * Lấy danh sách roles với phân trang
   */
  getRoles: async (params) => {
    return httpService.get('/roles', {
      params,
      requireToken: true,
    });
  },

  /**
   * Lấy thông tin chi tiết của một role theo ID
   */
  getRoleById: async (roleId) => {
    return httpService.get(`/roles/${roleId}`, {
      requireToken: true,
    });
  },

  /**
   * Tạo mới một role
   */
  createRole: async (data) => {
    return httpService.post('/roles', data, {
      requireToken: true,
    });
  },

  /**
   * Cập nhật thông tin của một role
   */
  updateRole: async (roleId, data) => {
    return httpService.patch(`/roles/${roleId}`, data, {
      requireToken: true,
    });
  },

  /**
   * Xóa một role
   */
  deleteRole: async (roleId) => {
    return httpService.delete(`/roles/${roleId}`, {
      requireToken: true,
    });
  },

  /**
   * Cập nhật permissions cho một role
   */
  updateRolePermissions: async (roleId, permissions) => {
    return httpService.patch(
      `/roles/${roleId}/permissions`,
      { permissionIds: permissions },
      {
        requireToken: true,
      }
    );
  },

  /**
   * Xóa permissions khỏi một role
   */
  removePermissions: async (roleId, permissionIds) => {
    return httpService.delete(`/roles/${roleId}/permissions`, {
      data: { permissionIds },
      requireToken: true,
    });
  },
};
