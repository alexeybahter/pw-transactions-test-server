module.exports = sequelizeType => ({
  allowNull: false,
  type: sequelizeType,
  validate: {
    notEmpty: false,
  }
});
