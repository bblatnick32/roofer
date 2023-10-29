import {
  varchar,
  serial,
  mysqlTable,
  mysqlEnum,
  timestamp,
} from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { getLeads } from "@/lib/api/leads/queries";
import { relations } from "drizzle-orm";
import { orgs } from "./orgs";

export const leads = mysqlTable("leads", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  company: varchar("company", { length: 256 }),
  email: varchar("email", { length: 256 }),
  phone: varchar("phone", { length: 256 }),
  address: varchar("address", { length: 256 }),
  status: mysqlEnum("status", [
    "new",
    "open",
    "qualified",
    "contacted",
    "follow_up",
    "engaged",
    "converted",
    "closed",
    "disqualified",
  ])
    .notNull()
    .default("new"),
  orgId: varchar("org_id", { length: 256 }).notNull(),
});

// relations
export const leadsRelations = relations(leads, ({ many, one }) => ({
  org: one(orgs, {
    fields: [leads.orgId],
    references: [orgs.id],
  }),
  // opportunities: many(opportunities),
  // projects: many(projects),
}));

// Schema for leads - used to validate API requests
export const insertLeadSchema = createInsertSchema(leads);

export const insertLeadParams = createSelectSchema(leads, {}).omit({
  id: true,
  orgId: true,
  createdAt: true,
  updatedAt: true,
  status: true,
});

export const updateLeadSchema = createSelectSchema(leads);

export const updateLeadParams = createSelectSchema(leads, {}).omit({
  orgId: true,
  createdAt: true,
  updatedAt: true,
});

export const leadIdSchema = updateLeadSchema.pick({ id: true });

// Types for leads - used to type API request params and within Components
export type Lead = z.infer<typeof updateLeadSchema>;
export type NewLead = z.infer<typeof insertLeadSchema>;
export type NewLeadParams = z.infer<typeof insertLeadParams>;
export type UpdateLeadParams = z.infer<typeof updateLeadParams>;
export type LeadId = z.infer<typeof leadIdSchema>["id"];

// this type infers the return from getLeads() - meaning it will include any joins
export type CompleteLead = Awaited<
  ReturnType<typeof getLeads>
>["leads"][number];
