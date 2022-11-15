const { constants } = require('http2');
const User = require('../models/user');

// Обработчик ошибки сервера 400
const responseBadRequestError = (res) => res
  .status(constants.HTTP_STATUS_BAD_REQUEST)
  .send({
    message: 'Некорректные данные для пользователя',
  });

// Обработчик ошибки сервера 404
const responseNotFoundError = (res) => res
  .status(constants.HTTP_STATUS_NOT_FOUND)
  .send({
    message: 'Пользователя с таким id не существует',
  });

// Обработчик ошибки сервера 500
const responseServerError = (res, message) => res
  .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
  .send({
    message: `На сервере произошла ошибка. ${message}`,
  });

module.exports.getUsers = (req, res) => {
  // Находим всех пользователей
  User.find({})
    // Вернем записанные в базу данные
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      if (err.name === 'CastError') {
        responseBadRequestError(res);
      } else {
        responseServerError(res, err.message);
      }
    });
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      // Обработаем "нулевого" пользователя
      if (user === null) {
        responseNotFoundError(res);
      } else {
        res.send({ data: user });
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

module.exports.createUser = (req, res) => {
  // Получим из объекта запроса имя, описание и аватар пользователя
  const { name, about, avatar } = req.body;
  // Создаем документ на основе пришедших данных
  User.create({ name, about, avatar })
    // Вернем записанные в базу данные
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        responseBadRequestError(res);
      } else {
        responseServerError(res, err.message);
      }
    });
};

module.exports.updateProfile = (req, res) => {
  const myId = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(myId, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        responseBadRequestError(res);
      } else {
        responseServerError(res, err.message);
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const myId = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(myId, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        responseBadRequestError(res);
      } else {
        responseServerError(res, err.message);
      }
    });
};
