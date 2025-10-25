import crypto from "crypto";

/**
 * Secure message encryption/decryption service
 * Uses AES-256-GCM for authenticated encryption
 */

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16; // 128 bits
const SALT_LENGTH = 16; // 128 bits
const TAG_LENGTH = 16; // 128 bits

/**
 * Derive encryption key from password using PBKDF2
 */
export function deriveKey(password: string, salt: Buffer): Buffer {
  return crypto.pbkdf2Sync(password, salt, 100000, 32, "sha256");
}

/**
 * Encrypt a message with user's password
 */
export function encryptMessage(
  message: string,
  userPassword: string
): {
  encrypted: string;
  iv: string;
  salt: string;
  authTag: string;
} {
  // Generate random IV and salt
  const iv = crypto.randomBytes(IV_LENGTH);
  const salt = crypto.randomBytes(SALT_LENGTH);

  // Derive key from password
  const key = deriveKey(userPassword, salt);

  // Create cipher
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  // Encrypt message
  let encrypted = cipher.update(message, "utf8", "hex");
  encrypted += cipher.final("hex");

  // Get authentication tag
  const authTag = cipher.getAuthTag();

  return {
    encrypted,
    iv: iv.toString("hex"),
    salt: salt.toString("hex"),
    authTag: authTag.toString("hex"),
  };
}

/**
 * Decrypt a message with user's password
 */
export function decryptMessage(
  encrypted: string,
  userPassword: string,
  iv: string,
  salt: string,
  authTag: string
): string {
  try {
    // Convert hex strings back to buffers
    const ivBuffer = Buffer.from(iv, "hex");
    const saltBuffer = Buffer.from(salt, "hex");
    const authTagBuffer = Buffer.from(authTag, "hex");

    // Derive key from password using same salt
    const key = deriveKey(userPassword, saltBuffer);

    // Create decipher
    const decipher = crypto.createDecipheriv(ALGORITHM, key, ivBuffer);
    decipher.setAuthTag(authTagBuffer);

    // Decrypt message
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    console.error("Decryption failed:", error);
    throw new Error("Failed to decrypt message - invalid password or corrupted data");
  }
}

/**
 * Hash a password for verification (not used for encryption)
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16);
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha256");
  return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

/**
 * Verify a password against its hash
 */
export function verifyPassword(password: string, hash: string): boolean {
  const [saltHex, hashHex] = hash.split(":");
  const salt = Buffer.from(saltHex, "hex");
  const derivedHash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha256");
  return derivedHash.toString("hex") === hashHex;
}

