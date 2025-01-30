/*
 * User Model
 */

import { db } from "../lib/db.server";
import type { User } from "@prisma/client";
import { z } from "zod";
import bcrypt from "bcryptjs";

// Basic Configuration
const VERIFY_EMAIL = true;
const VERIFICATION_TOKEN_EXPIRATION_TIME = 1000 * 60 * 60 * 24; // 1 day
const PASSWORD_SALT_ROUNDS = 10;
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 128;

// Zod schemas for validation
const createUserSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string()
    .min(PASSWORD_MIN_LENGTH, "Password must be at least 8 characters")
    .max(PASSWORD_MAX_LENGTH, "Password must be at most 128 characters"),
});

const signInWithPasswordAndEmailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

const updateUserSchema = z.object({
  email: z.string().email().optional(),
  verificationToken: z.string().nullable().optional(),
  verificationTokenExpiresAt: z.date().nullable().optional(),
  emailVerifiedAt: z.date().nullable().optional()
});

const idSchema = z.string().uuid();

/*
 * User Service
 * The model for interacting with the user table
 */

export class UserService {

  // Find a user by their id
  static async findById(id: string): Promise<User | null> {
    const validatedId = idSchema.parse(id);
    return db.user.findUnique({
      where: { id: validatedId, deletedAt: null }
    });
  }

  // Find a user by their email
  static async findByEmail(email: string): Promise<User | null> {
    const validatedEmail = z.string().email().parse(email);
    return db.user.findFirst({
      where: { email: validatedEmail, deletedAt: null }
    });
  }

  // Sign In with Password and Email
  static async signInWithPasswordAndEmail(data: z.infer<typeof signInWithPasswordAndEmailSchema>): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const validated = signInWithPasswordAndEmailSchema.parse(data);
    const user = await this.findByEmail(validated.email);
    if (!user) {
      throw new Error("Invalid email or password");
    }
    if (!bcrypt.compareSync(validated.password, user.password ?? "")) {
      throw new Error("Invalid email or password");
    }

    // TODO: Create a session

    return user;
  }

  // Create a new user
  static async signUpWithPasswordAndEmail(data: z.infer<typeof createUserSchema>): Promise<User> {
    const validated = createUserSchema.parse(data);
    const hashedPassword = await bcrypt.hash(validated.password, PASSWORD_SALT_ROUNDS);

    return db.user.create({
      data: {
        email: validated.email,
        password: hashedPassword
      }
    });
  }

  // update a user
  static async update(
    id: string,
    data: z.infer<typeof updateUserSchema>
  ): Promise<User> {
    const validatedId = idSchema.parse(id);
    const validatedData = updateUserSchema.parse(data);

    return db.user.update({
      where: { id: validatedId },
      data: validatedData
    });
  }

  static async softDelete(id: string): Promise<User> {
    const validatedId = idSchema.parse(id);
    return db.user.update({
      where: { id: validatedId },
      data: { deletedAt: new Date() }
    });
  }

  // Set a verification token for a user
  static async setVerificationToken(
    userId: string,
    token: string,
    expiresAt: Date
  ): Promise<User> {
    const validatedId = idSchema.parse(userId);
    const validatedToken = z.string().min(1).parse(token);
    const validatedDate = z.date().parse(expiresAt);

    return this.update(validatedId, {
      verificationToken: validatedToken,
      verificationTokenExpiresAt: validatedDate
    });
  }

  // Verify a user's email
  static async verifyEmail(userId: string): Promise<User> {
    const validatedId = idSchema.parse(userId);
    return this.update(validatedId, {
      emailVerifiedAt: new Date(),
      verificationToken: null,
      verificationTokenExpiresAt: null
    });
  }
}