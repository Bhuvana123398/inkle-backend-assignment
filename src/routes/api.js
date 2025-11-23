const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { permit } = require('../middleware/roles');

const authController = require('../controllers/authController');
const socialController = require('../controllers/socialController');
const feedController = require('../controllers/feedController');
const adminController = require('../controllers/adminController');


router.post('/signup', authController.register);
router.post('/login', authController.login);


router.post('/posts', auth, socialController.createPost);
router.put('/posts/like/:id', auth, socialController.likePost);
router.put('/users/follow/:id', auth, socialController.followUser);
router.put('/users/block/:id', auth, socialController.blockUser);


router.get('/feed', auth, feedController.getActivityFeed);


router.delete('/admin/posts/:id', auth, permit('admin', 'owner'), adminController.deletePost);
router.delete('/admin/users/:id', auth, permit('admin', 'owner'), adminController.deleteUser);
router.post('/owner/create-admin', auth, permit('owner'), adminController.createAdmin);

module.exports = router;
