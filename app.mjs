import express from 'express';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;

// Маршрути Pug
app.get('/users', (req, res) => {
    const users = [
        { name: 'John Doe', email: 'john@example.com' },
        { name: 'Jane Smith', email: 'jane@example.com' }
    ];
    res.render(path.join(__dirname, 'views-pug', 'users.pug'), { users });
});

app.get('/users/:userId', (req, res) => {
    const user = { name: 'John Doe', email: 'john@example.com' };
    res.render(path.join(__dirname, 'views-pug', 'user-details.pug'), { user });
});

// Маршрути EJS
app.get('/articles', (req, res) => {
    const articles = [
        { title: 'Article 1', author: 'Author 1', content: 'Content of article 1' },
        { title: 'Article 2', author: 'Author 2', content: 'Content of article 2' }
    ];
    res.render(path.join(__dirname, 'views-ejs', 'articles.ejs'), { articles });
});

app.get('/articles/:articleId', (req, res) => {
    const article = { title: 'Article 1', author: 'Author 1', content: 'Content of article 1' };
    res.render(path.join(__dirname, 'views-ejs', 'article-details.ejs'), { article });
});

// Обробка кореневого шляху
app.get('/', (req, res) => {
    res.send('Get root route');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
