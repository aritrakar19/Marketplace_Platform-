const response = {
  success: (res, data, message = 'Success', statusCode = 200) => {
    res.status(statusCode).json({ success: true, message, data });
  },
  error: (res, error, statusCode = 500) => {
    res.status(statusCode).json({ success: false, error: error.message || error });
  }
};
module.exports = response;