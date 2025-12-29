/**
 * Simple validation utilities
 */

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateRequired = (fields) => {
  return fields.every((field) => field !== undefined && field !== null && field !== '');
};

