const userService = require('../db/services/users');

const {
  USER_FIELDS_QUERY_EXCLUDES,
  USER_FIELDS_REGULAR
} = require('../utils/contants');

const getUsers = async (req, res, next) => {
  try {
    const users = await userService.findAllUsers({
      where: {
        id: { $not: req.user.id }
      },
      attributes: {
        exclude: USER_FIELDS_QUERY_EXCLUDES
      },
      order: [
        ['name', 'ASC'],
      ],
    });
    return res.json({ users });
  } catch (err) {
    next({ ...err, filename: __dirname });
  }
};

const getUser = async (req, res, next) => {
  try {
    const { id: userId } = req.params;
    const user = await userService.findOneUser({
      where: { id: userId },
      attributes: { USER_FIELDS_REGULAR }
    });
    if (!user) {
      throw { status: 404, message: 'User not found' };
    }

    return res.json({ user });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUser,
};
