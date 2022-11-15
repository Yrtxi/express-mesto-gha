const { constants } = require('http2');
const Card = require('../models/card');

// Обработчик ошибки сервера 400
const responseBadRequestError = (res) => res
  .status(constants.HTTP_STATUS_BAD_REQUEST)
  .send({
    message: 'Некорректные данные для карточки',
  });

// Обработчик ошибки сервера 404
const responseNotFoundError = (res) => res
  .status(constants.HTTP_STATUS_NOT_FOUND)
  .send({
    message: 'Карточки с таким id не существует',
  });

// Обработчик ошибки сервера 500
const responseServerError = (res, message) => res
  .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
  .send({
    message: `На сервере произошла ошибка. ${message}`,
  });

module.exports.getCards = (req, res) => {
  // Находим все карточки
  Card.find({})
    // Вернем записанные в базу данные
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      if (err.name === 'CastError') {
        responseBadRequestError(res);
      } else {
        responseServerError(res, err.message);
      }
    });
};

module.exports.createCard = (req, res) => {
  // Получим из объекта запроса данные карточки
  const { name, link } = req.body;
  const owner = req.user._id;
  // Создаем документ на основе пришедших данных
  Card.create({ name, link, owner })
    // Вернем записанные в базу данные
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        responseBadRequestError(res);
      } else {
        responseServerError(res, err.message);
      }
    });
};

module.exports.deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card === null) {
        responseNotFoundError(res);
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        responseBadRequestError(res);
      } else {
        responseServerError(res, err.message);
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    // добавить _id в массив, если его там нет
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        responseBadRequestError(res);
      } else {
        responseServerError(res, err.message);
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    // убрать _id из массива
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        responseBadRequestError(res);
      } else {
        responseServerError(res, err.message);
      }
    });
};
