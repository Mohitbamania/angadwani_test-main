const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

const { user_auth, manage_user_auth } = require("../middlewares/auth");

// User Login
router.route('/user_login').post(userController.user_login);

// Manage User
router.route('/add_user').post(user_auth, userController.add_user);
router.route('/get_users/:number').get(manage_user_auth, userController.get_users);

// User Roles
router.route('/get_adduser_roles').get(user_auth, userController.get_adduser_roles);
router.route('/add_user_roles').post(userController.add_user_roles);


module.exports = router;