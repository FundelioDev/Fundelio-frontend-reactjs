import { httpService } from './http';
import { storageService } from '../services/storage';

export const authApi = {
  login(payload) {
    return httpService
      .post('/auth/login', payload, {
        withCredentials: true,
      })
      .then((response) => {
        const accessToken = response.data.data.accessToken;
        if (accessToken) {
          storageService.setAccessToken(accessToken);
          return response;
        }
      })
      .catch((error) => {
        console.error('Login error:', error);
        throw error;
      });
  },

  register(payload) {
    return httpService.post('/auth/register', payload);
  },

  logout() {
    return httpService.post('/auth/logout', null, {
      requireToken: true,
    });
  },

  verifyEmail(payload) {
    return httpService.post('/auth/verify-active-account', payload);
  },

  resendEmail(payload) {
    return httpService.post('/auth/resend-verify', payload);
  },

  forgotPassword(payload) {
    return httpService.post('/auth/forgot-password', payload);
  },

  resetPassword(payload) {
    return httpService.post('/auth/reset-password', payload);
  },

  getAccount() {
    return httpService.get('/auth/account', {
      requireToken: true,
    });
  },

  refreshToken() {
    return httpService.get('/auth/refresh', {
      withCredentials: true,
    });
  },
};
