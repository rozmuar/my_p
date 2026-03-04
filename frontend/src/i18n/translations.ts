export interface Translations {
  // Common
  save: string;
  cancel: string;
  delete: string;
  edit: string;
  create: string;
  search: string;
  loading: string;
  
  // Collections
  collections: string;
  newCollection: string;
  createCollection: string;
  noCollections: string;
  noCollectionsFound: string;
  searchCollections: string;
  requests: string;
  noRequests: string;
  
  // Requests  
  newRequest: string;
  method: string;
  url: string;
  headers: string;
  body: string;
  params: string;
  auth: string;
  response: string;
  history: string;
  send: string;
  
  // Menu items
  rename: string;
  duplicate: string;
  share: string;
  shared: string;
  addRequest: string;
  
  // Admin
  adminPanel: string;
  users: string;
  userManagement: string;
  email: string;
  role: string;
  status: string;
  actions: string;
  active: string;
  inactive: string;
  admin: string;
  user: string;
  superAdmin: string;
  
  // Auth
  login: string;
  logout: string;
  register: string;
  password: string;
  confirmPassword: string;
  name: string;
  
  // Environments
  environments: string;
  noEnvironment: string;
  
  // Messages
  enterName: string;
  nameRequired: string;
  collectionCreated: string;
  requestCreated: string;
  error: string;
}

export const ruTranslations: Translations = {
  // Common
  save: 'Сохранить',
  cancel: 'Отмена',
  delete: 'Удалить',
  edit: 'Редактировать',
  create: 'Создать',
  search: 'Поиск',
  loading: 'Загрузка...',
  
  // Collections
  collections: 'Коллекции',
  newCollection: 'Новая коллекция',
  createCollection: 'Создать коллекцию',
  noCollections: 'Пока нет коллекций',
  noCollectionsFound: 'Коллекции не найдены',
  searchCollections: 'Поиск коллекций...',
  requests: 'запросов',
  noRequests: 'Пока нет запросов',
  
  // Requests
  newRequest: 'Новый запрос',
  method: 'Метод',
  url: 'URL',
  headers: 'Заголовки',
  body: 'Тело',
  params: 'Параметры',
  auth: 'Авторизация',
  response: 'Ответ',
  history: 'История',
  send: 'Отправить',
  
  // Menu items
  rename: 'Переименовать',
  duplicate: 'Дублировать',
  share: 'Поделиться',
  shared: '• Общая',
  addRequest: 'Добавить запрос',
  
  // Admin
  adminPanel: 'Панель администратора',
  users: 'Пользователи',
  userManagement: 'Управление пользователями',
  email: 'Email',
  role: 'Роль',
  status: 'Статус',
  actions: 'Действия',
  active: 'Активен',
  inactive: 'Неактивен',
  admin: 'Администратор',
  user: 'Пользователь',
  superAdmin: 'Супер админ',
  
  // Auth
  login: 'Войти',
  logout: 'Выйти',
  register: 'Зарегистрироваться',
  password: 'Пароль',
  confirmPassword: 'Подтвердите пароль',
  name: 'Имя',
  
  // Environments
  environments: 'Окружения',
  noEnvironment: 'Нет окружения',
  
  // Messages
  enterName: 'Введите название',
  nameRequired: 'Название обязательно',
  collectionCreated: 'Коллекция создана',
  requestCreated: 'Запрос создан',
  error: 'Ошибка',
};

export const enTranslations: Translations = {
  // Common
  save: 'Save',
  cancel: 'Cancel', 
  delete: 'Delete',
  edit: 'Edit',
  create: 'Create',
  search: 'Search',
  loading: 'Loading...',
  
  // Collections
  collections: 'Collections',
  newCollection: 'New Collection',
  createCollection: 'Create Collection',
  noCollections: 'No collections yet',
  noCollectionsFound: 'No collections found',
  searchCollections: 'Search collections...',
  requests: 'requests',
  noRequests: 'No requests yet',
  
  // Requests
  newRequest: 'New Request',
  method: 'Method',
  url: 'URL', 
  headers: 'Headers',
  body: 'Body',
  params: 'Params',
  auth: 'Auth',
  response: 'Response',
  history: 'History',
  send: 'Send',
  
  // Menu items
  rename: 'Rename',
  duplicate: 'Duplicate',
  share: 'Share',
  shared: '• Shared',
  addRequest: 'Add request',
  
  // Admin
  adminPanel: 'Admin Panel',
  users: 'Users',
  userManagement: 'User Management',
  email: 'Email',
  role: 'Role',
  status: 'Status', 
  actions: 'Actions',
  active: 'Active',
  inactive: 'Inactive',
  admin: 'Admin',
  user: 'User',
  superAdmin: 'Super Admin',
  
  // Auth
  login: 'Login',
  logout: 'Logout',
  register: 'Register',
  password: 'Password',
  confirmPassword: 'Confirm Password',
  name: 'Name',
  
  // Environments
  environments: 'Environments',
  noEnvironment: 'No Environment',
  
  // Messages
  enterName: 'Enter name',
  nameRequired: 'Name is required',
  collectionCreated: 'Collection created',
  requestCreated: 'Request created',
  error: 'Error',
};