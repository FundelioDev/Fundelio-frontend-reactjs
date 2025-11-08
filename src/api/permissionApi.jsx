import { httpService } from './http';

export const permissionsApi = {
  /**
   * Lấy danh sách permissions với phân trang và tìm kiếm
   */
  getPermissions: async (params) => {
    return httpService.get('/permissions', {
      params,
      requireToken: true,
    });
  },

  /**
   * Lấy thông tin chi tiết của một permission theo ID
   */
  getPermissionById: async (permissionId) => {
    return httpService.get(`/permissions/${permissionId}`, {
      requireToken: true,
    });
  },

  /**
   * Tạo mới một permission
   */
  createPermission: async (data) => {
    return httpService.post('/permissions', data, {
      requireToken: true,
    });
  },

  /**
   * Cập nhật thông tin của một permission
   */
  updatePermission: async (permissionId, data) => {
    return httpService.patch(`/permissions/${permissionId}`, data, {
      requireToken: true,
    });
  },

  /**
   * Xóa một permission
   */
  deletePermission: async (permissionId) => {
    return httpService.delete(`/permissions/${permissionId}`, {
      requireToken: true,
    });
  },

  /**
   * Lấy danh sách các module có sẵn
   */
  getModules: async () => {
    return httpService.get('/permissions/modules', {
      requireToken: true,
    });
  },

  /**
   * Tạo mới một module và gán permissions
   */
  createModule: async (data) => {
    return httpService.post('/permissions/module', data, {
      requireToken: true,
    });
  },

  /**
   * Xóa một module
   */
  deleteModule: async (moduleName) => {
    return httpService.delete(`/permissions/module/${moduleName}`, {
      requireToken: true,
    });
  },
};
