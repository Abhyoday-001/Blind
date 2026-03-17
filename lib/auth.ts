import jwt from 'jsonwebtoken';
import User from './models/User';

export interface AuthenticatedRequest {
  user?: any;
}

export const protect = async (token: string) => {
  if (!token || !token.startsWith('Bearer ')) {
    throw new Error('Not authorized, no token');
  }

  try {
    const jwtToken = token.split(' ')[1];
    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET || 'secret123') as { id: string };
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    throw new Error('Not authorized, token failed');
  }
};