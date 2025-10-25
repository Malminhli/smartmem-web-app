import crypto from "crypto";

/**
 * Encryption Service
 * Handles AES-256 encryption/decryption for sensitive data
 */

const ALGORITHM = "aes-256-gcm";
const SALT_LENGTH = 16;
const TAG_LENGTH = 16;
const IV_LENGTH = 12;

/**
 * Derive encryption key from password using PBKDF2
 */
export function deriveKey(password: string, salt: Buffer): Buffer {
  return crypto.pbkdf2Sync(password, salt, 100000, 32, "sha256");
}

/**
 * Encrypt data using AES-256-GCM
 */
export function encryptData(data: string, encryptionKey: string): string {
  try {
    // Generate random salt and IV
    const salt = crypto.randomBytes(SALT_LENGTH);
    const iv = crypto.randomBytes(IV_LENGTH);

    // Derive key from encryption key
    const key = deriveKey(encryptionKey, salt);

    // Create cipher
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    // Encrypt data
    let encrypted = cipher.update(data, "utf8", "hex");
    encrypted += cipher.final("hex");

    // Get authentication tag
    const tag = cipher.getAuthTag();

    // Combine salt + iv + tag + encrypted data
    const result = Buffer.concat([salt, iv, tag, Buffer.from(encrypted, "hex")]);

    return result.toString("base64");
  } catch (error) {
    console.error("Encryption error:", error);
    throw new Error("Failed to encrypt data");
  }
}

/**
 * Decrypt data using AES-256-GCM
 */
export function decryptData(encryptedData: string, encryptionKey: string): string {
  try {
    // Decode from base64
    const buffer = Buffer.from(encryptedData, "base64");

    // Extract components
    const salt = buffer.slice(0, SALT_LENGTH);
    const iv = buffer.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
    const tag = buffer.slice(SALT_LENGTH + IV_LENGTH, SALT_LENGTH + IV_LENGTH + TAG_LENGTH);
    const encrypted = buffer.slice(SALT_LENGTH + IV_LENGTH + TAG_LENGTH);

    // Derive key from encryption key
    const key = deriveKey(encryptionKey, salt);

    // Create decipher
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);

    // Decrypt data
    let decrypted = decipher.update(encrypted);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString("utf8");
  } catch (error) {
    console.error("Decryption error:", error);
    throw new Error("Failed to decrypt data");
  }
}

/**
 * Hash sensitive data (one-way)
 */
export function hashData(data: string): string {
  return crypto.createHash("sha256").update(data).digest("hex");
}

/**
 * Generate a secure random token
 */
export function generateToken(length: number = 32): string {
  return crypto.randomBytes(length).toString("hex");
}

/**
 * Verify password against hash
 */
export function verifyPassword(password: string, hash: string): boolean {
  const passwordHash = hashData(password);
  return crypto.timingSafeEqual(Buffer.from(passwordHash), Buffer.from(hash));
}

/**
 * Sanitize data for storage
 */
export function sanitizeForStorage(data: string): string {
  // Remove sensitive patterns
  let sanitized = data
    .replace(/\b\d{3}-\d{2}-\d{4}\b/g, "***-**-****") // SSN
    .replace(/\b\d{16}\b/g, "****-****-****-****") // Credit card
    .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, "[email]"); // Email

  return sanitized;
}

/**
 * Validate encryption key strength
 */
export function validateKeyStrength(key: string): {
  isValid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  if (key.length < 16) {
    issues.push("Key must be at least 16 characters long");
  }

  if (!/[A-Z]/.test(key)) {
    issues.push("Key must contain uppercase letters");
  }

  if (!/[a-z]/.test(key)) {
    issues.push("Key must contain lowercase letters");
  }

  if (!/[0-9]/.test(key)) {
    issues.push("Key must contain numbers");
  }

  if (!/[!@#$%^&*]/.test(key)) {
    issues.push("Key must contain special characters");
  }

  return {
    isValid: issues.length === 0,
    issues,
  };
}

/**
 * Create a secure session token
 */
export function createSessionToken(): {
  token: string;
  expiresAt: Date;
} {
  const token = generateToken(32);
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  return { token, expiresAt };
}

