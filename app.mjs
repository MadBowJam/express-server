// app.mjs
import express from 'express';
import { logRequests } from './middlewares/logMiddleware.mjs';
import { articlesRoutes } from './routes/articlesRoutes.mjs';
import { usersRoutes } from './routes/usersRoutes.mjs';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(logRequests);

app.get('/', (req, res) => {
    res.send('Get root route');
});

app.use('/users', usersRoutes);
app.use('/articles', articlesRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});