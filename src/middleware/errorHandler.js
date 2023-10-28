const { logEvents } = require("./errorLogger");

const errorHandler = (error, req, res, next) => {
  logEvents(
    `${error.name}: ${error.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
    "errLog.log"
  );
  console.log(error.stack);

  const status = res.statusCode ? res.statusCode : 500; // server error

  res.status(status);

  res.json({
    message: error.message,
    stack: process.env.NODE_ENV === 'production' ? null : error?.stack,
  });
};

module.exports = errorHandler;