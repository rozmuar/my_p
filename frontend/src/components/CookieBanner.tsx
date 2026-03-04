import { useState, useEffect } from 'react';
import { X, Cookie, Settings, Check, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always true
    analytics: false,
    marketing: false,
    functional: false
  });

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem('cookie-consent');
    if (!cookieConsent) {
      // Show banner after a short delay
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  const acceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true
    };
    saveCookiePreferences(allAccepted);
  };

  const acceptSelected = () => {
    saveCookiePreferences(preferences);
  };

  const rejectAll = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false
    };
    saveCookiePreferences(onlyNecessary);
  };

  const saveCookiePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem('cookie-consent', JSON.stringify({
      preferences: prefs,
      timestamp: Date.now(),
      version: '1.0'
    }));
    
    // Here you would typically initialize analytics/marketing scripts based on preferences
    if (prefs.analytics) {
      // Initialize analytics (e.g., Google Analytics)
      console.log('Analytics cookies enabled');
    }
    
    if (prefs.marketing) {
      // Initialize marketing cookies
      console.log('Marketing cookies enabled');
    }
    
    if (prefs.functional) {
      // Initialize functional cookies
      console.log('Functional cookies enabled');
    }

    setIsVisible(false);
    setShowSettings(false);
  };

  const updatePreference = (type: keyof CookiePreferences, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [type]: value
    }));
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {!showSettings ? (
          /* Main Banner */
          <div className="p-6 md:p-8">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Cookie className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Мы используем cookies
                </h3>
              </div>
              <button 
                onClick={() => rejectAll()}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 leading-relaxed mb-4">
                Мы используем файлы cookie для обеспечения лучшего пользовательского опыта, 
                персонализации контента и рекламы, а также для анализа нашего трафика. 
                Вы можете выбрать, какие типы cookies разрешить.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-green-900">Необходимые</span>
                  </div>
                  <p className="text-sm text-green-700">
                    Обеспечивают базовую функциональность сайта
                  </p>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Settings className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-blue-900">Аналитические</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    Помогают понять, как работает наш сайт
                  </p>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Cookie className="w-4 h-4 text-purple-600" />
                    <span className="font-medium text-purple-900">Маркетинговые</span>
                  </div>
                  <p className="text-sm text-purple-700">
                    Персонализируют рекламу и контент
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={acceptAll}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex-1"
              >
                Принять все
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex-1"
              >
                Настроить
              </button>
              <button
                onClick={rejectAll}
                className="text-gray-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Только необходимые
              </button>
            </div>

            <div className="mt-4 text-center">
              <Link 
                to="/privacy" 
                className="text-sm text-blue-600 hover:text-blue-700 underline"
              >
                Подробнее в политике конфиденциальности
              </Link>
            </div>
          </div>
        ) : (
          /* Settings Panel */
          <div className="p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Настройки cookies
              </h3>
              <button 
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 mb-8">
              {/* Necessary Cookies */}
              <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Shield className="w-4 h-4 text-green-600" />
                    <h4 className="font-medium text-gray-900">Необходимые cookies</h4>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Всегда включены</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Эти cookies необходимы для базовой функциональности сайта, включая аутентификацию, 
                    безопасность и доступность. Они не могут быть отключены.
                  </p>
                  <ul className="text-xs text-gray-500 mt-2 ml-4">
                    <li>• Сессия пользователя</li>
                    <li>• Настройки безопасности</li>
                    <li>• Состояние корзины</li>
                  </ul>
                </div>
                <div className="ml-4">
                  <div className="w-12 h-6 bg-green-600 rounded-full flex items-center">
                    <div className="w-5 h-5 bg-white rounded-full shadow-sm transform translate-x-6">
                      <Check className="w-3 h-3 text-green-600 m-1" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="flex items-start justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Settings className="w-4 h-4 text-blue-600" />
                    <h4 className="font-medium text-gray-900">Аналитические cookies</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    Помогают нам понять, как посетители взаимодействуют с нашим сайтом, 
                    собирая информацию анонимно.
                  </p>
                  <ul className="text-xs text-gray-500 mt-2 ml-4">
                    <li>• Google Analytics</li>
                    <li>• Статистика посещений</li>
                    <li>• Анализ поведения пользователей</li>
                  </ul>
                </div>
                <div className="ml-4">
                  <button
                    onClick={() => updatePreference('analytics', !preferences.analytics)}
                    className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                      preferences.analytics ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                      preferences.analytics ? 'transform translate-x-6' : 'transform translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>

              {/* Functional Cookies */}
              <div className="flex items-start justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Settings className="w-4 h-4 text-indigo-600" />
                    <h4 className="font-medium text-gray-900">Функциональные cookies</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    Обеспечивают расширенную функциональность и персонализацию, 
                    такую как видео и чат в реальном времени.
                  </p>
                  <ul className="text-xs text-gray-500 mt-2 ml-4">
                    <li>• Настройки языка</li>
                    <li>• Видео плееры</li>
                    <li>• Чат поддержки</li>
                  </ul>
                </div>
                <div className="ml-4">
                  <button
                    onClick={() => updatePreference('functional', !preferences.functional)}
                    className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                      preferences.functional ? 'bg-indigo-600' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                      preferences.functional ? 'transform translate-x-6' : 'transform translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>

              {/* Marketing Cookies */}
              <div className="flex items-start justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Cookie className="w-4 h-4 text-purple-600" />
                    <h4 className="font-medium text-gray-900">Маркетинговые cookies</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    Используются для отслеживания посетителей на разных сайтах 
                    с намерением показывать релевантную рекламу.
                  </p>
                  <ul className="text-xs text-gray-500 mt-2 ml-4">
                    <li>• Персонализированная реклама</li>
                    <li>• Ретаргетинг</li>
                    <li>• Социальные медиа интеграции</li>
                  </ul>
                </div>
                <div className="ml-4">
                  <button
                    onClick={() => updatePreference('marketing', !preferences.marketing)}
                    className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                      preferences.marketing ? 'bg-purple-600' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                      preferences.marketing ? 'transform translate-x-6' : 'transform translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={acceptSelected}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex-1"
              >
                Сохранить настройки
              </button>
              <button
                onClick={acceptAll}
                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex-1"
              >
                Принять все
              </button>
            </div>

            <div className="mt-4 text-center">
              <Link 
                to="/privacy" 
                className="text-sm text-blue-600 hover:text-blue-700 underline"
              >
                Подробнее в политике конфиденциальности
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CookieBanner;