import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store';
import { 
  ArrowLeft, 
  Monitor, 
  Moon, 
  Sun, 
  Bell, 
  Shield, 
  Database,
  Download,
  Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { theme, setTheme, currentUser } = useAppStore();
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  const handleExportData = () => {
    // TODO: Implement export functionality
    toast.success('Данные экспортированы');
  };

  const handleClearData = () => {
    if (window.confirm('Очистить все локальные данные? Это действие нельзя отменить.')) {
      // TODO: Implement clear data functionality
      toast.success('Локальные данные очищены');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/app')}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Настройки</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        
        {/* Theme Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Тема оформления</h2>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setTheme('light')}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg border transition-colors ${
                  theme === 'light' 
                    ? 'border-primary-500 bg-primary-50 text-primary-700' 
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Sun className="w-5 h-5" />
                <span>Светлая</span>
              </button>
              
              <button
                onClick={() => setTheme('dark')}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg border transition-colors ${
                  theme === 'dark' 
                    ? 'border-primary-500 bg-primary-50 text-primary-700' 
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Moon className="w-5 h-5" />
                <span>Темная</span>
              </button>
              
              <button
                onClick={() => setTheme('system')}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg border transition-colors ${
                  theme === 'system' 
                    ? 'border-primary-500 bg-primary-50 text-primary-700' 
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Monitor className="w-5 h-5" />
                <span>Системная</span>
              </button>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Bell className="w-5 h-5" />
              <span>Уведомления</span>
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">Уведомления в браузере</div>
                  <div className="text-xs text-gray-500">Показывать всплывающие уведомления</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications}
                    onChange={(e) => setNotifications(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">Email уведомления</div>
                  <div className="text-xs text-gray-500">Получать уведомления на email</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Security */}
        {currentUser?.role === 'superAdmin' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Безопасность</span>
              </h2>
              <div className="space-y-4">
                <button
                  onClick={() => navigate('/admin')}
                  className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="font-medium text-gray-900">Административная панель</div>
                  <div className="text-sm text-gray-500 mt-1">Управление пользователями и системой</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Data Management */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Database className="w-5 h-5" />
              <span>Управление данными</span>
            </h2>
            <div className="space-y-4">
              <button
                onClick={handleExportData}
                className="flex items-center space-x-3 w-full p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download className="w-5 h-5 text-green-600" />
                <div className="text-left">
                  <div className="font-medium text-gray-900">Экспорт данных</div>
                  <div className="text-sm text-gray-500">Скачать все ваши коллекции и настройки</div>
                </div>
              </button>
              
              <button
                onClick={handleClearData}
                className="flex items-center space-x-3 w-full p-4 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-5 h-5 text-red-600" />
                <div className="text-left">
                  <div className="font-medium text-red-900">Очистить локальные данные</div>
                  <div className="text-sm text-red-600">Удалить все сохраненные данные из браузера</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">О приложении</h2>
            <div className="space-y-2 text-sm text-gray-600">
              <div><span className="font-medium">PostAPI</span> - современная альтернатива Postman</div>
              <div>Версия: <span className="font-medium">1.0.0</span></div>
              <div>Разработано с ❤️ командой PostAPI</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SettingsPage;