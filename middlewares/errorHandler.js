const { constants } = require('http2');

// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  const statusCode = err.statusCode || constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;
  const message = err.message || 'На сервере произошла ошибка';
  res.status(statusCode).send({ message });
};
