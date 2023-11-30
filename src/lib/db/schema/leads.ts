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
import { opportunities } from "./opportunities";

export const LEAD_NEW = "New";
export const LEAD_CONTACTED = "Contacted";
export const LEAD_CLOSED = "Closed - Not Converted";
export const LEAD_CONVERTED = "Converted";

export const LeadStatuses = [
  LEAD_NEW,
  LEAD_CONTACTED,
  LEAD_CONVERTED,
  LEAD_CLOSED,
] as const;

export const leads = mysqlTable("leads", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  company: varchar("company", { length: 256 }),
  email: varchar("email", { length: 256 }),
  phone: varchar("phone", { length: 256 }),
  address: varchar("address", { length: 256 }),
  status: mysqlEnum("status", LeadStatuses).notNull().default(LEAD_NEW),
  orgId: varchar("org_id", { length: 256 }).notNull(),
});

// relations
export const leadsRelations = relations(leads, ({ many, one }) => ({
  org: one(orgs, {
    fields: [leads.orgId],
    references: [orgs.id],
  }),
  opportunities: many(opportunities),
}));

// Schema for leads - used to validate API requests
export const insertLeadSchema = createInsertSchema(leads);

export const insertLeadParams = createSelectSchema(leads, {
  name: z.string().nonempty("Name cannot be empty."),
}).omit({
  id: true,
  orgId: true,
  createdAt: true,
  updatedAt: true,
});

export const updateLeadSchema = createSelectSchema(leads, {}).omit({
  createdAt: true,
  updatedAt: true,
});

export const updateLeadParams = createSelectSchema(leads, {
  name: z.string().nonempty("Name cannot be empty."),
}).omit({
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
