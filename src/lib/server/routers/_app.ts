import { router } from "../trpc";
import { leadsRouter } from "./leads";
import { authRouter } from "./auth";
import { opportunitiesRouter } from "./opportunities";

export const appRouter = router({
  auth: authRouter,
  leads: leadsRouter,
  opportunities: opportunitiesRouter,
});

export type AppRouter = typeof appRouter;
