import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { OutputData } from '@editorjs/editorjs';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Trash2, 
  Calendar, 
  User, 
  FileText, 
  Settings,
  Plus,
  Edit3,
  Globe,
  Archive,
  Lock,
  Crown,
  AlertTriangle
} from 'lucide-react';
import EditorJSComponent from '../components/EditorJS/EditorJSComponent';
import { useAuth } from '../services/auth';

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
  };
  tags: string[];
  views: number;
}

const NewsAdminPage = () => {
  const { user, hasPermission, quickLoginAs, isAuthenticated } = useAuth();
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editorData, setEditorData] = useState<OutputData>({ blocks: [] });
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [status, setStatus] = useState<'draft' | 'published' | 'archived'>('draft');
  const [tags, setTags] = useState<string>('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'published' | 'archived'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const editorRef = useRef(null);

  // Проверка разрешений при загрузке компонента
  useEffect(() => {
    if (!isAuthenticated || !hasPermission('write_news')) {
      // Редирект на главную страницу или показ сообщения
      console.log('Access denied: insufficient permissions');
    }
  }, [isAuthenticated, hasPermission]);

  // Заглушка данных для демонстрации
  const mockArticles: NewsArticle[] = [
    {
      id: '1',
      title: 'Обновление API PostAPI v2.0',
      slug: 'postapi-v2-update',
      content: {
        blocks: [
          {
            type: 'paragraph',
            data: {
              text: 'Мы рады представить новую версию нашего API...'
            }
          }
        ]
      },
      excerpt: 'Крупное обновление с новыми возможностями и улучшенной производительностью',
      featured_image: 'https://via.placeholder.com/800x400',
      status: 'published',
      published_at: new Date('2024-03-01'),
      created_at: new Date('2024-02-28'),
      updated_at: new Date('2024-03-01'),
      author: {
        id: 'admin1',
        name: 'Анна Иванова',
        email: 'anna@postapi.com'
      },
      tags: ['обновления', 'api', 'новые функции'],
      views: 1247
    },
    {
      id: '2',
      title: 'Интеграция с популярными CI/CD системами',
      slug: 'cicd-integration',
      content: {
        blocks: [
          {
            type: 'paragraph',
            data: {
              text: 'Теперь вы можете легко интегрировать PostAPI...'
            }
          }
        ]
      },
      excerpt: 'Автоматизируйте тестирование API в ваших CI/CD пайплайнах',
      status: 'draft',
      created_at: new Date('2024-03-02'),
      updated_at: new Date('2024-03-02'),
      author: {
        id: 'admin2',
        name: 'Дмитрий Петров',
        email: 'dmitry@postapi.com'
      },
      tags: ['интеграция', 'ci/cd', 'автоматизация'],
      views: 0
    }
  ];

  const [articles, setArticles] = useState<NewsArticle[]>(mockArticles);

  // Если пользователь не авторизован 
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <Lock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Вход в систему</h1>
          <p className="text-gray-600 mb-6">
            Для доступа к панели управления новостями необходимо войти в систему
          </p>
          <div className="space-y-3">
            <Link
              to="/login"
              className="block w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Войти в систему
            </Link>
            <div className="text-sm text-gray-500">
              Для демонстрации:
            </div>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => quickLoginAs('superAdmin')}
                className="bg-purple-100 text-purple-800 px-3 py-2 rounded text-sm hover:bg-purple-200 transition-colors"
              >
                <Crown className="w-4 h-4 inline mr-1" />
                Войти как Super Admin
              </button>
              <button
                onClick={() => quickLoginAs('admin')}
                className="bg-green-100 text-green-800 px-3 py-2 rounded text-sm hover:bg-green-200 transition-colors"
              >
                <Settings className="w-4 h-4 inline mr-1" />
                Войти как Admin
              </button>
              <button
                onClick={() => quickLoginAs('user')}
                className="bg-gray-100 text-gray-800 px-3 py-2 rounded text-sm hover:bg-gray-200 transition-colors"
              >
                <User className="w-4 h-4 inline mr-1" />
                Войти как User
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Если пользователь не имеет прав на управление новостями
  if (!hasPermission('write_news')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Доступ запрещен</h1>
          <p className="text-gray-600 mb-4">
            У вас недостаточно прав для управления новостями. 
            Эта функция доступна только пользователям с ролью Super Admin.
          </p>
          {user && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-gray-600">
                <strong>Текущий пользователь:</strong> {user.name}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Роль:</strong> {user.role === 'superAdmin' ? 'Super Admin' : user.role === 'admin' ? 'Admin' : 'User'}
              </p>
            </div>
          )}
          <div className="space-y-3">
            <Link
              to="/news"
              className="block w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Просмотреть новости
            </Link>
            <button
              onClick={() => quickLoginAs('super_admin')}
              className="w-full bg-purple-100 text-purple-800 px-4 py-3 rounded-lg hover:bg-purple-200 transition-colors font-medium"
            >
              <Crown className="w-4 h-4 inline mr-2" />
              Войти как Super Admin (демо)
            </button>
          </div>
        </div>
      </div>
    );
  }

  const startNewArticle = () => {
    setSelectedArticle(null);
    setIsEditing(true);
    setTitle('');
    setExcerpt('');
    setEditorData({ blocks: [] });
    setStatus('draft');
    setTags('');
    setFeaturedImage('');
  };

  const editArticle = (article: NewsArticle) => {
    setSelectedArticle(article);
    setIsEditing(true);
    setTitle(article.title);
    setExcerpt(article.excerpt);
    setEditorData(article.content);
    setStatus(article.status);
    setTags(article.tags.join(', '));
    setFeaturedImage(article.featured_image || '');
  };

  const saveArticle = () => {
    if (!title.trim() || !excerpt.trim()) {
      alert('Заполните заголовок и краткое описание');
      return;
    }

    const now = new Date();
    const articleData: Partial<NewsArticle> = {
      title: title.trim(),
      slug: title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-zа-я0-9-]/gi, ''),
      content: editorData,
      excerpt: excerpt.trim(),
      featured_image: featuredImage.trim() || undefined,
      status,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      updated_at: now,
    };

    if (selectedArticle) {
      // Обновление существующей статьи
      const updatedArticles = articles.map(article =>
        article.id === selectedArticle.id
          ? { ...article, ...articleData }
          : article
      );
      setArticles(updatedArticles);
    } else {
      // Создание новой статьи
      const newArticle: NewsArticle = {
        id: Math.random().toString(36).substr(2, 9),
        ...articleData,
        created_at: now,
        published_at: status === 'published' ? now : undefined,
        author: {
          id: 'current-user',
          name: 'Текущий пользователь',
          email: 'user@example.com'
        },
        views: 0
      } as NewsArticle;

      setArticles([newArticle, ...articles]);
    }

    setIsEditing(false);
    setSelectedArticle(null);
  };

  const deleteArticle = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить эту статью?')) {
      setArticles(articles.filter(article => article.id !== id));
      if (selectedArticle?.id === id) {
        setSelectedArticle(null);
        setIsEditing(false);
      }
    }
  };

  const filteredArticles = articles.filter(article => {
    const matchesStatus = filterStatus === 'all' || article.status === filterStatus;
    const matchesSearch = searchTerm === '' || 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
        return <Globe className="w-4 h-4" />;
      case 'draft':
        return <Edit3 className="w-4 h-4" />;
      case 'archived':
        return <Archive className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-4 h-4" />
                <span>Назад в панель</span>
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                <FileText className="w-7 h-7 text-blue-600" />
                <span>Управление новостями</span>
              </h1>
            </div>
            <button
              onClick={startNewArticle}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Новая статья</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Левая панель - список статей */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Статьи</h3>
                
                {/* Поиск */}
                <input
                  type="text"
                  placeholder="Поиск статей..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
                />

                {/* Фильтры */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => setFilterStatus('all')}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      filterStatus === 'all' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Все
                  </button>
                  <button
                    onClick={() => setFilterStatus('published')}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      filterStatus === 'published' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Опубликованные
                  </button>
                  <button
                    onClick={() => setFilterStatus('draft')}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      filterStatus === 'draft' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Черновики
                  </button>
                </div>
              </div>

              {/* Список статей */}
              <div className="max-h-96 overflow-y-auto">
                {filteredArticles.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>Статей не найдено</p>
                  </div>
                ) : (
                  filteredArticles.map((article) => (
                    <div
                      key={article.id}
                      className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                        selectedArticle?.id === article.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedArticle(article)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">
                            {article.title}
                          </h4>
                          <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                            {article.excerpt}
                          </p>
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(article.status)}`}>
                              {getStatusIcon(article.status)}
                              <span className="capitalize">{article.status === 'draft' ? 'черновик' : article.status === 'published' ? 'опубликовано' : 'архив'}</span>
                            </span>
                            <span className="text-xs text-gray-500 flex items-center">
                              <Eye className="w-3 h-3 mr-1" />
                              {article.views}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-1 ml-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              editArticle(article);
                            }}
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteArticle(article.id);
                            }}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Правая панель - редактор или просмотр */}
          <div className="lg:col-span-2">
            {isEditing ? (
              /* Режим редактирования */
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {selectedArticle ? 'Редактировать статью' : 'Новая статья'}
                    </h3>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Отмена
                      </button>
                      <button
                        onClick={saveArticle}
                        className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        <span>Сохранить</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Заголовок */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Заголовок *
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Введите заголовок статьи..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Краткое описание */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Краткое описание *
                    </label>
                    <textarea
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      placeholder="Введите краткое описание статьи..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Настройки */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Статус
                      </label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as any)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="draft">Черновик</option>
                        <option value="published">Опубликовано</option>
                        <option value="archived">Архив</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Теги (через запятую)
                      </label>
                      <input
                        type="text"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="api, обновления, новости"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Изображение */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL главного изображения
                    </label>
                    <input
                      type="url"
                      value={featuredImage}
                      onChange={(e) => setFeaturedImage(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Редактор содержимого */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Содержимое статьи
                    </label>
                    <EditorJSComponent
                      ref={editorRef}
                      data={editorData}
                      onChange={setEditorData}
                      placeholder="Начните писать вашу статью..."
                    />
                  </div>
                </div>
              </div>
            ) : selectedArticle ? (
              /* Режим просмотра */
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {selectedArticle.title}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {selectedArticle.author.name}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {selectedArticle.created_at.toLocaleDateString('ru-RU')}
                        </span>
                        <span className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          {selectedArticle.views} просмотров
                        </span>
                        <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedArticle.status)}`}>
                          {getStatusIcon(selectedArticle.status)}
                          <span className="capitalize">
                            {selectedArticle.status === 'draft' ? 'черновик' : selectedArticle.status === 'published' ? 'опубликовано' : 'архив'}
                          </span>
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => editArticle(selectedArticle)}
                      className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>Редактировать</span>
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  {/* Изображение */}
                  {selectedArticle.featured_image && (
                    <img 
                      src={selectedArticle.featured_image} 
                      alt=""
                      className="w-full h-64 object-cover rounded-lg mb-6"
                    />
                  )}

                  {/* Краткое описание */}
                  <div className="bg-blue-50 p-4 rounded-lg mb-6">
                    <p className="text-blue-800 font-medium">{selectedArticle.excerpt}</p>
                  </div>

                  {/* Теги */}
                  {selectedArticle.tags.length > 0 && (
                    <div className="mb-6">
                      <div className="flex flex-wrap gap-2">
                        {selectedArticle.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Содержимое */}
                  <div className="prose max-w-none">
                    <EditorJSComponent
                      data={selectedArticle.content}
                      readOnly={true}
                    />
                  </div>
                </div>
              </div>
            ) : (
              /* Состояние по умолчанию */
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Выберите статью для просмотра</h3>
                <p className="text-gray-600 mb-6">
                  Выберите статью из списка слева или создайте новую статью
                </p>
                <button
                  onClick={startNewArticle}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors mx-auto"
                >
                  <Plus className="w-5 h-5" />
                  <span>Создать новую статью</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsAdminPage;