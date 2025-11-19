// src/api/userApi.js
import { httpService } from './http';

export const userApi = {
  // GET /users?page=...&size=...&search=...&role=...
  getUsers: (params) => {
    return httpService.get('/users', {
      params,
      requireToken: true,
    });
  },

  // GET /users/{id}
  getUserById: (id) => {
    return httpService.get(`/users/${id}`, {
      requireToken: true,
    });
  },

  // PATCH /users/{id}
  updateUser: (id, data) => {
    // data expected to be JSON with fields backend accepts (firstName, lastName, email, role, status, ...)
    return httpService.patch(`/users/${id}`, data, {
      requireToken: true,
      headers: { 'Content-Type': 'application/json' },
    });
  },

  // DELETE /users/{id}
  deleteUser: (id) => {
    return httpService.delete(`/users/${id}`, {
      requireToken: true,
    });
  },

  // DELETE /users/{id}/roles  (if backend expects body with role ids)
  deleteRoles: (id, data) => {
    return httpService.delete(`/users/${id}/roles`, {
      data,
      requireToken: true,
    });
  },

  // Optional: create user via multipart form (if backend supports)
  createUser: (payloadFormData) => {
    return httpService.post('/users', payloadFormData, {
      requireToken: true,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
