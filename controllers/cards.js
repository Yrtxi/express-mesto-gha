const { constants } = require('http2');
const Card = require('../models/card');
const {
  badRequestCard,
  notFoundCard,
  serverError,
  httpCodes,
} = require('../constants');

// Обработчик ошибки сервера 400
const responseBadRequestError = (res) => res
  .status(constants.HTTP_STATUS_BAD_REQUEST)
  .send(badRequestCard);

// Обработчик ошибки сервера 404
const responseNotFoundError = (res) => res
  .status(constants.HTTP_STATUS_NOT_FOUND)
  .send(notFoundCard);

// Обработчик ошибки сервера 500
const responseServerError = (res) => res
  .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
  .send(serverError);

module.exports.getCards = (req, res) => {
  // Находим все карточки
  Card.find({})
    .populate(['owner', 'likes'])
    // Вернем записанные в базу данные
    .then((cards) => res.send({ data: cards }))
    .catch(() => { responseServerError(res); });
};

module.exports.createCard = (req, res) => {
  // Получим из объекта запроса данные карточки
  const { name, link } = req.body;
  const owner = req.user._id;
  // Создаем документ на основе пришедших данных
  Card.create({ name, link, owner })
    // Вернем записанные в базу данные
    .then((card) => res.status(httpCodes.created).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        responseBadRequestError(res);
      } else {
        responseServerError(res);
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
        responseServerError(res);
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
    .populate(['owner', 'likes'])
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
        responseServerError(res);
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
    .populate(['owner', 'likes'])
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
        responseServerError(res);
      }
    });
};
