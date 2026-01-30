/**
 * Domain Entity: User
 * Pure domain model independent of infrastructure (Prisma)
 */

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPublic {
  id: string;
  email: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserWithToken {
  user: UserPublic;
  token: string;
}
