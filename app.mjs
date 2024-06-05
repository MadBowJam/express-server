import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import cookieParser from 'cookie-parser';
import favicon from 'serve-favicon';
import fs from 'fs';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import session from 'express-session';
import { connectDB, getDB } from './config.js'; // Імпорт з'єднання з MongoDB
import { findUserByEmail, createUser, findUserById, insertManyUsers, updateOneUser, updateManyUsers, replaceOneUser, deleteOneUser, deleteManyUsers, findUsers } from './models/User.js'; // Імпорт функцій з файлу User.js
import flash from 'express-flash';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const usersFolder = path.join(__dirname, 'users');
const usersFilePath = path.join(usersFolder, 'user.json');

const app = express();
const PORT = 3000;
const secretKey = 'your_secret_key'; // Використовуйте реальний секретний ключ
const sessionSecret = 'your_session_secret'; // Використовуйте реальний секретний ключ для сесій

// Підключення до бази даних
connectDB();

// Перевірка чи існує тека users, якщо ні - створюємо
if (!fs.existsSync(usersFolder)) {
    fs.mkdirSync(usersFolder);
}

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));

// Налаштування сесій
app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Використовуйте secure cookies у виробничому середовищі
        maxAge: 1000 * 60 * 60 * 24 // 1 день
    }
}));

app.use(flash());

// Passport.js налаштування
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await findUserByEmail(email);
        if (!user) {
            return done(null, false, { message: 'Incorrect email.' });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return done(null, false, { message: 'Incorrect password.' });
        }
        
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user._id); // Замінено user.id на user._id
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await findUserById(id); // Використовуйте знайдення користувача за його id
        done(null, user);
    } catch (err) {
        done(err);
    }
});



// Маршрут для збереження улюбленої теми
app.get('/set-theme/:theme', (req, res) => {
    const { theme } = req.params;
    res.cookie('theme', theme, { maxAge: 900000, httpOnly: true });
    res.redirect('back');
});

// Маршрут для отримання списку користувачів з MongoDB
app.get('/users', async (req, res) => {
    try {
        const db = getDB();
        const users = await db.collection('users').find().toArray();
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Маршрути Pug
// app.get('/users', (req, res) => {
//     const users = [
//         { name: 'John Doe', email: 'john@example.com' },
//         { name: 'Jane Smith', email: 'jane@example.com' }
//     ];
//     res.render(path.join(__dirname, 'views-pug', 'users.pug'), { users, theme: req.cookies.theme || 'light' });
// });

app.get('/users/:userId', (req, res) => {
    const user = { name: 'John Doe', email: 'john@example.com' };
    res.render(path.join(__dirname, 'views-pug', 'user-details.pug'), { user, theme: req.cookies.theme || 'light' });
});

// Маршрути EJS
app.get('/articles', (req, res) => {
    const articles = [
        { title: 'Article 1', author: 'Author 1', content: 'Content of article 1' },
        { title: 'Article 2', author: 'Author 2', content: 'Content of article 2' }
    ];
    res.render(path.join(__dirname, 'views-ejs', 'articles.ejs'), { articles, theme: req.cookies.theme || 'light' });
});

app.get('/articles/:articleId', (req, res) => {
    const article = { title: 'Article 1', author: 'Author 1', content: 'Content of article 1' };
    res.render(path.join(__dirname, 'views-ejs', 'article-details.ejs'), { article, theme: req.cookies.theme || 'light' });
});

// Обробка кореневого шляху
app.get('/', (req, res) => {
    res.send('Get root route');
});

app.get('/register', (req, res) => {
    res.render(path.join(__dirname, 'views-pug', 'register.pug'));
});

// Реєстрація
app.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        const userExists = await findUserByEmail(email);
        if (userExists) {
            return res.status(400).send('User already exists.');
        }
        
        const newUser = await createUser({
            email,
            password: await bcrypt.hash(password, 10),
        });
        
        res.status(201).send('User registered successfully.');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Вхід
app.get('/login', (req, res) => {
    res.render(path.join(__dirname, 'views-pug', 'login.pug'), { message: req.flash('error') });
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/profile', // Перенаправлення при успішному вході
    failureRedirect: '/login', // Перенаправлення при невдачі
    failureFlash: true // Включити flash messages у випадку невдалих спроб
}));


// Вихід
app.post('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.session.destroy((err) => {
            if (err) {
                return next(err);
            }
            res.clearCookie('connect.sid');
            res.redirect('/login');
        });
    });
});

// Мідлвар для перевірки автентифікації
const isAuthenticated = (req, res, next) => {
    if (req.method === 'POST' && !req.isAuthenticated()) {
        res.redirect('/login');
    } else {
        return next();
    }
};


// Профіль користувача
app.get('/profile', isAuthenticated, (req, res) => {
    res.send(`
        <h1>Welcome to your profile, ${req.user ? req.user.email : 'Guest'}</h1>
        <form action="/logout" method="POST">
            <button type="submit">Logout</button>
        </form>
    `);
});


// Захищений маршрут
app.get('/protected', isAuthenticated, (req, res) => {
    res.send('This is a protected route');
});

// Додавання одного користувача
app.post('/users', async (req, res) => {
    try {
        const userData = req.body;
        const newUser = await createUser(userData);
        res.status(201).json(newUser);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Додавання багатьох користувачів
app.post('/users/many', async (req, res) => {
    try {
        const userDataArray = req.body;
        
        // Перевірка, чи userDataArray є масивом
        if (!Array.isArray(userDataArray)) {
            return res.status(400).send('Invalid input, expected an array of user data.');
        }
        
        const insertedIds = await insertManyUsers(userDataArray);
        res.status(201).json({ insertedIds });
    } catch (err) {
        console.error("Error inserting many users:", err);
        res.status(500).send('Server Error');
    }
});

// Оновлення одного користувача
app.put('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const modifiedCount = await updateOneUser(id, updateData);
        if (modifiedCount > 0) {
            res.status(200).send('User updated successfully.');
        } else {
            res.status(404).send('User not found.');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Оновлення багатьох користувачів
app.put('/users/', async (req, res) => {
    const updateDataArray = req.body;
    
    if (!Array.isArray(updateDataArray)) {
        return res.status(400).send('Invalid input, expected an array of user data.');
    }
    
    try {
        const results = await updateManyUsers(updateDataArray);
        res.status(200).json(results);
    } catch (err) {
        console.error("Error updating many users:", err);
        res.status(500).send('Server Error');
    }
});

// Заміна одного користувача
app.put('/users/replace/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const newData = req.body;
        const modifiedCount = await replaceOneUser(id, newData);
        if (modifiedCount > 0) {
            res.status(200).send('User replaced successfully.');
        } else {
            res.status(404).send('User not found.');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Видалення одного користувача
app.delete('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCount = await deleteOneUser(id);
        if (deletedCount > 0) {
            res.status(200).send('User deleted successfully.');
        } else {
            res.status(404).send('User not found.');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Видалення багатьох користувачів
app.delete('/users', async (req, res) => {
    const { ids } = req.body;
    
    if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).send('Invalid input, expected an array of user ids.');
    }
    
    try {
        const result = await deleteManyUsers(ids);
        res.status(200).json(result);
    } catch (err) {
        console.error("Error deleting users:", err);
        res.status(500).send('Server Error');
    }
});

// Пошук користувачів з проекцією
app.get('/users', async (req, res) => {
    try {
        const filter = req.query.filter ? JSON.parse(req.query.filter) : {};
        const projection = req.query.projection ? JSON.parse(req.query.projection) : {};
        const users = await findUsers(filter, projection);
        res.status(200).json(users);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
