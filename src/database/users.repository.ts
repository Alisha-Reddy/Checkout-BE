// src/database/users.repository.ts

import { PrismaClient, User } from '@prisma/client'; // Importing PrismaClient and User model
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersRepository {
  private prisma = new PrismaClient();

  // Create or update a user with plan expiry
  async updateUserPlan(userId: string, data: { planExpiry: Date; email: string }) {
    try {
      const user = await this.prisma.user.upsert({
        where: { id: userId },
        update: { planExpiry: data.planExpiry }, // Update planExpiry
        create: { 
          id: userId, 
          planExpiry: data.planExpiry,
          email: data.email, // Add email when creating a new user
        },
      });

      return user;
    } catch (error) {
      console.error('Error updating user plan:', error);
      throw new Error('Error updating user plan');
    }
  }

  // Get user by ID
  async getUserById(userId: string): Promise<User | null> {
    try {
      return await this.prisma.user.findUnique({
        where: { id: userId },
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      throw new Error('Error fetching user');
    }
  }
}
