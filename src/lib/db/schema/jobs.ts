import {
  text,
  varchar,
  mysqlTable,
  serial,
  timestamp,
  bigint,
  mysqlEnum,
} from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { getLeads, type getJobs } from "@/lib/api/jobs/queries";
import { relations } from "drizzle-orm";
import { orgs } from "./orgs";
import { photos } from "./photos";
import { issues } from "./issues";
import { companies } from "./companies";
import { properties } from "./properties";
import { contacts } from "./contacts";

// statuses
export const NEW = "New Lead";
export const DOCUMENTED = "Documented";
export const INSPECTION_SCHEDULED = "Inspection Scheduled";
export const INSPECTION_COMPLETED = "Inspection Completed";
export const QUOTED = "Quoted";
export const PRESENTED = "Presented";
export const LOST = "Lost";
export const WON = "Won";
export const PENDING = "Pending";

export const JobStatuses = [
  NEW,
  DOCUMENTED,
  INSPECTION_SCHEDULED,
  INSPECTION_COMPLETED,
  QUOTED,
  PRESENTED,
  LOST,
  WON,
  PENDING,
] as const;

// types
export const LEAD = "Lead";
export const OPPORTUNITY = "Opportunity";

export const JobTypes = [LEAD, OPPORTUNITY] as const;

export const jobs = mysqlTable("jobs", {
  id: serial("id").primaryKey(),
  orgId: varchar("org_id", { length: 256 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  description: text("description"),
  companyId: bigint("company_id", {
    mode: "number",
    unsigned: true,
  }),
  propertyId: bigint("property_id", {
    mode: "number",
    unsigned: true,
  }),
  contactId: bigint("contact_id", {
    mode: "number",
    unsigned: true,
  }),
  status: mysqlEnum("status", JobStatuses).notNull().default(NEW),
  type: mysqlEnum("type", JobTypes).notNull().default(LEAD),
});

// relations
export const jobsRelations = relations(jobs, ({ one, many }) => ({
  org: one(orgs, {
    fields: [jobs.orgId],
    references: [orgs.id],
  }),
  company: one(companies, {
    fields: [jobs.companyId],
    references: [companies.id],
  }),
  property: one(properties, {
    fields: [jobs.propertyId],
    references: [properties.id],
  }),
  contact: one(contacts, {
    fields: [jobs.contactId],
    references: [contacts.id],
  }),
  photos: many(photos),
  issues: many(issues),
}));

// Schema for jobs/leads - used to validate API requests
export const insertJobSchema = createInsertSchema(jobs);
export const insertLeadSchema = insertJobSchema.extend({
  type: z.literal(LEAD),
});

export const insertJobParams = createSelectSchema(jobs, {}).omit({
  id: true,
  orgId: true,
});
export const insertLeadParams = insertJobParams.extend({
  type: z.literal(LEAD),
});

export const updateJobSchema = createSelectSchema(jobs, {}).omit({
  orgId: true,
});
export const updateLeadSchema = updateJobSchema.extend({
  type: z.literal(LEAD),
});

export const updateJobParams = createSelectSchema(jobs, {}).omit({
  orgId: true,
});
export const updateLeadParams = updateJobParams.extend({
  type: z.literal(LEAD),
});

export const jobIdSchema = updateJobSchema.pick({ id: true });
export const leadIdSchema = jobIdSchema;

// Types for jobs - used to type API request params and within Components
export type Job = z.infer<typeof updateJobSchema>;
export type NewJob = z.infer<typeof insertJobSchema>;
export type NewJobParams = z.infer<typeof insertJobParams>;
export type UpdateJobParams = z.infer<typeof updateJobParams>;
export type JobId = z.infer<typeof jobIdSchema>["id"];

// Types for leads - used to type API request params and within Components
export type Lead = z.infer<typeof updateLeadSchema>;
export type NewLead = z.infer<typeof insertLeadSchema>;
export type NewLeadParams = z.infer<typeof insertLeadParams>;
export type UpdateLeadParams = z.infer<typeof updateLeadParams>;
export type LeadId = z.infer<typeof jobIdSchema>["id"];

// this type infers the return from getJobs() - meaning it will include any joins
export type CompleteJob = Awaited<ReturnType<typeof getJobs>>["jobs"][number];
export type CompleteLead = Awaited<
  ReturnType<typeof getLeads>
>["leads"][number];
