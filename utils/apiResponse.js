const sendResponse = (res, statusCode, message, data = null) => {
  const response = {
    status: 'success',
    message,
  };
  if (data !== null) {
    response.data = data;
  }
  return res.status(statusCode).json(response);
};
module.exports = sendResponse;