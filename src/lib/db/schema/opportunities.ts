import {
  int,
  varchar,
  date,
  serial,
  mysqlTable,
  timestamp,
  mysqlEnum,
  bigint,
  uniqueIndex,
} from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { getOpportunities } from "@/lib/api/opportunities/queries";
import { relations } from "drizzle-orm";
import { orgs } from "./orgs";
import { photos } from "./photos";
import { issues } from "./issues";
import { companies } from "./companies";
import { opportunityProperties } from "./opportunityProperties";
import { opportunityContacts } from "./opportunityContacts";

export const OPP_OPEN = "Open";
export const OPP_INSPECTION_SCHEDULED = "Inspection Scheduled";
export const OPP_INSPECTION_COMPLETED = "Inspection Completed";
export const OPP_QUOTED = "Quoted";
export const OPP_PRESENTED = "Presented";
export const OPP_NEGOTIATING = "Negotiating";
export const OPP_WON = "Won";
export const OPP_LOST = "Lost";
export const OPP_CLOSED_WON = "Closed Won";

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

export const opportunities = mysqlTable(
  "opportunities",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
    value: int("value"),
    closeDate: date("close_date"),
    status: mysqlEnum("status", OppStatuses).notNull().default(OPP_OPEN),
    orgId: varchar("org_id", { length: 256 })
      .notNull()
      .references(() => orgs.id),
    companyId: bigint("company_id", { mode: "number" })
      .notNull()
      .references(() => companies.id),
  },
  (table) => {
    return {
      idIdx: uniqueIndex("id_idx").on(table.id),
    };
  }
);

// relations
export const opportunitiesRelations = relations(
  opportunities,
  ({ one, many }) => ({
    org: one(orgs, {
      fields: [opportunities.orgId],
      references: [orgs.id],
    }),
    company: one(companies, {
      fields: [opportunities.companyId],
      references: [companies.id],
    }),
    photos: many(photos),
    issues: many(issues),
    opportunityProperties: many(opportunityProperties),
    opportunityContacts: many(opportunityContacts),
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
