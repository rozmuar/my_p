-- Скрипт для назначения супер админа через базу данных PostgreSQL
-- Выполнить в pgAdmin или через psql

-- 1. Посмотреть всех пользователей
SELECT id, name, email, role, "isActive", "createdAt" FROM users ORDER BY "createdAt";

-- 2. Назначить супер админа по email (замените на нужный email)
UPDATE users 
SET role = 'superAdmin' 
WHERE email = 'your-email@example.com';

-- 3. Проверить изменения
SELECT id, name, email, role FROM users WHERE role = 'superAdmin';

-- 4. Альтернативно: назначить первого пользователя супер админом
UPDATE users 
SET role = 'superAdmin' 
WHERE id = (
  SELECT id FROM users 
  ORDER BY "createdAt" 
  LIMIT 1
);

-- 5. Показать структуру таблицы users
\d users;

-- 6. Проверить все доступные роли
SELECT DISTINCT role FROM users;

-- 7. Активировать пользователя если он неактивен
UPDATE users 
SET "isActive" = true 
WHERE email = 'your-email@example.com';