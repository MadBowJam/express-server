import express from 'express';
const articlesRoutes = express.Router();
import { articlesController } from '../controllers/articlesController.mjs';

articlesRoutes.get('/', articlesController.getArticles);
articlesRoutes.post('/', articlesController.postArticle);
articlesRoutes.get('/:articleId', articlesController.getArticleById);
articlesRoutes.put('/:articleId', articlesController.putArticleById);
articlesRoutes.delete('/:articleId', articlesController.deleteArticleById);

export { articlesRoutes };