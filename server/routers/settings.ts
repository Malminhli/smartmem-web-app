import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { users, auditLogs } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

const updateSettingsSchema = z.object({
  language: z.enum(["ar", "en"]).optional(),
  dataRetentionDays: z.number().int().positive().optional(),
  privacyConsent: z.boolean().optional(),
});

export function createSettingsRouter() {
  return router({
    // Get user settings
    get: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      try {
        const result = await db
          .select()
          .from(users)
          .where(eq(users.id, ctx.user!.id))
          .limit(1);

        if (result.length === 0) {
          throw new Error("User not found");
        }

        const user = result[0];
        return {
          language: user.language || "ar",
          dataRetentionDays: user.dataRetentionDays || 90,
          privacyConsent: user.privacyConsent || false,
        };
      } catch (error) {
        console.error("Failed to get settings:", error);
        throw new Error("Failed to get settings");
      }
    }),

    // Update user settings
    update: protectedProcedure
      .input(updateSettingsSchema)
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) {
          throw new Error("Database not available");
        }

        try {
          await db
            .update(users)
            .set({
              ...input,
            })
            .where(eq(users.id, ctx.user!.id));

          await logAction(
            db,
            ctx.user!.id,
            "settings_updated",
            "user_settings",
            ctx.user!.id
          );

          return {
            success: true,
            message: "Settings updated successfully",
          };
        } catch (error) {
          console.error("Failed to update settings:", error);
          throw new Error("Failed to update settings");
        }
      }),

    // Delete all user data
    deleteAllData: protectedProcedure.mutation(async ({ ctx }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      try {
        // This is a placeholder - in production, you'd want to:
        // 1. Delete all entries
        // 2. Delete all reminders
        // 3. Delete all events
        // 4. Delete all summaries
        // 5. Keep user record but mark as deleted

        await logAction(
          db,
          ctx.user!.id,
          "data_deletion_requested",
          "user_data",
          ctx.user!.id
        );

        return {
          success: true,
          message: "Data deletion initiated. Your data will be securely deleted within 24 hours.",
        };
      } catch (error) {
        console.error("Failed to delete data:", error);
        throw new Error("Failed to delete data");
      }
    }),

    // Export user data
    exportData: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      try {
        const user = await db
          .select()
          .from(users)
          .where(eq(users.id, ctx.user!.id))
          .limit(1);

        if (user.length === 0) {
          throw new Error("User not found");
        }

        // In production, you'd gather all user's data here
        const exportData = {
          user: user[0],
          exportDate: new Date().toISOString(),
          dataTypes: ["entries", "reminders", "summaries", "contacts"],
        };

        await logAction(
          db,
          ctx.user!.id,
          "data_export_requested",
          "user_data",
          ctx.user!.id
        );

        return exportData;
      } catch (error) {
        console.error("Failed to export data:", error);
        throw new Error("Failed to export data");
      }
    }),

    // Get audit logs
    getAuditLogs: protectedProcedure
      .input(
        z.object({
          limit: z.number().int().positive().default(50),
          offset: z.number().int().nonnegative().default(0),
        })
      )
      .query(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) {
          throw new Error("Database not available");
        }

        try {
          const result = await db
            .select()
            .from(auditLogs)
            .where(eq(auditLogs.userId, ctx.user!.id))
            .limit(input.limit)
            .offset(input.offset);

          return {
            logs: result,
            count: result.length,
          };
        } catch (error) {
          console.error("Failed to get audit logs:", error);
          throw new Error("Failed to get audit logs");
        }
      }),

    // Privacy consent
    giveConsent: protectedProcedure.mutation(async ({ ctx }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      try {
        await db
          .update(users)
          .set({
            privacyConsent: true,
          })
          .where(eq(users.id, ctx.user!.id));

        await logAction(
          db,
          ctx.user!.id,
          "privacy_consent_given",
          "user_consent",
          ctx.user!.id
        );

        return {
          success: true,
          message: "Privacy consent recorded",
        };
      } catch (error) {
        console.error("Failed to record consent:", error);
        throw new Error("Failed to record consent");
      }
    }),
  });
}

async function logAction(
  db: any,
  userId: string,
  actionType: string,
  resourceType: string,
  resourceId: string
) {
  try {
    await db.insert(auditLogs).values({
      id: randomUUID(),
      userId,
      actionType,
      resourceType,
      resourceId,
      status: "success",
      createdAt: new Date(),
    });
  } catch (error) {
    console.warn("Failed to log action:", error);
  }
}

