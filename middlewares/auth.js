const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports = (req, res, next) => {
  // Достаем авторизационный заголовок
  const { authorization } = req.headers;
  // убеждаемся, что он есть или начинается с Bearer
  if (!authorization) {
    next(new UnauthorizedError('Необходима авторизация'));
  }
  const token = authorization.replace(/^Bearer*\s*/i, '');
  let payload;
  // Верифицируем токен
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    next(new UnauthorizedError('Необходима авторизация'));
  }
  // записываем пейлоуд в объект запроса
  req.user = payload;

  next();
};
