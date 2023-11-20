import { router } from "../trpc";
import { leadsRouter } from "./leads";
import { authRouter } from "./auth";
import { opportunitiesRouter } from "./opportunities";
import { photosRouter } from "./photos";
import { issuesRouter } from "./issues";
import { issueTemplatesRouter } from "./issueTemplates";
import { repairTemplatesRouter } from "./repairTemplates";

export const appRouter = router({
  auth: authRouter,
  leads: leadsRouter,
  opportunities: opportunitiesRouter,
  photos: photosRouter,
  issues: issuesRouter,
  issueTemplates: issueTemplatesRouter,
  repairTemplates: repairTemplatesRouter,
});

export type AppRouter = typeof appRouter;
