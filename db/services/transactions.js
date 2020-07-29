const db = require('../models');

module.exports = {
  createTransaction: params => db.transaction.create(params),
  findAllTransactions: params => db.transaction.findAll({
    raw: true,
    nest: true,
    ...params
  }),
  findAllTransactionsAndPagination: ({
    id,
    page,
    per_page,
    sort_item,
    sort_method
  }) => db.transaction.findAndCountAll({
    where: {
      $or: [
        {sender_id: {$eq: id} },
        {recipient_id: {$eq: id} },
      ],
    },
    offset: (page * per_page) - per_page,
    limit: per_page,
    order: [[sort_item, sort_method]],
    distinct: true,
    include: [
      {
        model: db.user,
        as: 'sender',
        attributes: ['name'],
      },
      {
        model: db.user,
        as: 'recipient',
        attributes: ['name'],
      },
    ],
    attributes: {
      exclude: ['updatedAt', 'sender_id', 'recipient_id']
    }
  }),
};
