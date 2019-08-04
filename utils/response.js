const response = (res, status, success, message) => {
  const response = { success: success };
  if (message) response.message = message;
  res.status(status).send(response);
};
module.exports = response;
