const { celebrate, Joi } = require('celebrate');

module.exports.createUserValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().uri({ scheme: ['http', 'https'] }),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

module.exports.loginUserValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

module.exports.updateAvatarValidator = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().uri({ scheme: ['http', 'https'] }).required(),
  }),
});

module.exports.updateProfileValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
});

module.exports.userIdValidator = celebrate({
  params: Joi.object({
    userId: Joi.string().hex().length(24).required(),
  }).required(),
});
