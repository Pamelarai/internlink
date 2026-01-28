/**
 * Simple authentication utilities
 */

import jwt from 'jsonwebtoken';

export const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'devsecret',
    { expiresIn: '7d' }
  );
};


export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'devsecret');
  } catch (err) {
    return null;
  }
};
