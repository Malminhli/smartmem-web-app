import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { entries, auditLogs } from "../../drizzle/schema";
import { eq, and, desc, gte, lte } from "drizzle-orm";
import { randomUUID } from "crypto";

const createEntrySchema = z.object({
  type: z.enum(["audio", "image", "text"]),
  transcript: z.string().optional(),
  labels: z.array(z.string()).default([]),
  rawPath: z.string().optional(),
  metadata: z.object({}).passthrough().optional(),
});

type CreateEntryInput = z.infer<typeof createEntrySchema>;

const getEntriesSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  labels: z.array(z.string()).optional(),
  limit: z.number().int().positive().default(50),
  offset: z.number().int().nonnegative().default(0),
});

export function createEntriesRouter() {
  return router({
    // Create a new entry
    create: protectedProcedure
      .input(createEntrySchema)
      .mutation(async ({ input, ctx }: { input: CreateEntryInput; ctx: any }) => {
        const db = await getDb();
        if (!db) {
          throw new Error("Database not available");
        }

        const entryId = randomUUID();
        const now = new Date();

        try {
          const insertData: any = {
            id: entryId,
            userId: ctx.user!.id,
            type: input.type,
            labels: input.labels,
            timestamp: now,
            createdAt: now,
            updatedAt: now,
          };
          
          if (input.transcript) insertData.transcript = input.transcript;
          if (input.rawPath) insertData.rawPath = input.rawPath;
          if (input.metadata) insertData.metadata = input.metadata;
          
          await db.insert(entries).values(insertData);

          // Log the action
          await logAction(db, ctx.user!.id, "entry_created", "entry", entryId);

          return {
            id: entryId,
            status: "success",
            message: "Entry created successfully",
          };
        } catch (error) {
          console.error("Failed to create entry:", error);
          throw new Error("Failed to create entry");
        }
      }),

    // Get entries for a user
    list: protectedProcedure
      .input(getEntriesSchema)
      .query(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) {
          throw new Error("Database not available");
        }

        try {
          let conditions = [eq(entries.userId, ctx.user!.id)];
          
          if (input.startDate) {
            const startDate = new Date(input.startDate);
            conditions.push(gte(entries.timestamp, startDate));
          }
          
          if (input.endDate) {
            const endDate = new Date(input.endDate);
            conditions.push(lte(entries.timestamp, endDate));
          }
          
          const result = await db
            .select()
            .from(entries)
            .where(and(...conditions))
            .orderBy(desc(entries.timestamp))
            .limit(input.limit)
            .offset(input.offset);

          return {
            entries: result,
            count: result.length,
          };
        } catch (error) {
          console.error("Failed to list entries:", error);
          throw new Error("Failed to list entries");
        }
      }),

    // Get a single entry
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
            .from(entries)
            .where(
              and(
                eq(entries.id, input.id),
                eq(entries.userId, ctx.user!.id)
              )
            )
            .limit(1);

          return result.length > 0 ? result[0] : null;
        } catch (error) {
          console.error("Failed to get entry:", error);
          throw new Error("Failed to get entry");
        }
      }),

    // Update entry labels
    updateLabels: protectedProcedure
      .input(
        z.object({
          id: z.string(),
          labels: z.array(z.string()),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) {
          throw new Error("Database not available");
        }

        try {
          await db
            .update(entries)
            .set({
              labels: input.labels,
              updatedAt: new Date(),
            })
            .where(
              and(
                eq(entries.id, input.id),
                eq(entries.userId, ctx.user!.id)
              )
            );

          await logAction(db, ctx.user!.id, "entry_updated", "entry", input.id);

          return {
            success: true,
            message: "Labels updated successfully",
          };
        } catch (error) {
          console.error("Failed to update labels:", error);
          throw new Error("Failed to update labels");
        }
      }),

    // Delete an entry
    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) {
          throw new Error("Database not available");
        }

        try {
          await db
            .delete(entries)
            .where(
              and(
                eq(entries.id, input.id),
                eq(entries.userId, ctx.user!.id)
              )
            );

          await logAction(db, ctx.user!.id, "entry_deleted", "entry", input.id);

          return {
            success: true,
            message: "Entry deleted successfully",
          };
        } catch (error) {
          console.error("Failed to delete entry:", error);
          throw new Error("Failed to delete entry");
        }
      }),

    // Search entries by transcript
    search: protectedProcedure
      .input(z.object({ query: z.string() }))
      .query(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) {
          throw new Error("Database not available");
        }

        try {
          // Simple text search - in production, use full-text search
          const result = await db
            .select()
            .from(entries)
            .where(eq(entries.userId, ctx.user!.id));

          const filtered = result.filter(
            entry =>
              entry.transcript?.includes(input.query) ||
              entry.labels?.some(label =>
                label.toLowerCase().includes(input.query.toLowerCase())
              )
          );

          return {
            entries: filtered,
            count: filtered.length,
          };
        } catch (error) {
          console.error("Failed to search entries:", error);
          throw new Error("Failed to search entries");
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

