// app.js
const express = require('express');
const app = express();
const usersRoutes = require('./routes/usersRoutes');
const articlesRoutes = require('./routes/articlesRoutes');

app.use(express.json());

// Головний маршрут
app.get('/', (req, res) => {
  res.send('Get root route');
});

// Маршрути для користувачів
app.use('/users', usersRoutes);

// Маршрути для статей
app.use('/articles', articlesRoutes);

// Налаштування порту
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
