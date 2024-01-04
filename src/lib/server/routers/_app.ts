import { router } from "../trpc";
import { authRouter } from "./auth";
import { photosRouter } from "./photos";
import { issuesRouter } from "./issues";
import { issueTemplatesRouter } from "./issueTemplates";
import { repairTemplatesRouter } from "./repairTemplates";
import { contactsRouter } from "./contacts";
import { companiesRouter } from "./companies";
import { propertiesRouter } from "./properties";
import { oppsRouter } from "./opps";

export const appRouter = router({
  auth: authRouter,
  photos: photosRouter,
  issues: issuesRouter,
  issueTemplates: issueTemplatesRouter,
  repairTemplates: repairTemplatesRouter,
  contacts: contactsRouter,
  companies: companiesRouter,
  properties: propertiesRouter,
  opps: oppsRouter,
});

export type AppRouter = typeof appRouter;
