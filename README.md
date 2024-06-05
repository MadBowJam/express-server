# Для Андрія Фоменко 
## Всі тести проводились через Postman
Зпускаємо проєкт через nodem app.mjs
<br>post /users - додаємо в список користувачів нового тестового користувача
<br> /users/many - додаємо масив користувачів, наприклад
<br>`[
   {
      "email": "user1@example.com",
      "password": "password1"
   },
   {
      "email": "user2@example.com",
      "password": "password2"
   }
]`
<br>put /users/:id - оновлення даних користувача через унікальний айді, наприклад
<br>`{
   "email": "updateduser@example.com",
   "password": "newpassword"
}`
<br>put /users - оновлення даних декількох користувачів через унікальний айді, наприклад
<br>`{
   {"_id": "665b0a0741e05b3ebcd1da17", "email": "newemail1@example.com", "password": "newpassword1"},
   {"_id": "665b142b1cff5e085ac47a0d", "email": "newemail2@example.com", "password": "newpassword2"}
}`
<br>put /users/replace/:id - заміна даних перного користувача, наприклад
<br>`{
   "email": "updatedemail@example.com",
   "password": "updatedpassword"
}`
<br>delete /users/:id - видаляє користувача за унікальний айді
<br>delete /users - видаляє масив користувачів, наприклад
<br>`{
   "ids": ["665b197468e1014a694b296d", "665b19b4e5d5f8fdfd7a6dd2"]
}`
<br>get /users - віддає масив всіх користувачів


# express-server

Простий сервер, що реалізований за допомогою Node.js та Express.js. Цей сервер надає базовий API для управління користувачами та статтями.

## **Запуск**
### 1. Встановлення залежностей:
* Відкрийте термінал та перейдіть до кореневої теки проекту.
* Виконайте команду `npm install` або `yarn install` для встановлення всіх необхідних залежностей.
### 2. Запуск сервера:
* Після встановлення залежностей запустіть сервер командою `node app.mjs`.
* Сервер буде доступний за адресою http://localhost:3000.

## Опис API
### Користувачі:

#### Отримати всіх користувачів:
* Метод: GET
* Шлях: /users
* Відповідь: Повертає список всіх користувачів.

#### Отримати користувача за ID:
* Метод: GET
* Шлях: /users/:userId
* Відповідь: Повертає користувача з вказаним ID.

#### Створити нового користувача
* Метод: POST
* Шлях: /users
* Відповідь: Створює нового користувача.

#### Оновити користувача за ID
* Метод: PUT
* Шлях: /users/:userId
* Відповідь: Оновлює інформацію про користувача з вказаним ID.

#### Видалити користувача за ID
* Метод: DELETE
* Шлях: /users/:userId
* Відповідь: Видаляє користувача з вказаним ID.

### Статті

#### Отримати всі статті
Метод: GET
Шлях: /articles
Відповідь: Повертає список всіх статей.

#### Отримати статтю за ID
* Метод: GET
* Шлях: /articles/:articleId
* Відповідь: Повертає статтю з вказаним ID.

#### Створити нову статтю
* Метод: POST
* Шлях: /articles
* Відповідь: Створює нову статтю.

#### Оновити статтю за ID
* Метод: PUT
* Шлях: /articles/:articleId
* Відповідь: Оновлює інформацію про статтю з вказаним ID.

#### Видалити статтю за ID
* Метод: DELETE
* Шлях: /articles/:articleId
* Відповідь: Видаляє статтю з вказаним ID.

## Функціональність
* Реалізовано CRUD операції для користувачів та статей.
* Додані мідлвари для логування, аутентифікації, валідації та управління сесіями.
* Всі відповіді сервера текстові для спрощення інтеграції та відладки.

## Тестування
Запустіть сервер та виконайте HTTP-запити до API, використовуючи інструменти, такі як Postman або звичайний веб-браузер.



# Express Server with Pug and EJS Templating

## Опис

Цей проект представляє сервер на основі Express, який використовує два різних шаблонізатори: Pug для маршрутів користувачів та EJS для маршрутів статей. Це дозволяє легко представити дані у вигляді веб-сторінок.

## Вимоги

- Node.js (версія 12 або новіше)
- npm (версія 6 або новіше)

## Встановлення

1. Клонувати репозиторій:

   ```bash
   git clone https://github.com/your-username/express-server.git
   cd express-server
   node app.mjs
   
2. Встановити залежності `npm install` або `yarn install`
3. Запуск сервера `node app.mjs`

## Маршрути

### Маршрути для користувачів (Pug)

* GET /users: Повертає список користувачів з використанням Pug.
* GET /users/:userId: Повертає деталі конкретного користувача з використанням Pug.


### Маршрути для статей (EJS)

* GET /articles: Повертає список статей з використанням EJS.
* GET /articles/:articleId: Повертає деталі конкретної статті з використанням EJS.

Цей `README.md` файл надає повну інформацію про проект, включаючи опис, вимоги, інструкції з встановлення та запуску, маршрути, структуру проекту та приклади шаблонів. Ви можете додати більше деталей, якщо це необхідно для вашого конкретного випадку.

Впровадження тегу <link rel="icon" href="/favicon.ico">
Щоб додати піктограму сайту до всіх шаблонів Pug і EJS, ми додаємо тег <link rel="icon" href="/favicon.ico"> у розділ <head> наших шаблонів.

### Робота з файлами cookie

Ми використовуємо аналізатор файлів cookie для створення та читання файлів cookie, які зберігають бажану тему користувача.
Маршрут /set-theme/:theme приймає значення теми та зберігає його в файлах cookie.
На кожній сторінці, де використовується тема, ми перевіряємо значення файлу cookie та відображаємо відповідну тему
Це дозволяє користувачам зберігати свої улюблені теми та насолоджуватися узгодженим відображенням сторінок.


### Реєстрація: 
Маршрут /register
Користувач реєструється, і його пароль хешується перед збереженням у файл users.json. Після цього створюється JWT, який зберігається в cookie з налаштуванням httpOnly.

### Вхід: 
Маршрут /login
Користувач вводить свої облікові дані, які порівнюються з хешованими паролями у файлі users.json. Якщо дані збігаються, створюється JWT, який зберігається в cookie з налаштуванням httpOnly.

### Захищені маршрути: 
Маршрут /protected демонструє приклад захищеного маршруту. Маршрут /profile надає доступ до профілю користувача, який авторизувався.

### express-session:
Middleware express-session налаштовується з певними параметрами, такими як secret, resave, saveUninitialized та cookie.
Параметр secret використовується для підпису cookie, що дозволяє забезпечити безпеку сесій.
resave вказує, чи має сесія зберігатися у кожному запиті до сервера, навіть якщо вона не змінюється.
saveUninitialized вказує, чи має створюватися сесія для нових користувачів, які ще не автентифіковані.
Параметр cookie встановлює параметри cookie, такі як httpOnly, secure та maxAge, для зберігання ідентифікатора сесії на стороні клієнта.

### Passport:
Passport ініціалізується за допомогою middleware passport.initialize() та passport.session().
Використовується стратегія Passport для локальної аутентифікації, де користувачі вводять свою електронну адресу та пароль.
Параметри стратегії, такі як usernameField та passwordField, вказують на поля вводу для електронної адреси та пароля відповідно.
Після успішної аутентифікації Passport серіалізує та десеріалізує об'єкти користувача для збереження та відновлення сесій.

### Використання в маршрутах:
Маршрути для реєстрації, входу та виходу користувачів налаштовуються таким чином, щоб вони використовували Passport для обробки аутентифікації.
Захищені маршрути, такі як /protected та /profile, вимагають, щоб користувачі були аутентифіковані перед доступом до них, що забезпечується за допомогою middleware isAuthenticated.

### MongoDB Atlas

- Використовується для зберігання даних користувачів.
- Інтегровано за допомогою бібліотеки Mongoose.
- Модель `User` використовується для взаємодії з колекцією користувачів у MongoDB.