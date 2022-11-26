const express = require('express');
const mongoose = require('mongoose');
const { httpCodes, notFoundPage } = require('./constants');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000, MONGO_URI = 'mongodb://localhost/mestodb' } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(MONGO_URI);

app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('*', (req, res) => {
  res.status(httpCodes.notFound).send(notFoundPage);
});

// Централизованный обработчик ошибок
app.use((err, req, res, next) => {
  res.status(err.statusCode).send({ message: err.message });
  next();
});

app.listen(PORT);
