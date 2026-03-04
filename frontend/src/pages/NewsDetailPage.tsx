import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { OutputData } from '@editorjs/editorjs';
import {
  ArrowLeft,
  Calendar,
  User,
  Eye,
  Clock,
  Share2,
  Bookmark,
  Tag,
  Heart,
  MessageCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import EditorJSComponent from '../components/EditorJS/EditorJSComponent';

interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  content: OutputData;
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
    avatar?: string;
    bio?: string;
  };
  tags: string[];
  views: number;
  reading_time: number;
  likes: number;
  comments_count: number;
}

interface RelatedArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image?: string;
  published_at: Date;
  reading_time: number;
  views: number;
}

const NewsDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<RelatedArticle[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Заглушка данных - в реальном приложении будет запрос к API
  const mockArticle: NewsArticle = {
    id: '1',
    title: 'Обновление API PostAPI v2.0: Новые возможности и улучшенная производительность',
    slug: 'postapi-v2-update',
    content: {
      blocks: [
        {
          type: 'paragraph',
          data: {
            text: 'Мы рады представить долгожданное обновление PostAPI v2.0! Это крупнейшее обновление за всю историю платформы, которое включает множество новых функций, улучшений производительности и исправлений.'
          }
        },
        {
          type: 'header',
          data: {
            text: 'Основные новые возможности',
            level: 2
          }
        },
        {
          type: 'list',
          data: {
            style: 'unordered',
            items: [
              'Новая система аутентификации с поддержкой OAuth 2.0 и JWT',
              'Расширенные возможности тестирования API с автоматической генерацией тестов',
              'Улучшенный интерфейс с темной темой и настраиваемыми панелями',
              'Поддержка GraphQL запросов и WebSocket соединений',
              'Интеграция с популярными системами CI/CD'
            ]
          }
        },
        {
          type: 'quote',
          data: {
            text: 'Наша цель - сделать тестирование API максимально простым и эффективным для разработчиков по всему миру.',
            caption: 'Анна Иванова, Product Manager PostAPI'
          }
        },
        {
          type: 'header',
          data: {
            text: 'Улучшения производительности',
            level: 2
          }
        },
        {
          type: 'paragraph',
          data: {
            text: 'Мы значительно оптимизировали работу платформы. Теперь запросы выполняются на 40% быстрее, а интерфейс загружается в 2 раза быстрее благодаря новой архитектуре и оптимизации кода.'
          }
        },
        {
          type: 'image',
          data: {
            file: {
              url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
            },
            caption: 'Новый интерфейс PostAPI v2.0',
            withBorder: true,
            withBackground: false,
            stretched: false
          }
        },
        {
          type: 'header',
          data: {
            text: 'Как начать использовать v2.0',
            level: 2
          }
        },
        {
          type: 'list',
          data: {
            style: 'ordered',
            items: [
              'Войдите в свой аккаунт PostAPI',
              'Нажмите на уведомление об обновлении в правом верхнем углу',
              'Следуйте инструкциям мастера миграции',
              'Изучите новые возможности в интерактивном туре',
              'Начните использовать новые функции!'
            ]
          }
        },
        {
          type: 'paragraph',
          data: {
            text: 'Мы также подготовили подробную документацию по миграции и видео-туториалы для быстрого освоения новых возможностей. Если у вас возникнут вопросы, наша команда поддержки всегда готова помочь.'
          }
        },
        {
          type: 'delimiter',
          data: {}
        },
        {
          type: 'paragraph',
          data: {
            text: 'Спасибо всем, кто участвовал в бета-тестировании и предоставлял обратную связь. Ваши отзывы помогли нам создать лучшую версию PostAPI!'
          }
        }
      ]
    },
    excerpt: 'Мы рады представить крупное обновление нашего API с множеством новых функций, включая улучшенную систему аутентификации, расширенные возможности тестирования и значительное повышение производительности.',
    featured_image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    status: 'published',
    published_at: new Date('2024-03-01'),
    created_at: new Date('2024-02-28'),
    updated_at: new Date('2024-03-01'),
    author: {
      id: 'admin1',
      name: 'Анна Иванова',
      email: 'anna@postapi.com',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      bio: 'Product Manager в PostAPI. Специализируется на UX/UI дизайне и разработке API инструментов.'
    },
    tags: ['обновления', 'api', 'новые функции', 'производительность'],
    views: 1247,
    reading_time: 5,
    likes: 89,
    comments_count: 23
  };

  const mockRelatedArticles: RelatedArticle[] = [
    {
      id: '2',
      title: 'Интеграция с популярными CI/CD системами',
      slug: 'cicd-integration',
      excerpt: 'Автоматизируйте тестирование API в ваших CI/CD пайплайнах с помощью новых инструментов интеграции.',
      featured_image: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      published_at: new Date('2024-02-25'),
      reading_time: 8,
      views: 892
    },
    {
      id: '3',
      title: 'Новый визуальный редактор для документации API',
      slug: 'visual-docs-editor', 
      excerpt: 'Представляем революционный подход к созданию документации API.',
      featured_image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      published_at: new Date('2024-02-20'),
      reading_time: 6,
      views: 654
    },
    {
      id: '4',
      title: 'Безопасность API: Лучшие практики и новые инструменты',
      slug: 'api-security-best-practices',
      excerpt: 'Полное руководство по обеспечению безопасности API с примерами реализации в PostAPI.',
      featured_image: 'https://images.unsplash.com/photo-1555949963-f638c6ea246c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      published_at: new Date('2024-02-15'),
      reading_time: 12,
      views: 434
    }
  ];

  useEffect(() => {
    // Имитация загрузки данных
    setIsLoading(true);
    setTimeout(() => {
      if (slug === mockArticle.slug) {
        setArticle(mockArticle);
        setRelatedArticles(mockRelatedArticles);
      }
      setIsLoading(false);
    }, 500);
  }, [slug]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    // В реальном приложении здесь будет API запрос
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // В реальном приложении здесь будет API запрос
  };

  const handleShare = async () => {
    if (navigator.share && article) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Sharing failed:', error);
      }
    } else {
      // Fallback - копирование ссылки в буфер обмена
      navigator.clipboard.writeText(window.location.href);
      alert('Ссылка скопирована в буфер обмена!');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка статьи...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Статья не найдена</h1>
          <p className="text-gray-600 mb-6">Запрошенная статья не существует или была удалена.</p>
          <Link 
            to="/news" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Вернуться к новостям
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Навигация */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Link 
              to="/news" 
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>К новостям</span>
            </Link>

            <div className="flex items-center space-x-4">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  isLiked 
                    ? 'bg-red-100 text-red-700' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                <span>{article.likes + (isLiked ? 1 : 0)}</span>
              </button>

              <button
                onClick={handleBookmark}
                className={`p-2 rounded-full transition-colors ${
                  isBookmarked 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>

              <button
                onClick={handleShare}
                className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Основной контент */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="mb-8">
          {/* Теги */}
          <div className="flex flex-wrap gap-2 mb-4">
            {article.tags.map((tag) => (
              <Link
                key={tag}
                to={`/news?tag=${encodeURIComponent(tag)}`}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>

          {/* Заголовок */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
            {article.title}
          </h1>

          {/* Краткое описание */}
          <p className="text-xl text-gray-600 leading-relaxed mb-8">
            {article.excerpt}
          </p>

          {/* Метаинформация */}
          <div className="flex items-center justify-between border-t border-b border-gray-200 py-4">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                {article.author.avatar && (
                  <img
                    src={article.author.avatar}
                    alt={article.author.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
                <div>
                  <div className="font-semibold text-gray-900">{article.author.name}</div>
                  <div className="text-sm text-gray-600">{formatDate(article.published_at!)}</div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {article.reading_time} мин
              </span>
              <span className="flex items-center">
                <Eye className="w-4 h-4 mr-1" />
                {article.views}
              </span>
              <span className="flex items-center">
                <MessageCircle className="w-4 h-4 mr-1" />
                {article.comments_count}
              </span>
            </div>
          </div>
        </header>

        {/* Главное изображение */}
        {article.featured_image && (
          <div className="mb-8">
            <img
              src={article.featured_image}
              alt=""
              className="w-full h-64 md:h-80 object-cover rounded-2xl shadow-lg"
            />
          </div>
        )}

        {/* Содержимое статьи */}
        <div className="prose prose-lg max-w-none mb-12">
          <EditorJSComponent
            data={article.content}
            readOnly={true}
          />
        </div>

        {/* Информация об авторе */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Об авторе</h3>
          <div className="flex items-start space-x-4">
            {article.author.avatar && (
              <img
                src={article.author.avatar}
                alt={article.author.name}
                className="w-16 h-16 rounded-full object-cover"
              />
            )}
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-1">{article.author.name}</h4>
              {article.author.bio && (
                <p className="text-gray-600 mb-2">{article.author.bio}</p>
              )}
              <a
                href={`mailto:${article.author.email}`}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                {article.author.email}
              </a>
            </div>
          </div>
        </div>

        {/* Действия */}
        <div className="flex items-center justify-between border-t border-gray-200 pt-8 mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                isLiked 
                  ? 'bg-red-50 text-red-700 border border-red-200' 
                  : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              <span>{isLiked ? 'Понравилось' : 'Нравится'}</span>
              <span className="text-sm">({article.likes + (isLiked ? 1 : 0)})</span>
            </button>

            <button
              onClick={handleBookmark}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                isBookmarked 
                  ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                  : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
              <span>{isBookmarked ? 'Сохранено' : 'Сохранить'}</span>
            </button>
          </div>

          <button
            onClick={handleShare}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <Share2 className="w-5 h-5" />
            <span>Поделиться</span>
          </button>
        </div>
      </article>

      {/* Похожие статьи */}
      {relatedArticles.length > 0 && (
        <section className="bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Читайте также</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedArticles.map((relatedArticle) => (
                <Link
                  key={relatedArticle.id}
                  to={`/news/${relatedArticle.slug}`}
                  className="group"
                >
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                    {relatedArticle.featured_image && (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={relatedArticle.featured_image}
                          alt=""
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    
                    <div className="p-6">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {relatedArticle.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {relatedArticle.excerpt}
                      </p>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(relatedArticle.published_at)}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {relatedArticle.reading_time} мин
                        </span>
                        <span className="flex items-center">
                          <Eye className="w-3 h-3 mr-1" />
                          {relatedArticle.views}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Навигация между статьями */}
      <div className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link
              to="/news/previous-article"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors group"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm">Предыдущая статья</span>
            </Link>
            
            <Link
              to="/news"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
            >
              Все новости
            </Link>

            <Link
              to="/news/next-article"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors group"
            >
              <span className="text-sm">Следующая статья</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetailPage;