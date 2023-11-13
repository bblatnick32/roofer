import { router } from "../trpc";
import { leadsRouter } from "./leads";
import { authRouter } from "./auth";
import { opportunitiesRouter } from "./opportunities";
import { photosRouter } from "./photos";
import { workItemsRouter } from "./workItems";
import { issueTemplatesRouter } from "./issueTemplates";
import { repairTemplatesRouter } from "./repairTemplates";

export const appRouter = router({
  auth: authRouter,
  leads: leadsRouter,
  opportunities: opportunitiesRouter,
  photos: photosRouter,
  workItems: workItemsRouter,
  issueTemplates: issueTemplatesRouter,
  repairTemplates: repairTemplatesRouter,
});

export type AppRouter = typeof appRouter;
