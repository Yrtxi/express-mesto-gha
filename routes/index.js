const router = require('express').Router();
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFoundError');
const { login, createUser } = require('../controllers/users');
const { createUserValidator, loginUserValidator } = require('../validators/users');

router.post('/signin', loginUserValidator, login);
router.post('/signup', createUserValidator, createUser);
router.use('/users', auth, require('./users'));
router.use('/cards', auth, require('./cards'));

router.use('*', (req, res, next) => next(new NotFoundError('Страница не найдена')));

module.exports = router;
