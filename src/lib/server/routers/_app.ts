import { router } from "../trpc";
import { leadsRouter } from "./leads";
import { authRouter } from "./auth";

export const appRouter = router({
  auth: authRouter,
  leads: leadsRouter,
});

export type AppRouter = typeof appRouter;
