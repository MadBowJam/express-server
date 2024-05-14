const articlesController = {
  getArticles: (req, res) => {
    res.send('Get articles route');
  },
  postArticle: (req, res) => {
    res.send('Post articles route');
  },
  getArticleById: (req, res) => {
    res.send(`Get article by Id route: ${req.params.articleId}`);
  },
  putArticleById: (req, res) => {
    res.send(`Put article by Id route: ${req.params.articleId}`);
  },
  deleteArticleById: (req, res) => {
    res.send(`Delete article by Id route: ${req.params.articleId}`);
  }
};

export { articlesController };