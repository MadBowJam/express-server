// import dotenv from 'dotenv';
// dotenv.config();
//
// import express from 'express';
// import { fileURLToPath } from 'url';
// import path, { dirname } from 'path';
// import cookieParser from 'cookie-parser';
// import favicon from 'serve-favicon';
// import passport from 'passport';
// import { Strategy as LocalStrategy } from 'passport-local';
// import bcrypt from 'bcryptjs';
// import session from 'express-session';
// import flash from 'express-flash';
// import userRoutes from './routes/usersRoutes.mjs';
//
// import { connectDB } from './config.js'; // Виправлений імпорт підключення до бази даних
// // import {
// //     findUserByEmail,
// //     createUser,
// //     findUserById,
// //     insertManyUsers,
// //     findUsers,
// //     getUsersWithCursor,
// //     getUserStatistics
// // } from './models/User.js';
//
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
// const usersFolder = path.join(__dirname, 'users');
// const PORT = process.env.PORT || 3000;
// const sessionSecret = process.env.SESSION_SECRET || 'your_session_secret';
//
// const app = express();
// app.use(express.json()); // Для парсингу JSON
//
// const router = express.Router();
//
// // Підключення до бази даних MongoDB
// connectDB(); // Виклик функції підключення до бази даних
// // Middleware
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// app.use(cookieParser());
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(express.static(path.join(__dirname, 'public')));
//
// // Налаштування сесій
// app.use(session({
//     secret: sessionSecret,
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === 'production', // Використовуйте secure cookies у виробничому середовищі
//         maxAge: 1000 * 60 * 60 * 24 // 1 день
//     }
// }));
//
// app.use(flash());
//
// // Passport.js налаштування
// app.use(passport.initialize());
// app.use(passport.session());
//
// passport.use(new LocalStrategy({
//     usernameField: 'email',
//     passwordField: 'password'
// }, async (email, password, done) => {
//     try {
//         const user = await findUserByEmail(email);
//         if (!user) {
//             return done(null, false, { message: 'Incorrect email.' });
//         }
//
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return done(null, false, { message: 'Incorrect password.' });
//         }
//
//         return done(null, user);
//     } catch (err) {
//         return done(err);
//     }
// }));
//
// passport.serializeUser((user, done) => {
//     done(null, user._id); // Замінено user.id на user._id
// });
//
// passport.deserializeUser(async (id, done) => {
//     try {
//         const user = await findUserById(id); // Використовуйте знайдення користувача за його id
//         done(null, user);
//     } catch (err) {
//         done(err);
//     }
// });
//
// // Маршрут для збереження улюбленої теми
// app.get('/set-theme/:theme', (req, res) => {
//     const { theme } = req.params;
//     res.cookie('theme', theme, { maxAge: 900000, httpOnly: true });
//     res.redirect('back');
// });
//
// // Маршрут для отримання списку користувачів з MongoDB
// // router.get('/users', async (req, res) => {
// //     try {
// //         const users = await User.find({});
// //         res.json(users);
// //     } catch (err) {
// //         console.error('Error fetching users:', err);
// //         res.status(500).json({ error: 'Server error' });
// //     }
// // });
//
// router.put('/users/:id', async (req, res) => {
//     const { id } = req.params;
//     const { username, email, password } = req.body;
//
//     try {
//         const updatedUser = await User.findByIdAndUpdate(
//           id,
//           { username, email, password },
//           { new: true, runValidators: true }
//         );
//
//         if (!updatedUser) {
//             return res.status(404).json({ error: 'User not found' });
//         }
//
//         res.json(updatedUser);
//     } catch (err) {
//         console.error('Error updating user:', err);
//         res.status(400).json({ error: err.message });
//     }
// });
//
// router.delete('/users/:id', async (req, res) => {
//     const { id } = req.params;
//
//     try {
//         const deletedUser = await User.findByIdAndDelete(id);
//
//         if (!deletedUser) {
//             return res.status(404).json({ error: 'User not found' });
//         }
//
//         res.json({ message: 'User deleted successfully' });
//     } catch (err) {
//         console.error('Error deleting user:', err);
//         res.status(500).json({ error: 'Server error' });
//     }
// });
//
// router.post('/users/many', async (req, res) => {
//     const users = req.body;
//
//     try {
//         const insertedUsers = await User.insertMany(users);
//         res.status(201).json(insertedUsers);
//     } catch (err) {
//         console.error('Error inserting many users:', err);
//         res.status(400).json({ error: err.message });
//     }
// });
//
//
// // Маршрути Pug
// app.get('/users/:userId', (req, res) => {
//     const user = { name: 'John Doe', email: 'john@example.com' };
//     res.render(path.join(__dirname, 'views-pug', 'user-details.pug'), { user, theme: req.cookies.theme || 'light' });
// });
//
// // Маршрути EJS
// app.get('/articles', (req, res) => {
//     const articles = [
//         { title: 'Article 1', author: 'Author 1', content: 'Content of article 1' },
//         { title: 'Article 2', author: 'Author 2', content: 'Content of article 2' }
//     ];
//     res.render(path.join(__dirname, 'views-ejs', 'articles.ejs'), { articles, theme: req.cookies.theme || 'light' });
// });
//
// app.get('/articles/:articleId', (req, res) => {
//     const article = { title: 'Article 1', author: 'Author 1', content: 'Content of article 1' };
//     res.render(path.join(__dirname, 'views-ejs', 'article-details.ejs'), { article, theme: req.cookies.theme || 'light' });
// });
//
// // Обробка кореневого шляху
// app.get('/', (req, res) => {
//     res.send('Get root route');
// });
//
// app.get('/register', (req, res) => {
//     res.render(path.join(__dirname, 'views-pug', 'register.pug'));
// });
//
// // Реєстрація
// app.post('/register', async (req, res) => {
//     const { email, password } = req.body;
//     try {
//         const userExists = await findUserByEmail(email);
//         if (userExists) {
//             return res.status(400).send('User already exists.');
//         }
//
//         const newUser = await createUser({
//             email,
//             password: await bcrypt.hash(password, 10),
//         });
//
//         res.status(201).send('User registered successfully.');
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Server Error');
//     }
// });
//
// // Вхід
// app.get('/login', (req, res) => {
//     res.render(path.join(__dirname, 'views-pug', 'login.pug'), { message: req.flash('error') });
// });
//
// app.post('/login', passport.authenticate('local', {
//     successRedirect: '/profile', // Перенаправлення при успішному вході
//     failureRedirect: '/login', // Перенаправлення при невдачі
//     failureFlash: true // Включити flash messages у випадку невдалих спроб
// }));
//
// // Вихід
// app.post('/logout', (req, res) => {
//     req.logout((err) => {
//         if (err) {
//             console.error(err);
//             return next(err);
//         }
//         req.session.destroy((err) => {
//             if (err) {
//                 console.error(err);
//                 return next(err);
//             }
//             res.clearCookie('connect.sid');
//             res.redirect('/login');
//         });
//     });
// });
//
// // Мідлвар для перевірки автентифікації
// const isAuthenticated = (req, res, next) => {
//     if (req.method === 'POST' && !req.isAuthenticated()) {
//         res.redirect('/login');
//     } else {
//         return next();
//     }
// };
//
// // Профіль користувача
// app.get('/profile', isAuthenticated, (req, res) => {
//     res.send(`
//     <h1>Welcome to your profile, ${req.user ? req.user.email : 'Guest'}</h1>
//     <form action="/logout" method="POST">
//       <button type="submit">Logout</button>
//     </form>
//   `);
// });
//
// // Захищений маршрут
// app.get('/protected', isAuthenticated, (req, res) => {
//     res.send('This is a protected route');
// });
//
// // Додавання одного користувача
// app.post('/users', async (req, res) => {
//     try {
//         const newUser = await createUser(req.body);
//         res.status(201).json(newUser);
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Server Error');
//     }
// });
//
// // Додавання багатьох користувачів
// app.post('/users/many', async (req, res) => {
//     try {
//         const insertedIds = await insertManyUsers(req.body);
//         res.status(201).json({ insertedIds });
//     } catch (err) {
//         console.error("Error inserting many users:", err);
//         res.status(500).send('Server Error');
//     }
// });
//
// // Cursor-based fetching of users
// app.get('/users-cursor', async (req, res) => {
//     try {
//         const cursor = await getUsersWithCursor();
//         const users = [];
//         await cursor.forEach((user) => {
//             users.push(user);
//         });
//         res.status(200).json(users);
//     } catch (err) {
//         console.error('Error fetching users with cursor:', err);
//         res.status(500).send('Server Error');
//     }
// });
//
// // Aggregation route
// app.get('/user-stats', async (req, res) => {
//     try {
//         const stats = await getUserStatistics();
//         res.status(200).json(stats);
//     } catch (err) {
//         console.error('Error fetching user statistics:', err);
//         res.status(500).send('Server Error');
//     }
// });
//
// // Start server
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });


import express from 'express';
import mongoose from 'mongoose';
import userRoutes from './routes/usersRoutes.mjs';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Use user routes
app.use('/', userRoutes);

// MongoDB connection
mongoose.connect('mongodb+srv://madbowjam:1wsxm7eMksnNf1Gp@cluster0.yzzi21t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {})
  .then(() => {
      console.log('MongoDB Connected');
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('Error connecting to MongoDB', err));