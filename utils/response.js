const response = (res, status, success, data) => {
  const response = {};
  if (data) response.data = data;
  if (status === 400) {
    response.message = "Invalid Request";
  } else if (status === 401) {
    response.message = "Unauthorized";
  }
  res.status(status).send(response);
};
module.exports = response;
