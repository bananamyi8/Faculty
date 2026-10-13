function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  const status = err.status || 500;
  const title = err.title || "Internal Server Error";

  res.status(status).type("application/problem+json").json({
    type: "about:blank",
    title,
    status,
    detail: status === 500 ? "An unexpected server error occurred." : err.message,
    instance: req.originalUrl
  });
}

module.exports = errorHandler;