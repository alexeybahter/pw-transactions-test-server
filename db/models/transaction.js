const paramsOfField = require('../../utils/paramsOfField');

module.exports = (sequelize, dataTypes) => {
  const Transaction = sequelize.define(
    'transaction',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: dataTypes.INTEGER,
      },
      count: { ...paramsOfField(dataTypes.INTEGER) },
      sender_id: { ...paramsOfField(dataTypes.INTEGER) },
      recipient_id: { ...paramsOfField(dataTypes.INTEGER) },
      pw_count_resulted: { ...paramsOfField(dataTypes.INTEGER) },
      date: { ...paramsOfField(dataTypes.STRING) }
    }
  );

  Transaction.associate = (models) => {
    models.transaction.belongsTo(models.user, {
      foreignKey: 'sender_id',
      as: 'sender',
    });

    models.transaction.belongsTo(models.user, {
      foreignKey: 'recipient_id',
      as: 'recipient',
    });
  };

  return Transaction;
};
