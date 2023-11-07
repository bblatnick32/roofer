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

export const OPEN = "open";
export const INSPECTION_SCHEDULED = "inspection_scheduled";
export const INSPECTION_COMPLETED = "inspection_completed";
export const QUOTED = "quoted";
export const PRESENTED = "presented";
export const NEGOTIATING = "negotiating";
export const WON = "won";
export const LOST = "lost";
export const CLOSED_WON = "closed_won";

export const OppStatuses = [
  OPEN,
  INSPECTION_SCHEDULED,
  INSPECTION_COMPLETED,
  QUOTED,
  PRESENTED,
  NEGOTIATING,
  WON,
  LOST,
  CLOSED_WON,
] as const;

export const opportunities = mysqlTable("opportunities", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  leadId: bigint("lead_id", { mode: "number" }).notNull(),
  value: int("value"),
  closeDate: date("close_date"),
  status: mysqlEnum("status", OppStatuses).notNull().default(OPEN),
  orgId: varchar("org_id", { length: 256 }).notNull(),
});

// relations
export const opportunitiesRelations = relations(opportunities, ({ one }) => ({
  org: one(orgs, {
    fields: [opportunities.orgId],
    references: [orgs.id],
  }),
  lead: one(leads, {
    fields: [opportunities.leadId],
    references: [leads.id],
  }),
}));

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
