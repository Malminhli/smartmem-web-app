/**
 * Simple Authentication System
 * بديل بسيط للمصادقة بدون الاعتماد على OAuth الخارجي
 */

import { SignJWT, jwtVerify } from "jose";
import type { Request, Response } from "express";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "smartmem-secret-key-2025"
);

export interface SimpleUser {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

// تخزين مؤقت للمستخدمين (في الإنتاج، استخدم قاعدة البيانات)
const users: Map<string, SimpleUser> = new Map();

// مستخدم تجريبي
const demoUser: SimpleUser = {
  id: "demo-user-001",
  name: "المستخدم التجريبي",
  email: "demo@smartmem.app",
  createdAt: new Date(),
};

users.set(demoUser.id, demoUser);

export async function createSessionToken(userId: string, expiresInMs: number = 365 * 24 * 60 * 60 * 1000): Promise<string> {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(Math.floor(Date.now() / 1000) + Math.floor(expiresInMs / 1000))
    .sign(JWT_SECRET);

  return token;
}

export async function verifySessionToken(token: string): Promise<{ userId: string } | null> {
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    return verified.payload as { userId: string };
  } catch (error) {
    return null;
  }
}

export function getUser(userId: string): SimpleUser | undefined {
  return users.get(userId);
}

export function getAllUsers(): SimpleUser[] {
  return Array.from(users.values());
}

export function createUser(name: string, email: string): SimpleUser {
  const userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const user: SimpleUser = {
    id: userId,
    name,
    email,
    createdAt: new Date(),
  };
  users.set(userId, user);
  return user;
}

export function getDemoUser(): SimpleUser {
  return demoUser;
}

export async function handleLogin(req: Request, res: Response): Promise<void> {
  try {
    const { email, name } = req.body;

    if (!email) {
      res.status(400).json({ error: "البريد الإلكتروني مطلوب" });
      return;
    }

    // البحث عن مستخدم موجود أو إنشاء واحد جديد
    let user = Array.from(users.values()).find(u => u.email === email);
    
    if (!user) {
      user = createUser(name || email, email);
    }

    // إنشاء token
    const token = await createSessionToken(user.id);

    // تعيين الـ cookie
    res.cookie("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 365 * 24 * 60 * 60 * 1000, // سنة واحدة
    });

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("[SimpleAuth] Login failed:", error);
    res.status(500).json({ error: "فشل تسجيل الدخول" });
  }
}

export async function handleDemoLogin(req: Request, res: Response): Promise<void> {
  try {
    const token = await createSessionToken(demoUser.id);

    res.cookie("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 365 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      user: {
        id: demoUser.id,
        name: demoUser.name,
        email: demoUser.email,
      },
    });
  } catch (error) {
    console.error("[SimpleAuth] Demo login failed:", error);
    res.status(500).json({ error: "فشل تسجيل الدخول التجريبي" });
  }
}

export async function handleLogout(req: Request, res: Response): Promise<void> {
  res.clearCookie("session");
  res.json({ success: true });
}

export async function getCurrentUser(req: Request): Promise<SimpleUser | null> {
  const token = req.cookies.session;
  
  if (!token) {
    return null;
  }

  const payload = await verifySessionToken(token);
  
  if (!payload) {
    return null;
  }

  return getUser(payload.userId) || null;
}

