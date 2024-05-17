// routes/articlesRoutes.mjs
import express from 'express';
const articlesRoutes = express.Router();
import { articlesController } from '../controllers/articlesController.mjs';
import { checkArticleAccess } from '../middlewares/accessMiddleware.mjs';

articlesRoutes.get('/', checkArticleAccess, articlesController.getArticles);
articlesRoutes.post('/', checkArticleAccess, articlesController.postArticle);
articlesRoutes.get('/:articleId', checkArticleAccess, articlesController.getArticleById);
articlesRoutes.put('/:articleId', checkArticleAccess, articlesController.putArticleById);
articlesRoutes.delete('/:articleId', checkArticleAccess, articlesController.deleteArticleById);

export { articlesRoutes };