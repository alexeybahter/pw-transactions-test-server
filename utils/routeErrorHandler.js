const logger = require('./logger');

/**
 *
 * @param {*} err - error object
 * @param {*} req - request object
 * @param {*} res - response object
 */

exports.commonErrorHandler = (err, req, res) => {
  let errorStatus = err.status || 500;
  if (err.message === 'Validation error') {
    errorStatus = 400;
    err.errors = err.errors.map(error => ({
      msg: error.message,
      param: error.param,
      value: error.value,
      type: error.type
    }));
  }
  if (errorStatus >= 500) {
    logger.error({ text: `Server error: ${err.message}`, routeName: req.originalUrl });
  } else {
    logger.warn({ text: `Server error: ${err.message}`, routeName: req.originalUrl });
  }
  const response = {};
  if (err.errors) {
    response.errors = err.errors;
  } else {
    response.errors = [
      {
        msg: err.message,
        param: err.param
      }
    ];
  }
  return res.status(errorStatus).json({ status: errorStatus, ...response });
};
