class ErrorHandler extends Error {
  constuctor(message, statusCode) {
    super.message;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constuctor);
  }
}

module.exports = ErrorHandler;
