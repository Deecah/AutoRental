/**
 * Helper functions để hỗ trợ cả API JSON và HTML rendering
 */

export function sendResponse(req, res, data, statusCode = 200, message = null) {
  // Ưu tiên JSON nếu client request JSON hoặc render không available
  if (req.accepts('json') && !req.accepts('html')) {
    const response = {
      success: statusCode < 400,
      ...(statusCode < 400 ? { data } : { error: data })
    };
    if (message) response.message = message;
    return res.status(statusCode).json(response);
  }

  // Fallback to JSON nếu render không available
  if (!res.render) {
    const response = {
      success: statusCode < 400,
      ...(statusCode < 400 ? { data } : { error: data })
    };
    if (message) response.message = message;
    return res.status(statusCode).json(response);
  }

  // Nếu là HTML render (chỉ dùng trong development)
  if (statusCode >= 400) {
    return res.status(statusCode).render("error", {
      title: "Lỗi",
      message: data
    });
  }

  return null; // Caller sẽ handle render
}

export function sendErrorResponse(req, res, error, statusCode = 500) {
  console.error("Error:", error);

  // JSON response
  if (req.accepts('json') && !req.accepts('html')) {
    return res.status(statusCode).json({
      success: false,
      error: error.message || error,
      status: statusCode
    });
  }

  // HTML fallback
  if (res.render) {
    return res.status(statusCode).render("error", {
      title: "Lỗi",
      message: error.message || error
    });
  }

  // Default JSON
  res.status(statusCode).json({
    success: false,
    error: error.message || error,
    status: statusCode
  });
}

export function sendListResponse(req, res, data, count = null) {
  if (req.accepts('json') && !req.accepts('html')) {
    return res.json({
      success: true,
      data,
      count: count || data?.length || 0
    });
  }

  if (!res.render) {
    return res.json({
      success: true,
      data,
      count: count || data?.length || 0
    });
  }

  return null; // Caller sẽ handle render
}
