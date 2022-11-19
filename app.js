const express = require('express');
const mongoose = require('mongoose');
const { httpCodes, notFoundPage } = require('./constants');

const { PORT = 3000, MONGO_URI = 'mongodb://localhost/mestodb' } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '6371582909274bc8de0a4421',
  };

  next();
});

mongoose.connect(MONGO_URI);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('*', (req, res) => {
  res.status(httpCodes.notFound).send(notFoundPage);
});

app.listen(PORT);
