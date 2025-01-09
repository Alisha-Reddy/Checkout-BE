// src/types/express.d.ts

import { User } from '@prisma/client'; // Import User type if you're using Prisma

declare global {
  namespace Express {
    interface Request {
      user?: User; // You can specify a custom type for user, e.g., User from Prisma
    }
  }
}
