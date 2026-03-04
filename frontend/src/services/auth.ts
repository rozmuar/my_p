// Mock authentication service for demonstration
// В реальном приложении это будет интегрировано с backend API

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'editor' | 'viewer' | 'admin' | 'superAdmin';
  avatar?: string;
  isActive?: boolean;
  lastLoginAt?: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

class AuthService {
  private listeners: ((state: AuthState) => void)[] = [];
  private state: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: false
  };

  // Mock пользователей для демонстрации
  private mockUsers: User[] = [
    {
      id: 'super-admin-1',
      name: 'Super Admin',
      email: 'superadmin@postapi.com',
      role: 'super_admin',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 'admin-1',
      name: 'Admin User',
      email: 'admin@postapi.com',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 'user-1',
      name: 'Regular User',
      email: 'user@postapi.com',
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
    }
  ];

  constructor() {
    // Проверяем если пользователь уже авторизован (из localStorage)
    const savedUser = localStorage.getItem('postapi_user');
    if (savedUser) {
      try {
        this.state.user = JSON.parse(savedUser);
        this.state.isAuthenticated = true;
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('postapi_user');
      }
    }
  }

  // Подписка на изменения состояния аутентификации
  subscribe(listener: (state: AuthState) => void) {
    this.listeners.push(listener);
    // Возвращаем функцию для отписки
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // Уведомление подписчиков об изменении состояния
  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.state));
  }

  // Получение текущего состояния
  getState(): AuthState {
    return { ...this.state };
  }

  // Авторизация (mock)
  async login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    this.state.isLoading = true;
    this.notifyListeners();

    // Имитация запроса к серверу
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = this.mockUsers.find(u => u.email === email);

    if (user && password === 'password') {
      this.state.user = user;
      this.state.isAuthenticated = true;
      this.state.isLoading = false;

      // Сохраняем в localStorage
      localStorage.setItem('postapi_user', JSON.stringify(user));
      
      this.notifyListeners();
      return { success: true };
    } else {
      this.state.isLoading = false;
      this.notifyListeners();
      return { success: false, error: 'Неверный email или пароль' };
    }
  }

  // Выход из системы
  logout() {
    this.state.user = null;
    this.state.isAuthenticated = false;
    localStorage.removeItem('postapi_user');
    this.notifyListeners();
  }

  // Проверка роли пользователя
  hasRole(role: User['role']): boolean {
    return this.state.user?.role === role;
  }

  // Проверка прав доступа
  hasPermission(permission: 'read_news' | 'write_news' | 'admin_panel' | 'super_admin'): boolean {
    if (!this.state.user) return false;

    const { role } = this.state.user;

    switch (permission) {
      case 'read_news':
        return true; // Все могут читать новости
      case 'write_news':
        return role === 'super_admin'; // Только super admin может создавать новости
      case 'admin_panel':
        return role === 'admin' || role === 'super_admin';
      case 'super_admin':
        return role === 'super_admin';
      default:
        return false;
    }
  }

  // Быстрая авторизация для целей демонстрации
  quickLoginAs(role: User['role']) {
    const user = this.mockUsers.find(u => u.role === role);
    if (user) {
      this.state.user = user;
      this.state.isAuthenticated = true;
      localStorage.setItem('postapi_user', JSON.stringify(user));
      this.notifyListeners();
    }
  }
}

export const authService = new AuthService();

// React hook для использования в компонентах
import { useState, useEffect } from 'react';

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>(authService.getState());

  useEffect(() => {
    const unsubscribe = authService.subscribe(setAuthState);
    return unsubscribe;
  }, []);

  return {
    ...authState,
    login: authService.login.bind(authService),
    logout: authService.logout.bind(authService),
    hasRole: authService.hasRole.bind(authService),
    hasPermission: authService.hasPermission.bind(authService),
    quickLoginAs: authService.quickLoginAs.bind(authService)
  };
}

export default authService;