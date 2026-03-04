import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store';
import { t } from '@/i18n/russian';
import { 
  Settings, 
  User, 
  LogOut, 
  Globe, 
  ChevronDown,
  Monitor,
  Moon,
  Sun,
  Shield
} from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();
  const { 
    environments, 
    activeEnvironmentId, 
    setActiveEnvironment,
    currentUser,
    isUserLoading,
    loadCurrentUser,
    logout,
    theme,
    setTheme
  } = useAppStore();
  
  const [showEnvDropdown, setShowEnvDropdown] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Load user on mount
  useEffect(() => {
    loadCurrentUser();
  }, [loadCurrentUser]);

  const activeEnvironment = environments.find(env => env.id === activeEnvironmentId);

  const handleLogout = async () => {
    await logout();
  };

  const handleAdminPanel = () => {
    navigate('/admin');
    setShowUserMenu(false);
  };

  const handleProfile = () => {
    navigate('/profile');
    setShowUserMenu(false);
  };

  const handleSettings = () => {
    navigate('/settings');
    setShowUserMenu(false);
  };

  if (isUserLoading) {
    return (
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-center px-6">
        <div className="text-sm text-gray-600">Загрузка...</div>
      </header>
    );
  }

  if (!currentUser) {
    return (
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-center px-6">
        <div className="text-sm text-gray-600">Не авторизован</div>
      </header>
    );
  }

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Logo */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">PA</span>
          </div>
          <span className="text-xl font-bold text-gray-900">PostAPI</span>
        </div>
      </div>

      {/* Environment Selector */}
      <div className="flex-1 flex justify-center">
        <div className="relative">
          <button
            onClick={() => setShowEnvDropdown(!showEnvDropdown)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 border"
          >
            <Globe className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              {activeEnvironment?.name || t.noEnvironment}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>

          {showEnvDropdown && (
            <div className="absolute top-full mt-2 w-48 bg-white rounded-lg shadow-medium border border-gray-200 py-2 z-50">
              {environments.map((env) => (
                <button
                  key={env.id}
                  onClick={() => {
                    setActiveEnvironment(env.id);
                    setShowEnvDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors duration-150 ${
                    env.id === activeEnvironmentId ? 'bg-primary-50 text-primary-700' : 'text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{env.name}</span>
                    {env.id === activeEnvironmentId && (
                      <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {Object.keys(env.variables).length} переменных
                  </div>
                </button>
              ))}
              
              <hr className="my-2" />
              
              <button className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors duration-150 text-gray-700">
                <span className="font-medium">Управление окружениями</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-2">
        {/* Theme Selector */}
        <div className="flex items-center bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setTheme('light')}
            className={`p-2 rounded-md transition-colors duration-200 ${
              theme === 'light' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Sun className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`p-2 rounded-md transition-colors duration-200 ${
              theme === 'dark' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Moon className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTheme('system')}
            className={`p-2 rounded-md transition-colors duration-200 ${
              theme === 'system' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Monitor className="w-4 h-4" />
          </button>
        </div>

        {/* Settings */}
        <button 
          onClick={handleSettings}
          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        >
          <Settings className="w-5 h-5" />
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-medium border border-gray-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-200 mb-2">
                <div className="text-sm font-medium text-gray-900">{currentUser.name}</div>
                <div className="text-xs text-gray-500">{currentUser.email}</div>
                <div className="text-xs text-primary-600 mt-1 flex items-center space-x-1">
                  {currentUser.role === 'superAdmin' && <Shield className="w-3 h-3" />}
                  <span>{
                    currentUser.role === 'superAdmin' ? t.superAdmin : 
                    currentUser.role === 'admin' ? t.admin : t.user
                  }</span>
                </div>
              </div>
              
              <button 
                onClick={handleProfile}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors duration-150 text-gray-700 flex items-center space-x-2"
              >
                <User className="w-4 h-4" />
                <span>Профиль</span>
              </button>
              
              <button 
                onClick={handleSettings}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors duration-150 text-gray-700 flex items-center space-x-2"
              >
                <Settings className="w-4 h-4" />
                <span>Настройки</span>
              </button>

              {((currentUser.role === 'admin' || currentUser.role === 'superAdmin')) && (
                <>
                  <hr className="my-2" />
                  <button
                    onClick={handleAdminPanel}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors duration-150 text-gray-700 flex items-center space-x-2"
                  >
                    <Shield className="w-4 h-4" />
                    <span>{t.adminPanel}</span>
                  </button>
                </>
              )}
              
              <hr className="my-2" />
              
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-red-50 transition-colors duration-150 text-red-600 flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>{t.logout}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;