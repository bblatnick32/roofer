import { router } from "../trpc";
import { leadsRouter } from "./leads";
import { authRouter } from "./auth";
import { opportunitiesRouter } from "./opportunities";
import { photosRouter } from "./photos";
import { issuesRouter } from "./issues";
import { issueTemplatesRouter } from "./issueTemplates";
import { repairTemplatesRouter } from "./repairTemplates";
import { contactsRouter } from "./contacts";
import { companiesRouter } from "./companies";
import { propertiesRouter } from "./properties";
import { opportunityPropertiesRouter } from "./opportunityProperties";

export const appRouter = router({
  auth: authRouter,
  leads: leadsRouter,
  opportunities: opportunitiesRouter,
  photos: photosRouter,
  issues: issuesRouter,
  issueTemplates: issueTemplatesRouter,
  repairTemplates: repairTemplatesRouter,
  contacts: contactsRouter,
  companies: companiesRouter,
  properties: propertiesRouter,
  opportunityProperties: opportunityPropertiesRouter,
});

export type AppRouter = typeof appRouter;
