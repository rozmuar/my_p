# Защищенный доступ к Swagger документации

## 🔐 Требования для доступа

**Swagger документация доступна только администраторам!**

### Необходимые права:
- ✅ `admin` - Администратор
- ✅ `superAdmin` - Супер администратор
- ❌ `user` - Обычный пользователь (доступ запрещен)

---

## 🚀 Как получить доступ к Swagger

### 1. Получите JWT токен администратора

**Авторизуйтесь как администратор:**
```bash
curl -X POST "http://62.113.110.83:3001/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "your-admin-password"
  }'
```

**Ответ:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123",
    "email": "admin@example.com",
    "name": "Admin User",
    "role": "admin"
  }
}
```

### 2. Откройте Swagger с JWT токеном

**Способ A: В браузере с модификацией запросов**
1. Установите расширение ModHeader (Chrome/Firefox)
2. Добавьте заголовок:
   - **Name:** `Authorization`
   - **Value:** `Bearer eyJhbGciOiJIUzI1NiIsInR5dCI6IkpXVCJ9...`
3. Перейдите: http://62.113.110.83:3001/api/docs

**Способ B: Через curl/Postman**
```bash
curl "http://62.113.110.83:3001/api/docs" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5dCI6IkpXVCJ9..."
```

**Способ C: В Swagger UI после открытия**
1. Сначала получите доступ к Swagger (любым способом выше)
2. В интерфейсе Swagger нажмите кнопку **"Authorize"** 🔒
3. Введите токен: `eyJhbGciOiJIUzI1NiIsInR5dCI6IkpXVCJ9...`
4. Нажмите **"Authorize"**
5. Теперь можете тестировать API прямо в Swagger!

---

## 🚨 Ошибки доступа

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Доступ к документации запрещен. Требуется авторизация.",
  "error": "Unauthorized",
  "hint": "Добавьте заголовок: Authorization: Bearer <your-admin-jwt-token>"
}
```
**Решение:** Добавьте JWT токен в заголовок Authorization

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "Доступ к документации запрещен. Требуются права администратора.",
  "error": "Forbidden",
  "yourRole": "user",
  "requiredRoles": ["admin", "superAdmin"]
}
```
**Решение:** Получите права администратора от супер админа

### 401 Token Error
```json
{
  "statusCode": 401,
  "message": "Недействительный или истекший токен.",
  "error": "Unauthorized",
  "jwtError": "jwt expired"
}
```
**Решение:** Получите новый JWT токен через `/api/auth/login`

---

## 🛠️ Для разработчиков

### Проверка в коде:
```javascript
// Проверить доступ к Swagger
const response = await fetch('/api/docs', {
  headers: {
    'Authorization': `Bearer ${adminJwtToken}`
  }
});

if (response.status === 403) {
  console.log('Нет прав администратора для доступа к Swagger');
}
```

### Получение токена админа программно:
```javascript
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    email: 'admin@example.com',
    password: 'admin-password'
  })
});

const { access_token } = await loginResponse.json();
// Используйте access_token для доступа к Swagger
```

---

## 💡 Полезные ссылки

- **Backend:** http://62.113.110.83:3001/api
- **Swagger:** http://62.113.110.83:3001/api/docs (Admin only)
- **Health:** http://62.113.110.83:3001/api/health
- **Frontend:** http://62.113.110.83:8080

**Помните: Swagger теперь защищен и требует административных прав!** 🔒