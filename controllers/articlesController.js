// controllers/articlesController.js
exports.getArticles = (req, res) => {
  res.send('Get articles route');
};

exports.postArticle = (req, res) => {
  res.send('Post articles route');
};

exports.getArticleById = (req, res) => {
  res.send(`Get article by Id route: ${req.params.articleId}`);
};

exports.putArticleById = (req, res) => {
  res.send(`Put article by Id route: ${req.params.articleId}`);
};

exports.deleteArticleById = (req, res) => {
  res.send(`Delete article by Id route: ${req.params.articleId}`);
};
