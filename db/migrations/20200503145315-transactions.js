const paramsOfField = require('../../utils/paramsOfField');

const tableName = 'transactions';

module.exports = {
  up: (queryInterface, dataTypes) => {
    return queryInterface.createTable(tableName, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: dataTypes.INTEGER,
      },
      count: { ...paramsOfField(dataTypes.INTEGER) },
      sender_id: { ...paramsOfField(dataTypes.INTEGER) },
      recipient_id: { ...paramsOfField(dataTypes.INTEGER) },
      date: { ...paramsOfField(dataTypes.STRING) },
      pw_count_resulted: { ...paramsOfField(dataTypes.INTEGER) },
      createdAt: {
        type: dataTypes.DATE
      },
      updatedAt: {
        type: dataTypes.DATE
      }
    });
  },
  down: (queryInterface) => {
    return queryInterface.dropTable(tableName);
  }
}
