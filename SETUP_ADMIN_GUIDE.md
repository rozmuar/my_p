# 🔧 Настройка SuperAdmin - Инструкция по исправлению авторизации

## 🚨 Проблема
Если авторизация не работает, возможно в базе данных нет пользователей или SuperAdmin.

## ✅ Решение - Новые Setup Endpoints

### 1. 📊 **Проверить статус базы данных**

**URL:** `GET http://62.113.110.83:3001/api/setup/status`

**Ответ покажет:**
```json
{
  "totalUsers": 0,
  "hasSuperAdmin": false,
  "superAdmins": [],
  "allUsers": []
}
```

### 2. 🛠️ **Создать SuperAdmin**

**URL:** `POST http://62.113.110.83:3001/api/setup/create-admin`

**С дефолтными данными:**
```bash
curl -X POST http://62.113.110.83:3001/api/setup/create-admin
```

**С кастомными данными:**
```bash
curl -X POST http://62.113.110.83:3001/api/setup/create-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "mypassword123",
    "name": "Super Admin"
  }'
```

## 📋 Дефолтные данные SuperAdmin:

- **Email:** `admin@postapi.com`
- **Password:** `admin123456`
- **Name:** `PostAPI Admin`
- **Role:** `superAdmin`

## 🎯 После создания SuperAdmin:

1. ✅ Используй данные выше для авторизации
2. ✅ Заходи в `/login` и вводи email/password
3. ✅ Получишь доступ к админ-панели и всем функциям
4. ✅ Можешь создавать других пользователей

## 🔍 Swagger Documentation:
- **URL:** `http://62.113.110.83:3001/api/docs`
- **Доступ:** Только для админов (требует JWT токен)

## ⚡ Быстрый старт:

```bash
# 1. Проверить статус
curl http://62.113.110.83:3001/api/setup/status

# 2. Создать админа (если нет пользователей)
curl -X POST http://62.113.110.83:3001/api/setup/create-admin

# 3. Авторизоваться с данными:
# Email: admin@postapi.com
# Пароль: admin123456
```

## 🛡️ Безопасность:
- Setup endpoints работают БЕЗ авторизации
- Используй их ТОЛЬКО для первоначальной настройки
- После создания админа - измени пароль через настройки!