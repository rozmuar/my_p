# 📋 Server Deployment Instructions

## Шаги для деплоя на Linux сервер

### 1. Загрузка проекта на сервер

```bash
# Скачайте или загрузите весь проект на ваш сервер
# Через git (если у вас есть репозиторий):
git clone YOUR_REPO_URL postapi
cd postapi

# Или через SCP/SFTP/rsync:
# rsync -avz -e ssh ./postapi/ user@server:/path/to/postapi/
```

### 2. Автоматический деплой

```bash
# Дайте права на выполнение
chmod +x deploy.sh

# Запустите скрипт деплоя
./deploy.sh
```

Скрипт автоматически:
- ✅ Установит Docker и Docker Compose
- ✅ Настроит все зависимости  
- ✅ Запустит все сервисы
- ✅ Настроит фаервол
- ✅ Проверит работоспособность

### 3. Проверка работы

После успешного деплоя:

```bash
# Проверьте статус контейнеров
docker-compose ps

# Посмотрите логи
docker-compose logs -f
```

**Ваш PostAPI будет доступен по адресам:**

- 🌐 **Frontend**: http://YOUR_SERVER_IP:3000
- 🔧 **Backend API**: http://YOUR_SERVER_IP:3001
- 📚 **API Docs**: http://YOUR_SERVER_IP:3001/api/docs

### 4. Управление сервисом

```bash
# Остановить
docker-compose down

# Перезапустить
docker-compose restart

# Обновить и перезапустить
git pull
docker-compose build --no-cache
docker-compose up -d
```

### 5. В случае проблем

```bash
# Посмотреть логи конкретного сервиса
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres

# Полная переустановка
docker-compose down -v
docker-compose up -d --build
```

---

**🎉 Готово! Ваш современный аналог Postman запущен на сервере!**

Теперь вы можете:
- ✅ Тестировать HTTP запросы  
- ✅ Создавать коллекции
- ✅ Генерировать код
- ✅ Работать в команде