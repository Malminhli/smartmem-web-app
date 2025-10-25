import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { dailySummaries, entries } from "../../drizzle/schema";
import { eq, and, gte, lte } from "drizzle-orm";
import { randomUUID } from "crypto";

const getSummarySchema = z.object({
  date: z.string(), // YYYY-MM-DD format
});

export function createSummariesRouter() {
  return router({
    // Get or generate daily summary
    get: protectedProcedure
      .input(getSummarySchema)
      .query(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) {
          throw new Error("Database not available");
        }

        try {
          // Check if summary already exists
          const existing = await db
            .select()
            .from(dailySummaries)
            .where(
              and(
                eq(dailySummaries.userId, ctx.user!.id),
                eq(dailySummaries.date, input.date)
              )
            )
            .limit(1);

          if (existing.length > 0) {
            return existing[0];
          }

          // Generate new summary from entries
          const startDate = new Date(`${input.date}T00:00:00Z`);
          const endDate = new Date(`${input.date}T23:59:59Z`);

          const dayEntries = await db
            .select()
            .from(entries)
            .where(
              and(
                eq(entries.userId, ctx.user!.id),
                gte(entries.timestamp, startDate),
                lte(entries.timestamp, endDate)
              )
            );

          // Generate summary text
          const summary = generateSummary(dayEntries, input.date);
          const keywordCounts = countKeywords(dayEntries);
          const events = formatEvents(dayEntries);

          const summaryId = randomUUID();

          await db.insert(dailySummaries).values({
            id: summaryId,
            userId: ctx.user!.id,
            date: input.date,
            summary,
            events,
            keywordCounts,
            generatedAt: new Date(),
            updatedAt: new Date(),
          });

          return {
            id: summaryId,
            userId: ctx.user!.id,
            date: input.date,
            summary,
            events,
            keywordCounts,
            generatedAt: new Date(),
            updatedAt: new Date(),
          };
        } catch (error) {
          console.error("Failed to get summary:", error);
          throw new Error("Failed to get summary");
        }
      }),

    // Get summaries for a date range
    range: protectedProcedure
      .input(
        z.object({
          startDate: z.string(),
          endDate: z.string(),
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
            .from(dailySummaries)
            .where(
              and(
                eq(dailySummaries.userId, ctx.user!.id),
                gte(dailySummaries.date, input.startDate),
                lte(dailySummaries.date, input.endDate)
              )
            );

          return {
            summaries: result,
            count: result.length,
          };
        } catch (error) {
          console.error("Failed to get summaries:", error);
          throw new Error("Failed to get summaries");
        }
      }),

    // Export summary as PDF/text
    export: protectedProcedure
      .input(
        z.object({
          date: z.string(),
          format: z.enum(["text", "json"]).default("text"),
        })
      )
      .query(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) {
          throw new Error("Database not available");
        }

        try {
          const summary = await db
            .select()
            .from(dailySummaries)
            .where(
              and(
                eq(dailySummaries.userId, ctx.user!.id),
                eq(dailySummaries.date, input.date)
              )
            )
            .limit(1);

          if (summary.length === 0) {
            throw new Error("Summary not found");
          }

          if (input.format === "json") {
            return summary[0];
          }

          // Format as text
          const text = formatSummaryAsText(summary[0]);
          return {
            content: text,
            filename: `summary_${input.date}.txt`,
          };
        } catch (error) {
          console.error("Failed to export summary:", error);
          throw new Error("Failed to export summary");
        }
      }),
  });
}

function generateSummary(dayEntries: any[], date: string): string {
  if (dayEntries.length === 0) {
    return `لا توجد ملاحظات مسجلة في ${date}`;
  }

  const labelCounts: Record<string, number> = {};
  dayEntries.forEach(entry => {
    entry.labels?.forEach((label: string) => {
      labelCounts[label] = (labelCounts[label] || 0) + 1;
    });
  });

  const summaryParts = [];
  summaryParts.push(`ملخص اليوم - ${date}`);
  summaryParts.push(`عدد الملاحظات: ${dayEntries.length}`);

  if (Object.keys(labelCounts).length > 0) {
    summaryParts.push("الفئات المسجلة:");
    Object.entries(labelCounts).forEach(([label, count]) => {
      summaryParts.push(`  - ${label}: ${count}`);
    });
  }

  return summaryParts.join("\n");
}

function countKeywords(dayEntries: any[]): Record<string, number> {
  const counts: Record<string, number> = {};

  dayEntries.forEach(entry => {
    entry.labels?.forEach((label: string) => {
      counts[label] = (counts[label] || 0) + 1;
    });
  });

  return counts;
}

function formatEvents(
  dayEntries: any[]
): Array<{
  time: string;
  label: string;
  entryId: string;
  description?: string;
}> {
  return dayEntries
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .map(entry => ({
      time: new Date(entry.timestamp).toLocaleTimeString("ar-SA", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      label: entry.labels?.[0] || "عام",
      entryId: entry.id,
      description: entry.transcript?.substring(0, 100),
    }));
}

function formatSummaryAsText(summary: any): string {
  const lines = [
    `ملخص اليوم - ${summary.date}`,
    "=".repeat(40),
    "",
    summary.summary,
    "",
    "الأحداث:",
  ];

  if (summary.events && Array.isArray(summary.events)) {
    summary.events.forEach((event: any) => {
      lines.push(`  ${event.time} - ${event.label}`);
      if (event.description) {
        lines.push(`    ${event.description}`);
      }
    });
  }

  return lines.join("\n");
}

