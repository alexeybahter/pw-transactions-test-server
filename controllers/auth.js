const { USER_FIELDS_TOKEN } = require('../utils/contants');
const userService = require('../db/services/users');
const utils = require('../utils');

const singIn = async (req, res, next) => {
  try {
    const user = await userService.findOneUser({
      where: {
        email: req.body.email.trim()
      },
      attributes: ['id', 'name', 'pw_count', 'email', 'password']
    });

    if (!user) {
      throw { status: 403, param: 'email', msg: 'User login wrong' };
    }

    if (!utils.hash.compare(req.body.password, user.password)) {
      throw { status: 403, param: 'password', msg: 'Password is wrong' };
    }

    const responsePayload = utils.createTokensPair(user, USER_FIELDS_TOKEN);

    return res.json(responsePayload);
  } catch (err) {
    return res.status(403).json({ errors: [err] });
  }
};

const singUp = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    let [user, created] = await userService.findOrCreate({
      where: { email },
      defaults: {
        name,
        email,
        password,
        pw_count: 200000,
      },
    });

    if (!created) {
      throw { msg: 'User with same credentials already exists', status: 400 };
    }
    user = user.toJSON();

    const responsePayload = utils.createTokensPair(user, USER_FIELDS_TOKEN);
    return res.status(201).json(responsePayload);
  } catch (err) {
    return res.status(400).json({ errors: [err] });
  }
};

module.exports = {
  singIn,
  singUp,
};
