'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const usersIds = [25, 26, 27, 28, 29, 30, 31, 32, 33, 34];
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];

    const random = (min, max) => {
      return Math.ceil(Math.random() * (max - min) + min)
    };

    const transactionsSeeds = Array(100000).fill().map(() => {
      const total = 200000;
      const count = random(1, 100);
      const sender_id = usersIds[random(0, 9)];

      const uniqRecipientId = () => {
        const randomId = usersIds[random(0, 9)]
        return sender_id === randomId ? uniqRecipientId() : randomId;
      };

      const date = `${months[random(0, 11)]} ${random(1, 30)}th 2020, ${random(0, 23)}:${random(10,60)}:${random(10,60)}`.toString()

      return {
        count,
        sender_id,
        recipient_id: uniqRecipientId(),
        pw_count_resulted: total,
        date,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    });

    return queryInterface.bulkInsert('transactions', [...transactionsSeeds]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('transactions');
  }
};
