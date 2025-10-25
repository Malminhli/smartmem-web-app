import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { reminders, auditLogs } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { randomUUID } from "crypto";

const createReminderSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  label: z.string().optional(),
  scheduleTime: z.string(), // HH:MM format
  frequency: z.enum(["once", "daily", "weekly", "monthly"]).default("daily"),
  daysOfWeek: z.array(z.number()).optional(),
  notificationMethod: z.enum(["sound", "text", "both"]).default("both"),
});

export function createRemindersRouter() {
  return router({
    // Create a new reminder
    create: protectedProcedure
      .input(createReminderSchema)
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) {
          throw new Error("Database not available");
        }

        const reminderId = randomUUID();
        const now = new Date();

        try {
          await db.insert(reminders).values({
            id: reminderId,
            userId: ctx.user!.id,
            title: input.title,
            description: input.description,
            label: input.label,
            scheduleTime: input.scheduleTime,
            frequency: input.frequency,
            daysOfWeek: input.daysOfWeek,
            notificationMethod: input.notificationMethod,
            isActive: true,
            createdAt: now,
            updatedAt: now,
          });

          return {
            id: reminderId,
            status: "success",
            message: "Reminder created successfully",
          };
        } catch (error) {
          console.error("Failed to create reminder:", error);
          throw new Error("Failed to create reminder");
        }
      }),

    // Get all reminders for a user
    list: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      try {
        const result = await db
          .select()
          .from(reminders)
          .where(eq(reminders.userId, ctx.user!.id));

        return {
          reminders: result,
          count: result.length,
        };
      } catch (error) {
        console.error("Failed to list reminders:", error);
        throw new Error("Failed to list reminders");
      }
    }),

    // Get a single reminder
    get: protectedProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) {
          throw new Error("Database not available");
        }

        try {
          const result = await db
            .select()
            .from(reminders)
            .where(
              and(
                eq(reminders.id, input.id),
                eq(reminders.userId, ctx.user!.id)
              )
            )
            .limit(1);

          return result.length > 0 ? result[0] : null;
        } catch (error) {
          console.error("Failed to get reminder:", error);
          throw new Error("Failed to get reminder");
        }
      }),

    // Update a reminder
    update: protectedProcedure
      .input(
        z.object({
          id: z.string(),
          data: createReminderSchema.partial(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) {
          throw new Error("Database not available");
        }

        try {
          await db
            .update(reminders)
            .set({
              ...input.data,
              updatedAt: new Date(),
            })
            .where(
              and(
                eq(reminders.id, input.id),
                eq(reminders.userId, ctx.user!.id)
              )
            );

          return {
            success: true,
            message: "Reminder updated successfully",
          };
        } catch (error) {
          console.error("Failed to update reminder:", error);
          throw new Error("Failed to update reminder");
        }
      }),

    // Toggle reminder active status
    toggle: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) {
          throw new Error("Database not available");
        }

        try {
          const reminder = await db
            .select()
            .from(reminders)
            .where(
              and(
                eq(reminders.id, input.id),
                eq(reminders.userId, ctx.user!.id)
              )
            )
            .limit(1);

          if (reminder.length === 0) {
            throw new Error("Reminder not found");
          }

          await db
            .update(reminders)
            .set({
              isActive: !reminder[0].isActive,
              updatedAt: new Date(),
            })
            .where(eq(reminders.id, input.id));

          return {
            success: true,
            isActive: !reminder[0].isActive,
          };
        } catch (error) {
          console.error("Failed to toggle reminder:", error);
          throw new Error("Failed to toggle reminder");
        }
      }),

    // Delete a reminder
    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) {
          throw new Error("Database not available");
        }

        try {
          await db
            .delete(reminders)
            .where(
              and(
                eq(reminders.id, input.id),
                eq(reminders.userId, ctx.user!.id)
              )
            );

          return {
            success: true,
            message: "Reminder deleted successfully",
          };
        } catch (error) {
          console.error("Failed to delete reminder:", error);
          throw new Error("Failed to delete reminder");
        }
      }),
  });
}

