import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { authApi } from '@/api/authApi';
import { storageService } from '@/services/storage';
import {
  startTokenRefreshInterval,
  stopTokenRefreshInterval,
  setLogoutCallback,
} from '@/api/http';
import Loading from '@/components/common/Loading';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const logout = useCallback(() => {
    storageService.clearAuth();
    try {
      window.localStorage.removeItem('user');
    } catch (_) {}
    setUser(null);
    setIsLoggedIn(false);
    stopTokenRefreshInterval();

    authApi.logout().catch(() => {});
  }, []);

  const fetchUserData = useCallback(async () => {
    try {
      const response = await authApi.getAccount();
      if (response?.data?.data) {
        const userData = response.data.data;
        setUser(userData);
        storageService.setUser(userData);
        try {
          window.localStorage.setItem('user', JSON.stringify(userData));
        } catch (_) {}
        return userData;
      }
    } catch (error) {
      if (error?.response?.status === 401) {
        logout();
      }
      throw error;
    }
  }, [logout]);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = storageService.getAccessToken();

      if (token) {
        setIsLoggedIn(true);
        const cachedUser = storageService.getUser();
        if (cachedUser) {
          setUser(cachedUser);
        }
        try {
          await fetchUserData();
        } catch (err) {}
      }

      setIsInitializing(false);
    };

    initializeAuth();
  }, [fetchUserData]);

  const login = (token, userFromLogin) => {
    if (!token) return;

    storageService.setAccessToken(token);
    setIsLoggedIn(true);
    if (userFromLogin) {
      setUser(userFromLogin);
      storageService.setUser(userFromLogin);
      try {
        window.localStorage.setItem('user', JSON.stringify(userFromLogin));
      } catch (_) {}
    }
    fetchUserData();
    startTokenRefreshInterval();
  };

  useEffect(() => {
    if (isLoggedIn) {
      startTokenRefreshInterval();
    } else {
      stopTokenRefreshInterval();
    }

    return () => {
      stopTokenRefreshInterval();
    };
  }, [isLoggedIn]);

  useEffect(() => {
    setLogoutCallback(() => {
      logout();
    });

    return () => {
      setLogoutCallback(null);
    };
  }, [logout]);

  const hasRole = (roleName) => {
    if (!user || !user.rolesSecured || user.rolesSecured.length === 0) {
      return false;
    }

    const normalizedRoleName = roleName.toUpperCase();

    const hasRole = user.rolesSecured.some(
      (role) =>
        role.name === normalizedRoleName ||
        role.name?.toUpperCase() === normalizedRoleName
    );

    return hasRole;
  };

  if (isInitializing) {
    return <Loading />;
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
