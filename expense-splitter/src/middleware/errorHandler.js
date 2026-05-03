const errorHandler = (err, req, res, next) => {
  console.error("ERROR:", err.message);

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: field + " already exists"
    });
  }

  if (err.name === "ValidationError") {
    const msg = Object.values(err.errors)
      .map(e => e.message)
      .join(", ");
    return res.status(400).json({
      success: false,
      message: msg
    });
  }

  if (err.name === "CastError") {
    return res.status(404).json({
      success: false,
      message: "Resource not found"
    });
  }

  return res.status(500).json({
    success: false,
    message: err.message || "Server error"
  });
};

module.exports = errorHandler;