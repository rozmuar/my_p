# 🔧 Диагностика автентификации - PostAPI

## 🚨 Если авторизация не работает

### 1. 📊 **Проверь статус базы данных**

**URL:** `GET http://62.113.110.83:3001/api/setup/status`

```bash
curl http://62.113.110.83:3001/api/setup/status
```

## ✅ **Решения проблем:**

### **Если есть пользователи, но нет SuperAdmin:**

1. **Проверь статус:**
```bash
curl http://62.113.110.83:3001/api/setup/status
```

2. **Если `needsFix: true`, назначь первого пользователя SuperAdmin:**
```bash
curl -X POST http://62.113.110.83:3001/api/setup/promote-first-user \
  -H "Content-Type: application/json" \
  -d '{"confirmEmail": "ваш@email.com"}'
```

### **Если `totalUsers: 0`:**
1. 🚀 **Зарегистрируй первого пользователя**
2. 📱 Иди на `http://62.113.110.83:8080/register`
3. ✅ **Первый пользователь автоматически станет SuperAdmin!**

## 🔒 **Безопасность назначения админа:**
- ✅ Работает **только с первым пользователем** в системе
- ✅ Требует **подтверждение email** первого пользователя  
- ✅ **Одноразовое** назначение (если уже админ - откажет)
- ✅ Нельзя назначить произвольного пользователя

## 🔍 **Пример ответа статуса:**
```json
{
  "totalUsers": 1,
  "hasSuperAdmin": false,
  "firstUser": {
    "id": "uuid",
    "email": "user@example.com", 
    "role": "user"
  },
  "firstUserLogic": {
    "needsFix": true
  }
}
```

## 🚀 **Быстрое исправление для уже зарегистрированных:**

```bash
# 1. Узнай свой email из статуса
curl http://62.113.110.83:3001/api/setup/status

# 2. Назначь себя админом (используй email из ответа выше)
curl -X POST http://62.113.110.83:3001/api/setup/promote-first-user \
  -H "Content-Type: application/json" \
  -d '{"confirmEmail": "твой@email.com"}'

# 3. Теперь можешь логиниться как SuperAdmin!
```