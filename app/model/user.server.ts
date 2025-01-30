/*
 * User Model
 */

import { db } from "../lib/db.server";
import type { Session, User } from "@prisma/client";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { createCookieSessionStorage } from "react-router";
import { Mail } from "~/lib/mail.server";

// Basic Configuration
const VERIFY_EMAIL = true;
const VERIFICATION_TOKEN_EXPIRATION_TIME = 1000 * 60 * 60 * 24; // 1 day
const PASSWORD_SALT_ROUNDS = 10;
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 128;
const SESSION_DURATION = 1000 * 60 * 60 * 24; // 1 day

// Zod schemas for validation
const createUserSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string()
    .min(PASSWORD_MIN_LENGTH, "Password must be at least 8 characters")
    .max(PASSWORD_MAX_LENGTH, "Password must be at most 128 characters"),
});

const signUpWithPasswordAndEmailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string()
    .min(PASSWORD_MIN_LENGTH, "Password must be at least 8 characters")
    .max(PASSWORD_MAX_LENGTH, "Password must be at most 128 characters"),
  confirmPassword: z.string().min(1, "Confirm Password is required"),
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

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET!],
    secure: process.env.NODE_ENV === "production",
  },
});

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
  static async signInWithPasswordAndEmail(
    data: z.infer<typeof signInWithPasswordAndEmailSchema>
  ): Promise<{ user: User; session: Session; headers: Headers }> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const validated = signInWithPasswordAndEmailSchema.parse(data);
    const user = await this.findByEmail(validated.email);

    if (!user) {
      throw new Error("Invalid email or password");
    }
    if (!bcrypt.compareSync(validated.password, user.password ?? "")) {
      throw new Error("Invalid email or password");
    }
    if (VERIFY_EMAIL && !user.emailVerifiedAt) {
      throw new Error("Email not verified. Please check your inbox.");
    }
    const { session, headers } = await this.createSession(user.id);
    return { user, session, headers };
  }

  // Create a new user
  static async signUpWithPasswordAndEmail(data: z.infer<typeof signUpWithPasswordAndEmailSchema>): Promise<User> {
    const validated = signUpWithPasswordAndEmailSchema.parse(data);
    if (validated.password !== validated.confirmPassword) {
      throw new Error("Passwords do not match");
    }
    const hashedPassword = await bcrypt.hash(validated.password, PASSWORD_SALT_ROUNDS);
    const emailVerifiedAt = VERIFY_EMAIL ? new Date() : null;
    if (VERIFY_EMAIL) {
      const token = crypto.randomUUID();
      await this.setVerificationToken({ userId: validated.email, token, expiresAt: new Date(Date.now() + VERIFICATION_TOKEN_EXPIRATION_TIME) });
      await this.sendVerificationEmail({ userId: validated.email, resetPassword: false });
    }
    return db.user.create({
      data: {
        email: validated.email,
        password: hashedPassword,
        emailVerifiedAt
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
  static async setVerificationToken({ userId, token, expiresAt }: { userId: string, token: string, expiresAt: Date }): Promise<User> {
    const validatedId = idSchema.parse(userId);
    const validatedToken = z.string().min(1).parse(token);
    const validatedDate = z.date().parse(expiresAt);

    return this.update(validatedId, {
      verificationToken: validatedToken,
      verificationTokenExpiresAt: validatedDate
    });
  }

  static async sendVerificationEmail({ userId, resetPassword }: { userId: string, resetPassword: boolean }): Promise<void> {
    const user = await this.findById(userId);
    const url = `${process.env.APP_URL}/auth/login/otp/verify?token=${user?.verificationToken}${resetPassword ? `&resetPassword=true` : ""}`;
    await Mail.sendEmail({
      to: user?.email ?? "",
      subject: process.env.APP_NAME + " - " + (resetPassword ? "Reset your password" : "Verify your email"),
      body: `Click <a href="${url}">here</a> to ${resetPassword ? "reset your password" : "verify your email"}.`
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

  /*
   *
   * Session
   * 
   * 
  */

  // Logout a user
  static async logout(request: Request) {
    const cookieSession = await sessionStorage.getSession(
      request.headers.get("Cookie")
    );
    const sessionId = cookieSession.get("sessionId");
    const user = await this.getSessionUser(sessionId);
    await this.invalidateAllUserSessions(user?.id ?? "");
  }

  // Get the user of a session
  static async getSessionUser(sessionId: string): Promise<User | null> {
    const session = await db.session.findUnique({
      where: {
        id: sessionId,
        deletedAt: null,
        expiresAt: { gt: new Date() }
      },
      include: { user: true }
    });

    return session?.user ?? null;
  }

  static async invalidateSession(sessionId: string): Promise<void> {
    await db.session.delete({
      where: { id: sessionId },
    });
  }

  static async invalidateAllUserSessions(userId: string): Promise<void> {
    console.log("invalidateAllUserSessions", userId);
    await db.session.deleteMany({
      where: { userId },
    });
  }

  static async createSession(userId: string): Promise<{ session: Session; headers: Headers }> {
    const validatedId = idSchema.parse(userId);
    const expiresAt = new Date(Date.now() + SESSION_DURATION);
    // Invalidate all sessions for the user
    await this.invalidateAllUserSessions(validatedId);

    // Create a new session for the user
    const session = await db.session.create({
      data: {
        userId: validatedId,
        expiresAt,
      },
    });

    const cookieSession = await sessionStorage.getSession();
    cookieSession.set("sessionId", session.id);

    return {
      session,
      headers: new Headers({
        "Set-Cookie": await sessionStorage.commitSession(cookieSession),
      }),
    };
  }

  static async checkServerSideAuth(request: Request) {
    const cookieSession = await sessionStorage.getSession(
      request.headers.get("Cookie")
    );
    const sessionId = cookieSession.get("sessionId");

    if (!sessionId) {
      return { isAuthenticated: false, user: null };
    }

    const user = await this.getSessionUser(sessionId);
    if (!user) {
      return { isAuthenticated: false, user: null };
    }

    return { isAuthenticated: true, user };
  }
}
