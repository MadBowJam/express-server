import express from 'express';
import { articlesRoutes } from './routes/articlesRoutes.mjs';
import { usersRoutes } from './routes/usersRoutes.mjs';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Get root route');
});

app.use('/users', usersRoutes);
app.use('/articles', articlesRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});