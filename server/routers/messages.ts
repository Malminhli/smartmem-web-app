import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { messages } from "../../drizzle/schema";
import { eq, and, desc } from "drizzle-orm";
import { randomUUID } from "crypto";
import { encryptMessage, decryptMessage } from "../_core/messageService";

const createMessageSchema = z.object({
  subject: z.string().optional(),
  content: z.string().min(1),
  messageType: z.enum(["notification", "reminder", "alert", "contact", "system"]).default("notification"),
  recipientId: z.string().optional(),
});

const listMessagesSchema = z.object({
  limit: z.number().default(20),
  offset: z.number().default(0),
  unreadOnly: z.boolean().default(false),
});

const markAsReadSchema = z.object({
  messageId: z.string(),
});

export function createMessagesRouter() {
  return router({
    // Create a new message
    create: protectedProcedure
      .input(createMessageSchema)
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) {
          throw new Error("Database not available");
        }

        try {
          const messageId = randomUUID();
          
          // Encrypt message content
          // For now, use a simple encryption - in production, use user's password
          const userPassword = ctx.user?.id || "default";
          const { encrypted, iv, salt, authTag } = encryptMessage(
            JSON.stringify({
              subject: input.subject,
              content: input.content,
            }),
            userPassword
          );

          await db.insert(messages).values({
            id: messageId,
            userId: ctx.user!.id,
            senderId: input.recipientId || "system",
            subject: input.subject,
            content: encrypted,
            messageType: input.messageType,
            encryptionIv: iv,
            encryptionSalt: salt,
            isRead: false,
          });

          return {
            id: messageId,
            success: true,
          };
        } catch (error) {
          console.error("Failed to create message:", error);
          throw new Error("Failed to create message");
        }
      }),

    // List user's messages
    list: protectedProcedure
      .input(listMessagesSchema)
      .query(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) {
          throw new Error("Database not available");
        }

        try {
          let whereCondition: any = eq(messages.userId, ctx.user!.id);

          if (input.unreadOnly) {
            whereCondition = and(
              eq(messages.userId, ctx.user!.id),
              eq(messages.isRead, false)
            );
          }

          const userMessages = await db
            .select()
            .from(messages)
            .where(whereCondition)
            .orderBy(desc(messages.createdAt))
            .limit(input.limit)
            .offset(input.offset);

          // Decrypt messages
          const decryptedMessages = userMessages.map((msg) => {
            try {
              const userPassword = ctx.user?.id || "default";
              const decrypted = decryptMessage(
                msg.content,
                userPassword,
                msg.encryptionIv,
                msg.encryptionSalt,
                msg.encryptionIv // Note: should store authTag separately
              );
              const parsed = JSON.parse(decrypted);
              return {
                ...msg,
                subject: parsed.subject,
                content: parsed.content,
              };
            } catch (error) {
              console.error("Failed to decrypt message:", error);
              return {
                ...msg,
                content: "[Encrypted message - decryption failed]",
              };
            }
          });

          return {
            messages: decryptedMessages,
            total: decryptedMessages.length,
          };
        } catch (error) {
          console.error("Failed to list messages:", error);
          throw new Error("Failed to list messages");
        }
      }),

    // Mark message as read
    markAsRead: protectedProcedure
      .input(markAsReadSchema)
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) {
          throw new Error("Database not available");
        }

        try {
          await db
            .update(messages)
            .set({
              isRead: true,
              readAt: new Date(),
            })
            .where(
              and(
                eq(messages.id, input.messageId),
                eq(messages.userId, ctx.user!.id)
              )
            );

          return { success: true };
        } catch (error) {
          console.error("Failed to mark message as read:", error);
          throw new Error("Failed to mark message as read");
        }
      }),

    // Delete a message
    delete: protectedProcedure
      .input(z.object({ messageId: z.string() }))
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) {
          throw new Error("Database not available");
        }

        try {
          await db
            .delete(messages)
            .where(
              and(
                eq(messages.id, input.messageId),
                eq(messages.userId, ctx.user!.id)
              )
            );

          return { success: true };
        } catch (error) {
          console.error("Failed to delete message:", error);
          throw new Error("Failed to delete message");
        }
      }),

    // Get unread count
    getUnreadCount: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      try {
        const result = await db
          .select()
          .from(messages)
          .where(
            and(
              eq(messages.userId, ctx.user!.id),
              eq(messages.isRead, false)
            )
          );

        return { unreadCount: result.length };
      } catch (error) {
        console.error("Failed to get unread count:", error);
        throw new Error("Failed to get unread count");
      }
    }),
  });
}

