import {
  int,
  varchar,
  date,
  serial,
  mysqlTable,
  timestamp,
  mysqlEnum,
  bigint,
} from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { getOpportunities } from "@/lib/api/opportunities/queries";
import { relations } from "drizzle-orm";
import { leads } from "./leads";
import { orgs } from "./orgs";
import { photos } from "./photos";
import { issues } from "./issues";

export const OPP_OPEN = "open";
export const OPP_INSPECTION_SCHEDULED = "inspection_scheduled";
export const OPP_INSPECTION_COMPLETED = "inspection_completed";
export const OPP_QUOTED = "quoted";
export const OPP_PRESENTED = "presented";
export const OPP_NEGOTIATING = "negotiating";
export const OPP_WON = "won";
export const OPP_LOST = "lost";
export const OPP_CLOSED_WON = "closed_won";

export const OppStatuses = [
  OPP_OPEN,
  OPP_INSPECTION_SCHEDULED,
  OPP_INSPECTION_COMPLETED,
  OPP_QUOTED,
  OPP_PRESENTED,
  OPP_NEGOTIATING,
  OPP_WON,
  OPP_LOST,
  OPP_CLOSED_WON,
] as const;

export const opportunities = mysqlTable("opportunities", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  leadId: bigint("lead_id", { mode: "number" }).notNull(),
  value: int("value"),
  closeDate: date("close_date"),
  status: mysqlEnum("status", OppStatuses).notNull().default(OPP_OPEN),
  orgId: varchar("org_id", { length: 256 }).notNull(),
});

// relations
export const opportunitiesRelations = relations(
  opportunities,
  ({ one, many }) => ({
    org: one(orgs, {
      fields: [opportunities.orgId],
      references: [orgs.id],
    }),
    lead: one(leads, {
      fields: [opportunities.leadId],
      references: [leads.id],
    }),
    photos: many(photos),
    issues: many(issues),
  })
);

// Schema for opportunities - used to validate API requests
export const insertOpportunitySchema = createInsertSchema(opportunities);

export const insertOpportunityParams = createSelectSchema(opportunities, {
  value: z.coerce.number(),
  closeDate: z.coerce.string(),
}).omit({
  id: true,
  orgId: true,
  createdAt: true,
  updatedAt: true,
});

export const updateOpportunitySchema = createSelectSchema(
  opportunities,
  {}
).omit({
  createdAt: true,
  updatedAt: true,
});

export const updateOpportunityParams = createSelectSchema(opportunities, {
  value: z.coerce.number(),
  closeDate: z.coerce.string(),
}).omit({
  orgId: true,
  createdAt: true,
  updatedAt: true,
});

export const opportunityIdSchema = updateOpportunitySchema.pick({ id: true });

// Types for opportunities - used to type API request params and within Components
export type Opportunity = z.infer<typeof updateOpportunitySchema>;
export type NewOpportunity = z.infer<typeof insertOpportunitySchema>;
export type NewOpportunityParams = z.infer<typeof insertOpportunityParams>;
export type UpdateOpportunityParams = z.infer<typeof updateOpportunityParams>;
export type OpportunityId = z.infer<typeof opportunityIdSchema>["id"];

// this type infers the return from getOpportunities() - meaning it will include any joins
export type CompleteOpportunity = Awaited<
  ReturnType<typeof getOpportunities>
>["opportunities"][number];
