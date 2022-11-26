const { constants } = require('http2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ServerError = require('../errors/ServerError');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports.getUsers = (req, res, next) => {
  // Находим всех пользователей
  User.find({})
    // Вернем записанные в базу данные
    .then((users) => res.send({ data: users }))
    .catch(() => next(new ServerError('На сервере произошла ошибка')));
};

module.exports.getCurrentUser = (req, res, next) => {
  // Находим пользователя по id
  User.findById(req.user._id)
  // Вернем записанные в базу данные
    .then((user) => res.send({ data: user }))
    .catch(() => next(new NotFoundError('Пользователь не найден')));
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      // Обработаем "нулевого" пользователя
      if (!user) {
        next(new NotFoundError('Пользователь не найден'));
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректные данные для пользователя'));
      } else {
        next(new ServerError('На сервере произошла ошибка'));
      }
    });
};

module.exports.createUser = (req, res, next) => {
  // Получим из объекта запроса данные пользователя
  const {
    name, about, avatar, email, password,
  } = req.body;
  // хешируем пароль
  bcrypt.hash(password, 10)
  // Создаем документ на основе пришедших данных
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    // Вернем записанные в базу данные
    .then((user) => res.status(constants.HTTP_STATUS_CREATED).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Некорректные данные для пользователя'));
      } else if (err.code === 11000) {
        next(new ConflictError('Пользователь с такой почтой уже существует'));
      } else {
        next(new ServerError('На сервере произошла ошибка'));
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      // cоздадим и вернем токен
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      if (err.name === 'UnauthorizedError') {
        next(new UnauthorizedError('Некорректные данные для пользователя'));
      } else {
        next(new ServerError('На сервере произошла ошибка'));
      }
    });
};

module.exports.updateProfile = (req, res, next) => {
  const myId = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(myId, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь не найден'));
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Некорректные данные для пользователя'));
      } else {
        next(new ServerError('На сервере произошла ошибка'));
      }
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const myId = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(myId, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь не найден'));
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Некорректные данные для пользователя'));
      } else {
        next(new ServerError('На сервере произошла ошибка'));
      }
    });
};
