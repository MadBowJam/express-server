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

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const usersFolder = path.join(__dirname, 'users');
const usersFilePath = path.join(usersFolder, 'user.json');

const app = express();
const PORT = 3000;
const secretKey = 'your_secret_key'; // Використовуйте реальний секретний ключ
const sessionSecret = 'your_session_secret'; // Використовуйте реальний секретний ключ для сесій

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

// Passport.js налаштування
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, (email, password, done) => {
    fs.readFile(usersFilePath, (err, data) => {
        if (err) return done(err);
        
        let users = [];
        try {
            users = JSON.parse(data);
            if (!Array.isArray(users)) throw new Error();
        } catch {
            return done(null, false, { message: 'User not found.' });
        }
        
        const user = users.find(u => u.email === email);
        if (!user) {
            return done(null, false, { message: 'Incorrect email.' });
        }
        
        if (!bcrypt.compareSync(password, user.password)) {
            return done(null, false, { message: 'Incorrect password.' });
        }
        
        return done(null, user);
    });
}));

passport.serializeUser((user, done) => {
    done(null, user.email);
});

passport.deserializeUser((email, done) => {
    fs.readFile(usersFilePath, (err, data) => {
        if (err) return done(err);
        
        let users = [];
        try {
            users = JSON.parse(data);
            if (!Array.isArray(users)) throw new Error();
        } catch {
            return done(null, false);
        }
        
        const user = users.find(u => u.email === email);
        if (user) {
            done(null, user);
        } else {
            done(null, false);
        }
    });
});

// Маршрут для збереження улюбленої теми
app.get('/set-theme/:theme', (req, res) => {
    const { theme } = req.params;
    res.cookie('theme', theme, { maxAge: 900000, httpOnly: true });
    res.redirect('back');
});

// Маршрути Pug
app.get('/users', (req, res) => {
    const users = [
        { name: 'John Doe', email: 'john@example.com' },
        { name: 'Jane Smith', email: 'jane@example.com' }
    ];
    res.render(path.join(__dirname, 'views-pug', 'users.pug'), { users, theme: req.cookies.theme || 'light' });
});

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
app.post('/register', (req, res) => {
    const { email, password } = req.body;
    const newUser = { email, password: bcrypt.hashSync(password, 10) };
    
    fs.readFile(usersFilePath, (err, data) => {
        if (err && err.code !== 'ENOENT') throw err;
        
        let users = [];
        if (!err) {
            try {
                users = JSON.parse(data);
                if (!Array.isArray(users)) throw new Error();
            } catch {
                users = [];
            }
        }
        
        // Перевірка, чи існує користувач з таким email
        const userExists = users.some(user => user.email === email);
        if (userExists) {
            return res.status(400).send('User already exists.');
        }
        
        // Додавання нового користувача до списку
        users.push(newUser);
        
        // Запис оновленого списку користувачів назад у файл
        fs.writeFile(usersFilePath, JSON.stringify(users), (err) => {
            if (err) throw err;
            res.status(201).send('User registered successfully.');
        });
    });
});

// Вхід
app.get('/login', (req, res) => {
    res.render(path.join(__dirname, 'views-pug', 'login.pug'));
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/login'
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
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
};

// Захищений маршрут
app.get('/protected', isAuthenticated, (req, res) => {
    res.send('This is a protected route.');
});

// Профіль користувача
app.get('/profile', isAuthenticated, (req, res) => {
    res.send(`
        <h1>Welcome to your profile, ${req.user.email}</h1>
        <form action="/logout" method="POST">
            <button type="submit">Logout</button>
        </form>
    `);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
