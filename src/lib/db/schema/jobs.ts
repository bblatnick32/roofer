import {
  varchar,
  mysqlTable,
  serial,
  timestamp,
  bigint,
  mysqlEnum,
} from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { type getJobs } from "@/lib/api/jobs/queries";
import { relations } from "drizzle-orm";
import { orgs } from "./orgs";
import { photos } from "./photos";
import { issues } from "./issues";
import { companies } from "./companies";
import { properties } from "./properties";
import { contacts } from "./contacts";

export const JobStages = {
  LEAD: "Lead",
  INSPECTION: "Inspection",
  PROPOSAL: "Proposal",
  PROPOSAL_REVIEW: "Proposal Review",
} as const;

export const JobStatuses = {
  [JobStages.LEAD]: {
    NEW: "New",
    DOCUMENTED: "Documented",
  } as const,
  [JobStages.INSPECTION]: {
    INSPECTION_SCHEDULED: "Scheduled",
    INSPECTION_COMPLETED: "Completed",
    INSPECTION_DELIVERED: "Delivered",
  } as const,
  [JobStages.PROPOSAL]: {
    GENERATED: "Generated",
    SENT: "Sent",
  } as const,
  [JobStages.PROPOSAL_REVIEW]: {
    PENDING: "Pending",
    WON: "Accepted",
    LOST: "Rejected",
  } as const,
} as const;

export const jobs = mysqlTable("jobs", {
  id: serial("id").primaryKey(),
  orgId: varchar("org_id", { length: 256 }).notNull(),
  name: varchar("name", { length: 256 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  propertyId: bigint("property_id", {
    mode: "number",
    unsigned: true,
  }).notNull(),
  companyId: bigint("company_id", {
    mode: "number",
    unsigned: true,
  }).notNull(),
  contactId: bigint("contact_id", {
    mode: "number",
    unsigned: true,
  }),
  stage: mysqlEnum("stage", Object.values(JobStages) as [string, ...string[]])
    .notNull()
    .default(JobStages.LEAD),
  status: mysqlEnum("status", [
    ...Object.values(JobStatuses[JobStages.LEAD]),
    ...Object.values(JobStatuses[JobStages.INSPECTION]),
    ...Object.values(JobStatuses[JobStages.PROPOSAL]),
    ...Object.values(JobStatuses[JobStages.PROPOSAL_REVIEW]),
  ] as [string, ...string[]])
    .notNull()
    .default(JobStatuses[JobStages.LEAD].NEW),
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

export const insertJobParams = createSelectSchema(jobs, {}).omit({
  id: true,
  orgId: true,
  createdAt: true,
  updatedAt: true,
  stage: true,
  status: true,
});

export const updateJobSchema = createSelectSchema(jobs, {}).omit({
  orgId: true,
  createdAt: true,
  updatedAt: true,
});

export const updateJobParams = createSelectSchema(jobs, {}).omit({
  orgId: true,
  createdAt: true,
  updatedAt: true,
});

export const jobIdSchema = updateJobSchema.pick({ id: true });

// Types for jobs - used to type API request params and within Components
export type Job = z.infer<typeof updateJobSchema>;
export type NewJob = z.infer<typeof insertJobSchema>;
export type NewJobParams = z.infer<typeof insertJobParams>;
export type UpdateJobParams = z.infer<typeof updateJobParams>;
export type JobId = z.infer<typeof jobIdSchema>["id"];

// this type infers the return from getJobs() - meaning it will include any joins
export type CompleteJob = Awaited<ReturnType<typeof getJobs>>["jobs"][number];
