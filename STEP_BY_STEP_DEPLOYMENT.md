# 📋 Подробная инструкция по развертыванию PostAPI

## Шаг 2: Клонирование и запуск приложения

### 📥 2.1 Клонирование репозитория

```bash
# Переходим в домашнюю директорию или выбираем место для проекта
cd ~/

# Клонируем проект с GitHub (SSH)
git clone git@github.com:rozmuar/my_p.git postapi

# Или используем HTTPS если SSH не настроен
git clone https://github.com/rozmuar/my_p.git postapi

# Переходим в директорию проекта
cd postapi
```

**💡 Что происходит:**
- Создается папка `postapi` с проектом
- Скачиваются все файлы (95 файлов, ~250KB)
- Подготавливается рабочая среда

### ⚙️ 2.2 Настройка окружения

```bash
# Создаем файл с переменными окружения для backend
cp backend/.env.example backend/.env

# Редактируем настройки базы данных и безопасности
nano backend/.env
```

**🔧 Важные настройки в backend/.env:**
```bash
# Database Configuration
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=ИЗМЕНИТЕ_НА_НАДЕЖНЫЙ_ПАРОЛЬ
DB_NAME=postapi

# JWT Configuration (ОБЯЗАТЕЛЬНО ИЗМЕНИТЕ!)
JWT_SECRET=ваш-супер-секретный-ключ-минимум-32-символа
SESSION_SECRET=другой-секретный-ключ-для-сессий

# Redis Configuration
REDIS_HOST=redis
REDIS_PORT=6379

# Application
NODE_ENV=production
PORT=3001
CORS_ORIGIN=http://ВАШ_IP_СЕРВЕРА:3000
API_PREFIX=api

# File uploads
FILE_UPLOAD_DEST=./uploads
MAX_FILE_SIZE=10485760
```

### 🔐 2.3 Настройка паролей в Docker Compose

```bash
# Редактируем docker-compose.yml
nano docker-compose.yml
```

**Найдите и измените:**
```yaml
postgres:
  environment:
    POSTGRES_PASSWORD: НОВЫЙ_НАДЕЖНЫЙ_ПАРОЛЬ  # Измените!
    POSTGRES_USER: postgres
    POSTGRES_DB: postapi
```

### 🚀 2.4 Запуск сервисов

```bash
# Убеждаемся что Docker запущен
sudo systemctl status docker

# Собираем и запускаем все сервисы
docker-compose up -d --build

# Проверяем статус запуска
docker-compose ps
```

**📊 Ожидаемый вывод:**
```
NAME               IMAGE              COMMAND                  STATUS
postapi-backend    my_p-backend       "docker-entrypoint.s…"   Up 30 seconds (healthy)
postapi-frontend   my_p-frontend      "/docker-entrypoint.…"   Up 30 seconds  
postapi-db         postgres:15-alpine "docker-entrypoint.s…"   Up 30 seconds (healthy)
postapi-redis      redis:7-alpine     "docker-entrypoint.s…"   Up 30 seconds (healthy)
```

### 📋 2.5 Проверка логов

```bash
# Просматриваем логи всех сервисов
docker-compose logs -f

# Или отдельные сервисы
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres
```

**✅ Признаки успешного запуска:**
- Backend: `"Nest application successfully started"`
- Frontend: `"Serving files from /usr/share/nginx/html"`
- PostgreSQL: `"database system is ready to accept connections"`
- Redis: `"Ready to accept connections"`

### 🌐 2.6 Доступ к приложению

**Откройте в браузере:**

1. **Frontend (Главная страница):** 
   ```
   http://ВАШ_IP_СЕРВЕРА:3000
   ```
   - Лендинг страница
   - Регистрация/вход
   - API тестирование

2. **Backend API:**
   ```
   http://ВАШ_IP_СЕРВЕРА:3001/api
   ```

3. **API Документация (Swagger):**
   ```
   http://ВАШ_IP_СЕРВЕРА:3001/api/docs
   ```
   - Интерактивная API документация
   - Тестирование endpoints

### 🔍 2.7 Тестирование функций

**🏠 Главная страница:**
- [ ] Лендинг загружается
- [ ] Cookie баннер появляется
- [ ] Навигация работает
- [ ] Pricing секция отображается

**👤 Авторизация:**
- [ ] Регистрация нового пользователя
- [ ] Вход в систему  
- [ ] JWT токены генерируются

**📰 Новости (Super Admin):**
- [ ] Вход в admin панель
- [ ] Создание новости через EditorJS
- [ ] Публикация новости
- [ ] Просмотр в публичном разделе

### 🛠️ 2.8 Устранение проблем

**Если сервисы не запускаются:**
```bash
# Проверяем ошибки
docker-compose logs

# Пересобираем без кэша
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

**Если порты заняты:**
```bash
# Проверяем занятые порты
sudo netstat -tulpn | grep :3000
sudo netstat -tulpn | grep :3001

# Изменяем порты в docker-compose.yml если нужно
```

**Проблемы с базой данных:**
```bash
# Подключение к PostgreSQL
docker-compose exec postgres psql -U postgres -d postapi

# Проверка таблиц
\dt

# Создание super admin пользователя (в базе)
INSERT INTO users (email, username, password, role, is_verified) 
VALUES ('admin@example.com', 'admin', '$hashedPassword', 'super_admin', true);
```

### 🔄 2.9 Обновление приложения

```bash
# Получить обновления
git pull origin master

# Пересобрать и перезапустить
docker-compose build
docker-compose up -d

# Проверить обновления
docker-compose ps
```

### 📊 2.10 Мониторинг

```bash
# Использование ресурсов
docker stats

# Размер образов
docker images

# Логи в реальном времени
docker-compose logs -f --tail 100
```

**🎉 Готово!** Ваш PostAPI сервер запущен и готов к работе!

**📱 Следующие шаги:**
- Настроить домен и SSL (шаг 3)
- Настроить Nginx reverse proxy  
- Настроить автоматические бэкапы
- Настроить мониторинг и алерты