import {
  varchar,
  mysqlTable,
  serial,
  timestamp,
  bigint,
  mysqlEnum,
  text,
} from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { type getOpps } from "@/lib/api/opps/queries";
import { relations } from "drizzle-orm";
import { orgs } from "./orgs";
import { companies } from "./companies";
import { properties } from "./properties";
import { contacts } from "./contacts";

export const OppStages = {
  LEAD: "Lead",
  INSPECTION: "Inspection",
  PROPOSAL: "Proposal",
} as const;

export const OppStatuses = {
  [OppStages.LEAD]: {
    NEW: "New Lead",
    DOCUMENTED: "Lead Documented",
  } as const,
  [OppStages.INSPECTION]: {
    SCHEDULED: "Inspection Scheduled",
    ATTACHED: "Inspection Attached",
  } as const,
  [OppStages.PROPOSAL]: {
    ATTACHED: "Proposal Attached",
    PENDING: "Proposal Pending",
    WON: "Proposal Accepted",
    LOST: "Proposal Rejected",
  } as const,
} as const;

export const opps = mysqlTable("opps", {
  id: serial("id").primaryKey(),
  orgId: varchar("org_id", { length: 256 }).notNull(),
  name: varchar("name", { length: 256 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  propertyId: bigint("property_id", {
    mode: "number",
    unsigned: true,
  }),
  companyId: bigint("company_id", {
    mode: "number",
    unsigned: true,
  }),
  contactId: bigint("contact_id", {
    mode: "number",
    unsigned: true,
  }),
  stage: mysqlEnum("stage", Object.values(OppStages) as [string, ...string[]])
    .notNull()
    .default(OppStages.LEAD),
  status: mysqlEnum("status", [
    ...Object.values(OppStatuses[OppStages.LEAD]),
    ...Object.values(OppStatuses[OppStages.INSPECTION]),
    ...Object.values(OppStatuses[OppStages.PROPOSAL]),
  ] as [string, ...string[]])
    .notNull()
    .default(OppStatuses[OppStages.LEAD].NEW),
  description: text("description"),
});

// relations
export const oppsRelations = relations(opps, ({ one, many }) => ({
  org: one(orgs, {
    fields: [opps.orgId],
    references: [orgs.id],
  }),
  company: one(companies, {
    fields: [opps.companyId],
    references: [companies.id],
  }),
  property: one(properties, {
    fields: [opps.propertyId],
    references: [properties.id],
  }),
  contact: one(contacts, {
    fields: [opps.contactId],
    references: [contacts.id],
  }),
}));

// Schema for opps/leads - used to validate API requests
export const insertOppSchema = createInsertSchema(opps);

export const insertOppParams = createSelectSchema(opps, {}).omit({
  id: true,
  orgId: true,
  createdAt: true,
  updatedAt: true,
  stage: true,
  status: true,
});

export const updateOppSchema = createSelectSchema(opps, {}).omit({
  orgId: true,
  createdAt: true,
  updatedAt: true,
});

export const updateOppParams = createSelectSchema(opps).omit({
  orgId: true,
  createdAt: true,
  updatedAt: true,
});

export const oppIdSchema = updateOppSchema.pick({ id: true });

// Types for opps - used to type API request params and within Components
export type Opp = z.infer<typeof updateOppSchema>;
export type NewOpp = z.infer<typeof insertOppSchema>;
export type NewOppParams = z.infer<typeof insertOppParams>;
export type UpdateOppParams = z.infer<typeof updateOppParams>;
export type OppId = z.infer<typeof oppIdSchema>["id"];

// this type infers the return from getOpps() - meaning it will include any joins
export type CompleteOpp = Awaited<ReturnType<typeof getOpps>>["opps"][number];
