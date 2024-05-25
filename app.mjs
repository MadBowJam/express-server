import express from 'express';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import cookieParser from 'cookie-parser';
import favicon from 'serve-favicon';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const usersFolder = path.join(__dirname, 'users');
const usersFilePath = path.join(usersFolder, 'user.json');

const app = express();
const PORT = 3000;
const secretKey = 'your_secret_key'; // Використовуйте реальний секретний ключ

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
    const { username, password } = req.body;
    const newUser = { username, password: bcrypt.hashSync(password, 10) };
    
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
        
        // Перевірка, чи існує користувач з таким username
        const userExists = users.some(user => user.username === username);
        if (userExists) {
            return res.status(400).send('User already exists.');
        }
        
        // Додавання нового користувача до списку
        users.push(newUser);
        
        // Запис оновленого списку користувачів назад у файл
        fs.writeFile(usersFilePath, JSON.stringify(users), (err) => {
            if (err) throw err;
            
            // Створення JWT та збереження у cookies
            const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
            res.cookie('token', token, { httpOnly: true });
            res.status(201).send('User registered successfully.');
        });
    });
});

// Вхід
app.get('/login', (req, res) => {
    res.render(path.join(__dirname, 'views-pug', 'login.pug'));
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    fs.readFile(usersFilePath, (err, data) => {
        if (err) throw err;
        
        let users = [];
        try {
            users = JSON.parse(data);
            if (!Array.isArray(users)) throw new Error();
        } catch {
            users = [];
        }
        
        // Перевірка користувача
        const user = users.find(u => u.username === username);
        if (user && bcrypt.compareSync(password, user.password)) {
            const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
            res.cookie('token', token, { httpOnly: true });
            res.send('Login successful.');
        } else {
            res.status(401).send('Invalid username or password.');
        }
    });
});

// Мідлвар для перевірки JWT
const authenticateJWT = (req, res, next) => {
    const token = req.cookies.token;
    if (token) {
        jwt.verify(token, secretKey, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

// Захищений маршрут
app.get('/protected', authenticateJWT, (req, res) => {
    res.send('This is a protected route.');
});

// Профіль користувача
app.get('/profile', authenticateJWT, (req, res) => {
    const { username } = req.user;
    fs.readFile(usersFilePath, (err, data) => {
        if (err) throw err;
        
        let users = [];
        try {
            users = JSON.parse(data);
            if (!Array.isArray(users)) throw new Error();
        } catch {
            users = [];
        }
        
        const user = users.find(u => u.username === username);
        if (user) {
            res.json({ username: user.username });
        } else {
            res.status(404).send('User not found.');
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
