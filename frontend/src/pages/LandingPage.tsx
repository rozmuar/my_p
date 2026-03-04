import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Play, 
  Shield, 
  Zap, 
  Users, 
  Code, 
  Globe,
  Check,
  Star,
  ArrowRight,
  Github,
  Twitter,
  Mail,
  ChevronDown
} from 'lucide-react';
import CookieBanner from '@/components/CookieBanner';

const LandingPage = () => {
  const [activeTab, setActiveTab] = useState('features');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <CookieBanner />
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                PostAPI
              </h1>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
                Возможности
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
                Тарифы
              </a>
              <Link 
                to="/news" 
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Новости
              </Link>
              <a href="#docs" className="text-gray-600 hover:text-gray-900 transition-colors">
                Документация
              </a>
              <Link 
                to="/login" 
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Войти
              </Link>
              <Link 
                to="/register" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-200"
              >
                Начать бесплатно
              </Link>
            </nav>

            {/* Mobile menu button */}
            <button className="md:hidden p-2">
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Современный инструмент для
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {' '}тестирования API
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            PostAPI — это мощная альтернатива Postman с современным интерфейсом, 
            поддержкой команды и генерацией кода на 12 языках программирования.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link 
              to="/register" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-xl transition-all duration-300 flex items-center justify-center"
            >
              <Play className="w-5 h-5 mr-2" />
              Попробовать бесплатно
            </Link>
            <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:border-gray-400 transition-all duration-300 flex items-center justify-center">
              <Github className="w-5 h-5 mr-2" />
              Посмотреть код
            </button>
          </div>

          {/* Hero Image/Demo */}
          <div className="relative max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="ml-4 text-sm text-gray-500 font-medium">PostAPI - Тестирование API</span>
              </div>
              <div className="p-8 text-left">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-md text-sm font-medium">GET</span>
                      <span className="text-gray-600">https://api.example.com/users</span>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <pre className="text-sm text-gray-700">{`{
  "Authorization": "Bearer token...",
  "Content-Type": "application/json"
}`}</pre>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-green-600 font-medium">200 OK</span>
                      <span className="text-gray-500">156ms</span>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <pre className="text-sm text-gray-700">{`{
  "users": [
    { "id": 1, "name": "Иван" },
    { "id": 2, "name": "Мария" }
  ]
}`}</pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Всё что нужно для работы с API
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Полный набор инструментов для эффективной разработки и тестирования API
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Быстрое тестирование</h3>
              <p className="text-gray-600 leading-relaxed">
                Интуитивный интерфейс для быстрого создания и выполнения HTTP запросов. 
                Поддержка всех методов и типов аутентификации.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-xl">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                <Code className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Генерация кода</h3>
              <p className="text-gray-600 leading-relaxed">
                Автоматическая генерация кода на 12 языках программирования: 
                JavaScript, Python, PHP, Java, C#, Go и другие.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Командная работа</h3>
              <p className="text-gray-600 leading-relaxed">
                Совместная работа в реальном времени. Делитесь коллекциями, 
                комментируйте запросы и работайте синхронно с командой.
              </p>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-8 rounded-xl">
              <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Безопасность</h3>
              <p className="text-gray-600 leading-relaxed">
                Шифрование данных, безопасное хранение токенов и полное соответствие 
                стандартам безопасности GDPR.
              </p>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 p-8 rounded-xl">
              <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Множественные среды</h3>
              <p className="text-gray-600 leading-relaxed">
                Управление переменными окружения для разработки, тестирования 
                и продакшна. Легкое переключение между средами.
              </p>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-8 rounded-xl">
              <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Автоматическое тестирование</h3>
              <p className="text-gray-600 leading-relaxed">
                Создавайте автоматические тесты с утверждениями, запускайте 
                коллекции в CI/CD пайплайнах.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-4">
            Готовы ускорить разработку API?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Присоединитесь к тысячам разработчиков, которые уже используют PostAPI
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register" 
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-all duration-300 flex items-center justify-center"
            >
              <Play className="w-5 h-5 mr-2" />
              Начать бесплатно
            </Link>
            <a 
              href="#docs" 
              className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/10 transition-all duration-300 flex items-center justify-center"
            >
              Документация
              <ArrowRight className="w-5 h-5 ml-2" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold">PostAPI</h3>
              </div>
              <p className="text-gray-400 mb-4">
                Современный инструмент для тестирования API с поддержкой команды.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <Github className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Продукт</h4>
              <ul className="space-y-3">
                <li><a href="#features" className="text-gray-400 hover:text-white">Возможности</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-white">Тарифы</a></li>
                <li>
                  <Link to="/news" className="text-gray-400 hover:text-white">
                    Новости и обновления
                  </Link>
                </li>
                <li><a href="#" className="text-gray-400 hover:text-white">Скачать</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Поддержка</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white">Документация</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">API справка</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Сообщество</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Связаться с нами</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Юридическое</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/privacy" className="text-gray-400 hover:text-white">
                    Политика конфиденциальности
                  </Link>
                </li>
                <li><a href="#" className="text-gray-400 hover:text-white">Условия использования</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Cookie файлы</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Лицензия</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 PostAPI. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;