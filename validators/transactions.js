const { query, body } = require('express-validator');

module.exports = {
  getAll: [
    query('sort_method', 'Invalid sort_method')
      .optional()
      .isString(),
    query('sort_item', 'Invalid sort_item')
      .optional()
      .isString()
      .isIn(['count', 'sender_id', 'recipient_id', 'pw_count_resulted', 'date']),
    query('page', 'Invalid page').isInt({ gte: 0 }),
    query('per_page', 'Invalid per_page').isInt({ gte: 0 }),
    query('page', 'Page doesn\'t exists').exists()
  ],
  createTransaction: [
    body('quantity', 'Invalid quantity').custom(
      (quantity, { req }) => {
        if (typeof quantity === 'string') {
          throw new Error('Invalid quantity. The quantity must be a number.');
        }

        if (quantity <= 0) {
          throw new Error('Invalid quantity. The quantity must be more than 0.');
        }

        if (quantity > req.user.pw_count) {
          throw new Error('Invalid quantity. You don\'t have enough funds.');
        }

        return true;
      }
    ),
    body('recipient_id', 'The recipient_id must be a number.')
      .exists()
      .isNumeric(),
    body('recipient_id', 'Invalid recipient_id').custom(
      (recipient_id, { req }) => {
        if (recipient_id === req.user.id) {
          throw new Error('Invalid recipient_id. You can\'t send pw for yourself.');
        }

        if (typeof recipient_id === 'string') {
          throw new Error('Invalid count. The recipient_id must be a number.');
        }
        return true;
      }
    ),
  ]
};
