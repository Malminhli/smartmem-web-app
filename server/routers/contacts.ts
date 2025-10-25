import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { trustedContacts } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { randomUUID } from "crypto";

const createContactSchema = z.object({
  name: z.string().min(1),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  role: z.enum(["caregiver", "family", "doctor", "emergency"]).default("caregiver"),
  canViewData: z.boolean().default(false),
  canEditReminders: z.boolean().default(false),
  canReceiveAlerts: z.boolean().default(true),
});

export function createContactsRouter() {
  return router({
    // Create a new trusted contact
    create: protectedProcedure
      .input(createContactSchema)
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) {
          throw new Error("Database not available");
        }

        if (!input.phone && !input.email) {
          throw new Error("Phone or email is required");
        }

        const contactId = randomUUID();

        try {
          await db.insert(trustedContacts).values({
            id: contactId,
            userId: ctx.user!.id,
            name: input.name,
            phone: input.phone,
            email: input.email,
            relationship: input.role,
            canViewEntries: input.canViewData,
            canManageReminders: input.canEditReminders,
            notifyOnAlert: input.canReceiveAlerts,
          });

          return {
            id: contactId,
            status: "success",
            message: "Contact added successfully",
          };
        } catch (error) {
          console.error("Failed to create contact:", error);
          throw new Error("Failed to create contact");
        }
      }),

    // Get all trusted contacts
    list: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      try {
        const result = await db
          .select()
          .from(trustedContacts)
          .where(eq(trustedContacts.userId, ctx.user!.id));

        return {
          contacts: result,
          count: result.length,
        };
      } catch (error) {
        console.error("Failed to list contacts:", error);
        throw new Error("Failed to list contacts");
      }
    }),

    // Get a single contact
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
            .from(trustedContacts)
            .where(
              and(
                eq(trustedContacts.id, input.id),
                eq(trustedContacts.userId, ctx.user!.id)
              )
            )
            .limit(1);

          return result.length > 0 ? result[0] : null;
        } catch (error) {
          console.error("Failed to get contact:", error);
          throw new Error("Failed to get contact");
        }
      }),

    // Update a contact
    update: protectedProcedure
      .input(
        z.object({
          id: z.string(),
          data: createContactSchema.partial(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) {
          throw new Error("Database not available");
        }

        try {
          await db
            .update(trustedContacts)
            .set(input.data)
            .where(
              and(
                eq(trustedContacts.id, input.id),
                eq(trustedContacts.userId, ctx.user!.id)
              )
            );

          return {
            success: true,
            message: "Contact updated successfully",
          };
        } catch (error) {
          console.error("Failed to update contact:", error);
          throw new Error("Failed to update contact");
        }
      }),

    // Delete a contact
    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) {
          throw new Error("Database not available");
        }

        try {
          await db
            .delete(trustedContacts)
            .where(
              and(
                eq(trustedContacts.id, input.id),
                eq(trustedContacts.userId, ctx.user!.id)
              )
            );

          return {
            success: true,
            message: "Contact deleted successfully",
          };
        } catch (error) {
          console.error("Failed to delete contact:", error);
          throw new Error("Failed to delete contact");
        }
      }),

    // Get contacts by role
    getByRole: protectedProcedure
      .input(z.object({ role: z.enum(["caregiver", "family", "doctor", "emergency"]) }))
      .query(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) {
          throw new Error("Database not available");
        }

        try {
          const result = await db
            .select()
            .from(trustedContacts)
            .where(
              eq(trustedContacts.userId, ctx.user!.id)
            );

          return {
            contacts: result,
            count: result.length,
          };
        } catch (error) {
          console.error("Failed to get contacts by role:", error);
          throw new Error("Failed to get contacts by role");
        }
      }),
  });
}

