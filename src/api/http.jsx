import axios from 'axios';

import { storageService } from '../services/storage';
import { authApi } from './authApi';
import { TOKEN_REFRESHED_EVENT } from '@/websocket/WebSocketClient';

export const API_URL = 'https://fundelio.duckdns.org/api/v1';

export const http = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  // headers: {
  //   'Content-Type': 'application/json',
  // },
  withCredentials: true,
});

let refreshTokenPromise = null;

let logoutCallback;
export const setLogoutCallback = (callback) => {
  logoutCallback = callback;
};

/**
 * Dispatch custom event khi token được refresh thành công
 * WebSocket client sẽ listen event này để reconnect với token mới
 */
const dispatchTokenRefreshedEvent = (accessToken) => {
  if (typeof window === 'undefined') return;

  console.log('🔔 Dispatching token refreshed event...');
  
  const event = new CustomEvent(TOKEN_REFRESHED_EVENT, {
    detail: { accessToken },
  });
  
  window.dispatchEvent(event);
};

class Http {
  constructor() {
    this._instance = http;
    this.setupInterceptors();
  }

  setupInterceptors() {
    this._instance.interceptors.request.use(
      (config) => {
        if (config.requireToken) {
          const token = storageService.getAccessToken();
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    this._instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (
          error.response?.status === 401 &&
          originalRequest &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;

          const errorData = error.response.data;
          let shouldRefresh = false;

          if (errorData?.errors && Array.isArray(errorData.errors)) {
            shouldRefresh = errorData.errors.some(
              (err) => err.code === 1005
            );
          } else if (errorData?.code === 1005) {
            shouldRefresh = true;
          }

          if (shouldRefresh) {
            if (!refreshTokenPromise) {
              refreshTokenPromise = authApi
                .refreshToken()
                .then((response) => {
                  const newAccessToken = response?.data?.data?.accessToken;
                  if (newAccessToken) {
                    console.log('✅ Token refresh successful');
                    storageService.setAccessToken(newAccessToken);
                    
                    // 🔔 Dispatch event để WebSocket reconnect với token mới
                    dispatchTokenRefreshedEvent(newAccessToken);
                    
                    return newAccessToken;
                  }
                  return Promise.reject(
                    'Cannot get access token from refresh API'
                  );
                })
                .catch((refreshError) => {
                  console.error('❌ Token refresh failed:', refreshError);
                  storageService.removeAccessToken();
                  if (logoutCallback) {
                    logoutCallback();
                  }
                  return Promise.reject(refreshError);
                })
                .finally(() => {
                  refreshTokenPromise = null;
                });
            }

            return refreshTokenPromise.then((accessToken) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              }
              return this._instance(originalRequest);
            });
          }
        }

        return Promise.reject(error.response?.data || error);
      }
    );
  }

  get instance() {
    return this._instance;
  }
}

export const httpService = new Http().instance;
