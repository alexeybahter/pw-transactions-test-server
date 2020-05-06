const utils = require('../../utils');

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    'user',
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        notEmpty: true,
      },
      pw_count: {
        type: Sequelize.INTEGER,
      },
      email: {
        type: Sequelize.STRING,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    }
  );

  User.beforeUpdate(instance => {
    return instance;
  });

  User.beforeCreate(user => {
    if (user.isNewRecord && user.password) {
      user.password = utils.hash.generate(user.password);
    }
    return user;
  });

  User.associate = models => {
    models.user.hasMany(models.transaction, {
      foreignKey: 'sender_id',
    });

    models.user.hasMany(models.transaction, {
      foreignKey: 'recipient_id',
    });
  };

  return User;
};
