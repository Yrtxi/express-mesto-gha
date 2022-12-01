const { constants } = require('http2');

module.exports = (err, req, res, next) => {
  const statusCode = err.statusCode || constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;
  res
    .status(statusCode)
    .send({
      message:
        statusCode === constants.HTTP_STATUS_INTERNAL_SERVER_ERROR
          ? 'На сервере произошла ошибка'
          : err.message,
    });
  next();
};
