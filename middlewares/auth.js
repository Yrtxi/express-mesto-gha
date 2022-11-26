const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Достаем авторизационный заголовок
  const { authorization } = req.headers;
  // убеждаемся, что он есть или начинается с Bearer
  if (!authorization) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }
  const token = authorization.replace(/^Bearer*\s*/i, '');
  let payload;
  // Верифицируем токен
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }
  // записываем пейлоуд в объект запроса
  req.user = payload;

  next();
};
