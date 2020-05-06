const { check } = require('express-validator');

module.exports = {
  signIn: [
    check('password', "password doesn't exists").exists(),
    check('email', 'Invalid email').exists(),
    check('email', 'Email has wrong format').isEmail()
  ],
  signUp: [
    check('email', 'Email is missing').exists(),
    check('email', 'Email has wrong format').isEmail(),

    check('password', 'Password is missing').exists(),

    check('firstName', "First name doesn't exists").optional().isString(),
    check('lastName', "Last name doesn't exists").optional().isString()
  ],
};
