const router = require('express').Router();
const { createCardValidator, cardIdValidator } = require('../validators/cards');
const {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);

router.post('/', createCardValidator, createCard);

router.delete('/:cardId', cardIdValidator, deleteCardById);

router.put('/:cardId/likes', cardIdValidator, likeCard);

router.delete('/:cardId/likes', cardIdValidator, dislikeCard);

module.exports = router;
