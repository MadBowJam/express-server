// middlewares/accessMiddleware.mjs
export function checkArticleAccess(req, res, next) {
    const userHasAccess = true; // Реалізуйте логіку перевірки доступу
    if (!userHasAccess) {
        return res.status(403).send('Access denied.');
    }
    next();
}