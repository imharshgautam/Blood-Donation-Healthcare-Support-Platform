function notFound(req, res) {
  res.status(404).json({ message: 'Resource not found' });
}

function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  const status = error.status || error.statusCode || 500;
  const message = status === 500 && process.env.NODE_ENV === 'production'
    ? 'An unexpected server error occurred'
    : error.message;

  res.status(status).json({ message });
}

module.exports = { notFound, errorHandler };
