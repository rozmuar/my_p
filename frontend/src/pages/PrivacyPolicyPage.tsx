import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Eye, Cookie, Database, Lock, Users, Globe } from 'lucide-react';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Вернуться на главную</span>
            </Link>
          </div>
          <div className="mt-4">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
              <Shield className="w-8 h-8 text-blue-600" />
              <span>Политика конфиденциальности</span>
            </h1>
            <p className="text-gray-600 mt-2">
              Последнее обновление: 3 марта 2026 г.
            </p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          
          {/* Introduction */}
          <div className="bg-blue-50 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-semibold text-blue-900 mb-3">Наше обязательство по защите ваших данных</h2>
            <p className="text-blue-800 leading-relaxed">
              В PostAPI мы серьезно относимся к защите ваших персональных данных. Эта политика 
              конфиденциальности объясняет, какую информацию мы собираем, как мы ее используем 
              и какие права у вас есть в отношении ваших данных.
            </p>
          </div>

          {/* Table of Contents */}
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Содержание</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <a href="#information-we-collect" className="text-blue-600 hover:text-blue-700 text-sm">
                1. Информация, которую мы собираем
              </a>
              <a href="#how-we-use" className="text-blue-600 hover:text-blue-700 text-sm">
                2. Как мы используем информацию
              </a>
              <a href="#information-sharing" className="text-blue-600 hover:text-blue-700 text-sm">
                3. Передача информации
              </a>
              <a href="#data-security" className="text-blue-600 hover:text-blue-700 text-sm">
                4. Безопасность данных
              </a>
              <a href="#cookies" className="text-blue-600 hover:text-blue-700 text-sm">
                5. Использование cookies
              </a>
              <a href="#your-rights" className="text-blue-600 hover:text-blue-700 text-sm">
                6. Ваши права
              </a>
              <a href="#data-retention" className="text-blue-600 hover:text-blue-700 text-sm">
                7. Хранение данных
              </a>
              <a href="#contact-us" className="text-blue-600 hover:text-blue-700 text-sm">
                8. Связаться с нами
              </a>
            </div>
          </div>

          {/* Section 1 */}
          <section id="information-we-collect" className="mb-12">
            <div className="flex items-center space-x-3 mb-4">
              <Database className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">1. Информация, которую мы собираем</h2>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Информация, которую вы предоставляете</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
              <li><strong>Данные аккаунта:</strong> имя, адрес электронной почты, пароль</li>
              <li><strong>Профиль пользователя:</strong> фотография профиля, биография, настройки</li>
              <li><strong>Контент:</strong> API коллекции, запросы, комментарии, документация</li>
              <li><strong>Платежная информация:</strong> данные для обработки платежей (обрабатываются третьими лицами)</li>
              <li><strong>Коммуникации:</strong> сообщения в службу поддержки, отзывы</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">Информация, собираемая автоматически</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li><strong>Данные использования:</strong> взаимодействие с сервисом, клики, время использования</li>
              <li><strong>Устройство и браузер:</strong> тип устройства, операционная система, версия браузера</li>
              <li><strong>Сетевая информация:</strong> IP-адрес, местоположение (приблизительное)</li>
              <li><strong>Производительность:</strong> время загрузки, ошибки, метрики производительности</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section id="how-we-use" className="mb-12">
            <div className="flex items-center space-x-3 mb-4">
              <Eye className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">2. Как мы используем информацию</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">Предоставление сервиса</h4>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Создание и управление аккаунтом</li>
                  <li>• Выполнение API запросов</li>
                  <li>• Синхронизация данных между устройствами</li>
                  <li>• Техническая поддержка</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Улучшение продукта</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Анализ использования функций</li>
                  <li>• Исправление ошибок и багов</li>
                  <li>• Разработка новых возможностей</li>
                  <li>• Оптимизация производительности</li>
                </ul>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-2">Коммуникация</h4>
                <ul className="text-sm text-purple-800 space-y-1">
                  <li>• Уведомления о сервисе</li>
                  <li>• Обновления продукта</li>
                  <li>• Отвеьы на обращения</li>
                  <li>• Маркетинговые материалы (по согласию)</li>
                </ul>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-900 mb-2">Безопасность</h4>
                <ul className="text-sm text-orange-800 space-y-1">
                  <li>• Предотвращение мошенничества</li>
                  <li>• Защита от спама и злоупотреблений</li>
                  <li>• Соблюдение законных требований</li>
                  <li>• Аудит безопасности</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section id="information-sharing" className="mb-12">
            <div className="flex items-center space-x-3 mb-4">
              <Users className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">3. Передача информации третьим лицам</h2>
            </div>

            <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6">
              <h4 className="font-semibold text-red-900 mb-2">Важно:</h4>
              <p className="text-red-800 text-sm">
                Мы никогда не продаем ваши персональные данные третьим лицам. 
                Передача данных происходит только в следующих случаях:
              </p>
            </div>

            <div className="space-y-6">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-gray-900 mb-2">С вашего согласия</h4>
                <p className="text-gray-700 text-sm">
                  Когда вы явно разрешаете нам поделиться информацией, например, 
                  при совместной работе над проектами.
                </p>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold text-gray-900 mb-2">Поставщики услуг</h4>
                <p className="text-gray-700 text-sm mb-2">
                  Мы работаем с надежными партнерами для предоставления сервиса:
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Облачное хранилище (AWS, Google Cloud)</li>
                  <li>• Обработка платежей (Stripe)</li>
                  <li>• Аналитика (Google Analytics)</li>
                  <li>• Служба поддержки (Intercom)</li>
                </ul>
              </div>

              <div className="border-l-4 border-yellow-500 pl-4">
                <h4 className="font-semibold text-gray-900 mb-2">Юридические требования</h4>
                <p className="text-gray-700 text-sm">
                  Мы можем раскрыть информацию при наличии обоснованной веры в то, 
                  что это необходимо для соблюдения закона, судебного процесса или 
                  правительственного запроса.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section id="data-security" className="mb-12">
            <div className="flex items-center space-x-3 mb-4">
              <Lock className="w-6 h-6 text-red-600" />
              <h2 className="text-2xl font-bold text-gray-900">4. Безопасность данных</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Шифрование</h4>
                <p className="text-sm text-gray-600">
                  Все данные шифруются при передаче (TLS 1.3) и хранении (AES-256)
                </p>
              </div>

              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Lock className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Доступ</h4>
                <p className="text-sm text-gray-600">
                  Ограниченный доступ только для авторизованного персонала с 2FA
                </p>
              </div>

              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Eye className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Мониторинг</h4>
                <p className="text-sm text-gray-600">
                  Постоянный мониторинг безопасности и регулярные аудиты
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">Дополнительные меры безопасности:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                <ul className="space-y-2">
                  <li>✓ Регулярное резервное копирование</li>
                  <li>✓ Тестирование на проникновение</li>
                  <li>✓ Программа обнаружения уязвимостей</li>
                </ul>
                <ul className="space-y-2">
                  <li>✓ Использование VPN и защищенных сетей</li>
                  <li>✓ Сертификация SOC 2 Type II</li>
                  <li>✓ Соответствие GDPR и другим стандартам</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section id="cookies" className="mb-12">
            <div className="flex items-center space-x-3 mb-4">
              <Cookie className="w-6 h-6 text-orange-600" />
              <h2 className="text-2xl font-bold text-gray-900">5. Использование cookies</h2>
            </div>

            <div className="space-y-6">
              <p className="text-gray-700">
                Мы используем cookies и подобные технологии для улучшения вашего опыта использования сервиса.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-green-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2 flex items-center">
                    <Shield className="w-4 h-4 mr-2" />
                    Необходимые cookies
                  </h4>
                  <p className="text-sm text-green-800 mb-2">Обязательные для работы сайта</p>
                  <ul className="text-xs text-green-700 space-y-1">
                    <li>• Аутентификация пользователя</li>
                    <li>• Настройки безопасности</li>
                    <li>• Поддержка функциональности</li>
                  </ul>
                </div>

                <div className="border border-blue-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                    <Eye className="w-4 h-4 mr-2" />
                    Аналитические cookies
                  </h4>
                  <p className="text-sm text-blue-800 mb-2">Отслеживают использование сайта</p>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• Google Analytics</li>
                    <li>• Метрики производительности</li>
                    <li>• Анализ поведения пользователей</li>
                  </ul>
                </div>

                <div className="border border-purple-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-2 flex items-center">
                    <Globe className="w-4 h-4 mr-2" />
                    Функциональные cookies
                  </h4>
                  <p className="text-sm text-purple-800 mb-2">Расширенная функциональность</p>
                  <ul className="text-xs text-purple-700 space-y-1">
                    <li>• Настройки языка</li>
                    <li>• Персонализация интерфейса</li>
                    <li>• Региональные настройки</li>
                  </ul>
                </div>

                <div className="border border-orange-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-900 mb-2 flex items-center">
                    <Cookie className="w-4 h-4 mr-2" />
                    Маркетинговые cookies
                  </h4>
                  <p className="text-sm text-orange-800 mb-2">Персонализированная реклама</p>
                  <ul className="text-xs text-orange-700 space-y-1">
                    <li>• Ретаргетинг</li>
                    <li>• Социальные сети</li>
                    <li>• Рекламные кампании</li>
                  </ul>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Управление cookies:</strong> Вы можете управлять настройками cookies 
                  через баннер на сайте или настройки браузера. Отключение некоторых cookies 
                  может повлиять на функциональность сайта.
                </p>
              </div>
            </div>
          </section>

          {/* Section 6 */}
          <section id="your-rights" className="mb-12">
            <div className="flex items-center space-x-3 mb-4">
              <Users className="w-6 h-6 text-indigo-600" />
              <h2 className="text-2xl font-bold text-gray-900">6. Ваши права</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-indigo-900 mb-2">Право на доступ</h4>
                  <p className="text-sm text-indigo-800">
                    Получить копию ваших персональных данных, которые мы обрабатываем
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">Право на исправление</h4>
                  <p className="text-sm text-green-800">
                    Исправить неточные или неполные персональные данные
                  </p>
                </div>

                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-900 mb-2">Право на удаление</h4>
                  <p className="text-sm text-red-800">
                    Запросить удаление ваших персональных данных при определенных условиях
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-2">Право на ограничение</h4>
                  <p className="text-sm text-purple-800">
                    Ограничить обработку ваших персональных данных при определенных обстоятельствах
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Право на портабельность</h4>
                  <p className="text-sm text-blue-800">
                    Получить ваши данные в структурированном, машиночитаемом формате
                  </p>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-yellow-900 mb-2">Право возражения</h4>
                  <p className="text-sm text-yellow-800">
                    Возражать против обработки ваших данных в маркетинговых целях
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-100 p-6 rounded-lg mt-6">
              <h4 className="font-semibold text-gray-900 mb-3">Как реализовать ваши права:</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <p className="text-gray-700">Войдите в ваш аккаунт и перейдите в настройки</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <span className="text-blue-600 font-bold">2</span>
                  </div>
                  <p className="text-gray-700">Или отправьте запрос на privacy@postapi.com</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <span className="text-blue-600 font-bold">3</span>
                  </div>
                  <p className="text-gray-700">Мы ответим в течение 30 дней</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 7 */}
          <section id="data-retention" className="mb-12">
            <div className="flex items-center space-x-3 mb-4">
              <Database className="w-6 h-6 text-gray-600" />
              <h2 className="text-2xl font-bold text-gray-900">7. Сроки хранения данных</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Тип данных</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Срок хранения</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Основание</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr>
                    <td className="border border-gray-300 px-4 py-3">Данные аккаунта</td>
                    <td className="border border-gray-300 px-4 py-3">До удаления аккаунта</td>
                    <td className="border border-gray-300 px-4 py-3">Договорные обязательства</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3">API коллекции</td>
                    <td className="border border-gray-300 px-4 py-3">До удаления пользователем</td>
                    <td className="border border-gray-300 px-4 py-3">Предоставление сервиса</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3">Логи активности</td>
                    <td className="border border-gray-300 px-4 py-3">90 дней</td>
                    <td className="border border-gray-300 px-4 py-3">Безопасность и отладка</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3">Платежные данные</td>
                    <td className="border border-gray-300 px-4 py-3">7 лет</td>
                    <td className="border border-gray-300 px-4 py-3">Налоговые требования</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3">Обращения в поддержку</td>
                    <td className="border border-gray-300 px-4 py-3">3 года</td>
                    <td className="border border-gray-300 px-4 py-3">Качество сервиса</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mt-6">
              <p className="text-sm text-yellow-800">
                <strong>Примечание:</strong> После удаления аккаунта мы можем сохранить некоторые 
                анонимизированные данные для аналитических целей и улучшения сервиса.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section id="contact-us" className="mb-12">
            <div className="flex items-center space-x-3 mb-4">
              <Globe className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">8. Связаться с нами</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Общие вопросы</h4>
                <p className="text-sm text-gray-600 mb-3">
                  По всем вопросам, связанным с политикой конфиденциальности
                </p>
                <a 
                  href="mailto:privacy@postapi.com" 
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  privacy@postapi.com
                </a>
              </div>

              <div className="bg-green-50 p-6 rounded-lg text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Безопасность</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Сообщения о уязвимостях и вопросы безопасности
                </p>
                <a 
                  href="mailto:security@postapi.com" 
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  security@postapi.com
                </a>
              </div>

              <div className="bg-purple-50 p-6 rounded-lg text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Офис</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Наш главный офис для официальных запросов
                </p>
                <p className="text-sm text-gray-800">
                  ООО "PostAPI"<br />
                  г. Москва, ул. Примерная, 123<br />
                  109004, Россия
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg mt-8">
              <h4 className="font-semibold text-gray-900 mb-3">Время ответа:</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <strong className="text-gray-900">Запросы о персональных данных:</strong>
                  <p className="text-gray-600">до 30 дней согласно GDPR</p>
                </div>
                <div>
                  <strong className="text-gray-900">Вопросы безопасности:</strong>
                  <p className="text-gray-600">в течение 24 часов</p>
                </div>
                <div>
                  <strong className="text-gray-900">Общие вопросы:</strong>
                  <p className="text-gray-600">в течение 3 рабочих дней</p>
                </div>
              </div>
            </div>
          </section>

          {/* Footer note */}
          <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-3">Обновления политики</h4>
            <p className="text-sm text-blue-800 mb-4">
              Мы можем периодически обновлять эту политику конфиденциальности. О существенных 
              изменениях мы уведомим вас по электронной почте или через уведомления в сервисе 
              не менее чем за 30 дней до вступления изменений в силу.
            </p>
            <p className="text-xs text-blue-700">
              Версия 2.1 • Последнее обновление: 3 марта 2026 г. • 
              <a href="#" className="underline hover:no-underline">История изменений</a>
            </p>
          </div>

        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicyPage;