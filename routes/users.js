const router = require('express').Router();
const {
  updateAvatarValidator,
  updateProfileValidator,
  userIdValidator,
} = require('../validators/users');
const {
  getUsers,
  getCurrentUser,
  getUserById,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/me', getCurrentUser);

router.get('/:userId', userIdValidator, getUserById);

router.patch('/me', updateProfileValidator, updateProfile);

router.patch('/me/avatar', updateAvatarValidator, updateAvatar);

module.exports = router;
