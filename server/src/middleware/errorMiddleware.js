const errorHandler = (
  err,
  req,
  res,
  next
) => {
  let statusCode =
    res.statusCode === 200
      ? 500
      : res.statusCode;

  // MongoDB duplicate key
  if (err.code === 11000) {
    statusCode = 409;

    const field =
      Object.keys(err.keyValue || {})[0];

    return res.status(statusCode).json({
      success: false,
      message: `${field || "Field"} already exists`
    });
  }

  // Mongoose validation
  if (err.name === "ValidationError") {
    statusCode = 400;

    const errors = Object.values(
      err.errors
    ).map((error) => error.message);

    return res.status(statusCode).json({
      success: false,
      message: "Validation failed",
      errors
    });
  }

  console.error(err);

  res.status(statusCode).json({
    success: false,
    message: err.message || "Server error",

    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack
    })
  });
};

export default errorHandler;