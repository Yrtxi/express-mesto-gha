const { celebrate, Joi } = require('celebrate');

module.exports.createCardValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().uri({ scheme: ['http', 'https'] }).required(),
  }),
});

module.exports.cardIdValidator = celebrate({
  params: Joi.object({
    cardId: Joi.string().hex().length(24).required(),
  }).required(),
});
