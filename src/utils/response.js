const sendResponse = (res, options) => {
  const { statusCode = 200, success = true, data, message, meta } = options;

  const body = { success };
  if (message !== undefined) body.message = message;
  if (data !== undefined) body.data = data;
  if (meta !== undefined) body.meta = meta;

  return res.status(statusCode).json(body);
};

module.exports = { sendResponse };
