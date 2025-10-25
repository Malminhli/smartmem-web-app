import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { createEntriesRouter } from "./routers/entries";
import { createRemindersRouter } from "./routers/reminders";
import { createSummariesRouter } from "./routers/summaries";
import { createContactsRouter } from "./routers/contacts";
import { createSettingsRouter } from "./routers/settings";
import { createMessagesRouter } from "./routers/messages";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // SmartMem Feature Routers
  entries: createEntriesRouter(),
  reminders: createRemindersRouter(),
  summaries: createSummariesRouter(),
  contacts: createContactsRouter(),
  settings: createSettingsRouter(),
  messages: createMessagesRouter(),

  // Health check
  health: publicProcedure.query(() => ({
    status: "ok",
    timestamp: new Date().toISOString(),
  })),
});

export type AppRouter = typeof appRouter;

