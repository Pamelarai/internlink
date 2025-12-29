/**
 * Simple response utilities for consistent API responses
 */

export const sendSuccess = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  });
};

export const sendError = (res, error, statusCode = 400) => {
  return res.status(statusCode).json({
    success: false,
    message: error,
    statusCode,
    timestamp: new Date().toISOString(),
  });
};
