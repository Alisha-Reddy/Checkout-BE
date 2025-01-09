import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersRepository } from '../database/users.repository';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly usersRepository: UsersRepository) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const userId = req.headers['x-user-id']; // Assuming the user ID is passed in headers

    if (!userId) {
      return res.status(401).json({ message: 'User ID not provided' });
    }

    const user = await this.usersRepository.getUserById(userId as string);

    if (!user || !user.planExpiry || new Date() > new Date(user.planExpiry)) {
      return res.status(403).json({ message: 'Access denied. No valid plan.' });
    }

    next();
  }
}
