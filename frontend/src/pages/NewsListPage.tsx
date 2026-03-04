import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  User, 
  Eye, 
  ArrowRight, 
  Search, 
  Tag,
  TrendingUp,
  Clock,
  Globe
} from 'lucide-react';

interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image?: string;
  status: 'draft' | 'published' | 'archived';
  published_at?: Date;
  created_at: Date;
  updated_at: Date;
  author: {
    id: string;
    name: string;
    email: string;
  };
  tags: string[];
  views: number;
  reading_time: number; // в минутах
}

const NewsListPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'trending'>('latest');

  // Заглушка данных - в реальном приложении будет запрос к API
  const mockArticles: NewsArticle[] = [
    {
      id: '1',
      title: 'Обновление API PostAPI v2.0: Новые возможности и улучшенная производительность',
      slug: 'postapi-v2-update',
      excerpt: 'Мы рады представить крупное обновление нашего API с множеством новых функций, включая улучшенную систему аутентификации, расширенные возможности тестирования и значительное повышение производительности.',
      featured_image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      status: 'published',
      published_at: new Date('2024-03-01'),
      created_at: new Date('2024-02-28'),
      updated_at: new Date('2024-03-01'),
      author: {
        id: 'admin1',
        name: 'Анна Иванова',
        email: 'anna@postapi.com'
      },
      tags: ['обновления', 'api', 'новые функции', 'производительность'],
      views: 1247,
      reading_time: 5
    },
    {
      id: '2',
      title: 'Интеграция с популярными CI/CD системами',
      slug: 'cicd-integration',
      excerpt: 'Автоматизируйте тестирование API в ваших CI/CD пайплайнах с помощью новых инструментов интеграции. Поддержка GitHub Actions, GitLab CI, Jenkins и других популярных систем.',
      featured_image: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      status: 'published',
      published_at: new Date('2024-02-25'),
      created_at: new Date('2024-02-24'),
      updated_at: new Date('2024-02-25'),
      author: {
        id: 'admin2',
        name: 'Дмитрий Петров',
        email: 'dmitry@postapi.com'
      },
      tags: ['интеграция', 'ci/cd', 'автоматизация', 'devops'],
      views: 892,
      reading_time: 8
    },
    {
      id: '3',
      title: 'Новый визуальный редактор для документации API',
      slug: 'visual-docs-editor',
      excerpt: 'Представляем революционный подход к созданию документации API. Наш новый визуальный редактор делает процесс создания и поддержки документации простым и интуитивным.',
      featured_image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      status: 'published',
      published_at: new Date('2024-02-20'),
      created_at: new Date('2024-02-19'),
      updated_at: new Date('2024-02-20'),
      author: {
        id: 'admin3',
        name: 'Елена Смирнова',
        email: 'elena@postapi.com'
      },
      tags: ['документация', 'редактор', 'ui/ux', 'продуктивность'],
      views: 654,
      reading_time: 6
    },
    {
      id: '4',
      title: 'Безопасность API: Лучшие практики и новые инструменты',
      slug: 'api-security-best-practices',
      excerpt: 'Полное руководство по обеспечению безопасности API с примерами реализации в PostAPI. Аутентификация, авторизация, защита от атак и мониторинг безопасности.',
      featured_image: 'https://images.unsplash.com/photo-1555949963-f638c6ea246c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      status: 'published',
      published_at: new Date('2024-02-15'),
      created_at: new Date('2024-02-14'),
      updated_at: new Date('2024-02-15'),
      author: {
        id: 'admin1',
        name: 'Анна Иванова',
        email: 'anna@postapi.com'
      },
      tags: ['безопасность', 'аутентификация', 'лучшие практики'],
      views: 434,
      reading_time: 12
    },
    {
      id: '5',
      title: 'Команды и совместная работа в PostAPI',
      slug: 'team-collaboration',
      excerpt: 'Новые возможности для командной разработки: общие рабочие пространства, ролевая модель доступа, комментарии в реальном времени и синхронизация между участниками команды.',
      featured_image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      status: 'published',
      published_at: new Date('2024-02-10'),
      created_at: new Date('2024-02-09'),
      updated_at: new Date('2024-02-10'),
      author: {
        id: 'admin2',
        name: 'Дмитрий Петров',
        email: 'dmitry@postapi.com'
      },
      tags: ['командная работа', 'совместная разработка', 'управление проектами'],
      views: 765,
      reading_time: 7
    }
  ];

  // Получаем только опубликованные статьи
  const publishedArticles = mockArticles.filter(article => article.status === 'published');

  // Получаем все теги
  const allTags = Array.from(new Set(publishedArticles.flatMap(article => article.tags)));

  // Фильтрация статей
  const filteredArticles = publishedArticles.filter(article => {
    const matchesSearch = searchTerm === '' || 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.author.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTag = selectedTag === null || article.tags.includes(selectedTag);
    
    return matchesSearch && matchesTag;
  });

  // Сортировка статей
  const sortedArticles = [...filteredArticles].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.views - a.views;
      case 'trending':
        // Простая формула трендов: больше просмотров за последнее время
        const daysSinceA = (Date.now() - a.published_at!.getTime()) / (1000 * 60 * 60 * 24);
        const daysSinceB = (Date.now() - b.published_at!.getTime()) / (1000 * 60 * 60 * 24);
        const scoreA = a.views / Math.max(daysSinceA, 1);
        const scoreB = b.views / Math.max(daysSinceB, 1);
        return scoreB - scoreA;
      case 'latest':
      default:
        return b.published_at!.getTime() - a.published_at!.getTime();
    }
  });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getFeaturedArticle = () => {
    return sortedArticles[0] || null;
  };

  const getRegularArticles = () => {
    return sortedArticles.slice(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Новости и обновления PostAPI
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Следите за последними новостями, обновлениями и полезными статьями 
              о разработке и тестировании API
            </p>
          </div>

          {/* Поиск и фильтры */}
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Поиск статей..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-4">
              {/* Сортировка */}
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Сортировать:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="text-sm border border-gray-300 rounded-md py-1 px-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="latest">Последние</option>
                  <option value="popular">Популярные</option>
                  <option value="trending">Тренды</option>
                </select>
              </div>

              {/* Теги */}
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Теги:</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedTag(null)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedTag === null 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Все
                  </button>
                  {allTags.slice(0, 6).map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(tag)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        selectedTag === tag 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {sortedArticles.length === 0 ? (
          <div className="text-center py-12">
            <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Статей не найдено
            </h3>
            <p className="text-gray-600">
              Попробуйте изменить поисковый запрос или фильтры
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Главная статья */}
            {getFeaturedArticle() && (
              <div className="relative">
                <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium z-10">
                  Рекомендуем
                </div>
                <Link to={`/news/${getFeaturedArticle()!.slug}`}>
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group">
                    {getFeaturedArticle()!.featured_image && (
                      <div className="relative h-64 md:h-80 overflow-hidden">
                        <img 
                          src={getFeaturedArticle()!.featured_image} 
                          alt=""
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                        <div className="absolute bottom-6 left-6 right-6 text-white">
                          <h2 className="text-2xl md:text-3xl font-bold mb-3">
                            {getFeaturedArticle()!.title}
                          </h2>
                          <p className="text-lg opacity-90 line-clamp-2">
                            {getFeaturedArticle()!.excerpt}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    <div className="p-6">
                      <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <span className="flex items-center">
                          <User className="w-4 h-4 mr-2" />
                          {getFeaturedArticle()!.author.name}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          {formatDate(getFeaturedArticle()!.published_at!)}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          {getFeaturedArticle()!.reading_time} мин чтения
                        </span>
                        <span className="flex items-center">
                          <Eye className="w-4 h-4 mr-2" />
                          {getFeaturedArticle()!.views}
                        </span>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {getFeaturedArticle()!.tags.slice(0, 4).map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="mt-4 flex items-center text-blue-600 font-medium group-hover:text-blue-700">
                        <span>Читать полностью</span>
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Сетка остальных статей */}
            {getRegularArticles().length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {getRegularArticles().map((article) => (
                  <Link 
                    key={article.id} 
                    to={`/news/${article.slug}`}
                    className="group"
                  >
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow border border-gray-100">
                      {article.featured_image && (
                        <div className="relative h-48 overflow-hidden">
                          <img 
                            src={article.featured_image} 
                            alt=""
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {article.title}
                        </h3>
                        
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {article.excerpt}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {article.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span className="flex items-center">
                            <User className="w-3 h-3 mr-1" />
                            {article.author.name}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {formatDate(article.published_at!)}
                          </span>
                          <span className="flex items-center">
                            <Eye className="w-3 h-3 mr-1" />
                            {article.views}
                          </span>
                        </div>

                        <div className="mt-4 flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700">
                          <span>Читать далее</span>
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Пагинация (заглушка) */}
            {sortedArticles.length > 9 && (
              <div className="flex justify-center">
                <nav className="flex items-center space-x-2">
                  <button className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                    Предыдущая
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md">
                    1
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                    2
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                    3
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                    Следующая
                  </button>
                </nav>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Newsletter подписка */}
      <section className="bg-blue-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Не пропускайте обновления
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Подпишитесь на наши новости и получайте уведомления о новых функциях и обновлениях
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Ваш email"
              className="flex-1 px-4 py-3 rounded-lg border border-transparent focus:ring-2 focus:ring-white focus:border-white"
            />
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
              Подписаться
            </button>
          </div>
          <p className="text-sm text-blue-200 mt-4">
            Никакого спама. Отписаться можно в любое время.
          </p>
        </div>
      </section>
    </div>
  );
};

export default NewsListPage;