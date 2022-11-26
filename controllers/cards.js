const { constants } = require('http2');
const Card = require('../models/card');
const ServerError = require('../errors/ServerError');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
const HTTPError = require('../errors/HTTPError');

module.exports.getCards = (req, res, next) => {
  // Находим все карточки
  Card.find({})
    .populate(['owner', 'likes'])
    // Вернем записанные в базу данные
    .then((cards) => res.send({ data: cards }))
    .catch(() => next(new ServerError('На сервере произошла ошибка')));
};

module.exports.createCard = (req, res, next) => {
  // Получим из объекта запроса данные карточки
  const { name, link } = req.body;
  const owner = req.user._id;
  // Создаем документ на основе пришедших данных
  Card.create({ name, link, owner })
    // Вернем записанные в базу данные
    .then((card) => res.status(constants.HTTP_STATUS_CREATED).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Некорректные данные для карточки'));
      } else {
        next(new ServerError('На сервере произошла ошибка'));
      }
    });
};

module.exports.deleteCardById = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      } else if (req.user._id !== card.owner.toString()) {
        throw new ForbiddenError('Вы не можете удалять чужие карточки');
      } else {
        return card.remove();
      }
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректные данные для карточки'));
      } else if (err instanceof HTTPError) {
        next(err);
      } else {
        next(new ServerError('На сервере произошла ошибка'));
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    // добавить _id в массив, если его там нет
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточка не найдена'));
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорретный id для карточки'));
      } else {
        next(new ServerError('На сервере произошла ошибка'));
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    // убрать _id из массива
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточка не найдена'));
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректный id для карточки'));
      } else {
        next(new ServerError('На сервере произошла ошибка'));
      }
    });
};
