const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { login, createUser } = require('./controllers/users');
const NotFoundError = require('./errors/NotFoundError');
const auth = require('./middlewares/auth');
const { createUserValidator, loginUserValidator } = require('./validators/users');

const { PORT = 3000, MONGO_URI = 'mongodb://localhost/mestodb' } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(MONGO_URI);

app.post('/signin', loginUserValidator, login);
app.post('/signup', createUserValidator, createUser);
app.use(auth);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('*', (req, res, next) => next(new NotFoundError('Страница не найдена')));

// Обработчик ошибок валидации celebrate
app.use(errors());

// Централизованный обработчик ошибок
app.use((err, req, res, next) => {
  res.status(err.statusCode).send({ message: err.message });
  next();
});

app.listen(PORT);
