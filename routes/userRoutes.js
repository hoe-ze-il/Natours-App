const express = require('express');
const userController = require('../controller/userController');
const authController = require('../controller/authController');
const reviewController = require('../controller/reviewController');
const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);

router.patch(
  '/update-my-password',
  authController.protect,
  authController.updatePassword,
);

router.patch('/update-me', authController.protect, userController.updateMe);
router.delete('/delete-me', authController.protect, userController.deleteMe);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
