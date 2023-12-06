import {
  bigint,
  varchar,
  text,
  serial,
  mysqlTable,
  mysqlEnum,
  timestamp,
} from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

import { getIssues, getIssuesByOpportunityId } from "@/lib/api/issues/queries";
import { opportunities } from "./opportunities";
import { orgs } from "./orgs";
import { photos } from "./photos";
import { issueTemplates } from "./issueTemplates";
import { repairTemplates } from "./repairTemplates";

export const ISSUE_OPEN = "open";
export const ISSUE_IN_PROGRESS = "in_progress";
export const ISSUE_COMPLETED = "completed";
export const ISSUE_DEFERRED = "deferred";

export const IssueStatuses = [
  ISSUE_OPEN,
  ISSUE_IN_PROGRESS,
  ISSUE_COMPLETED,
  ISSUE_DEFERRED,
] as const;

export const ISSUE_LOW = "low";
export const ISSUE_MEDIUM = "medium";
export const ISSUE_HIGH = "high";
export const ISSUE_CRITICAL = "critical";

export const IssueSeverities = [
  ISSUE_LOW,
  ISSUE_MEDIUM,
  ISSUE_HIGH,
  ISSUE_CRITICAL,
] as const;

export const issues = mysqlTable("issues", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  oppId: bigint("opp_id", { mode: "number", unsigned: true })
    .notNull()
    .references(() => opportunities.id),
  issueTemplateId: bigint("issue_template_id", {
    mode: "number",
    unsigned: true,
  }).references(() => issueTemplates.id),
  repairTemplateId: bigint("repair_template_id", {
    mode: "number",
    unsigned: true,
  }).references(() => repairTemplates.id),
  photoId: bigint("photo_id", { mode: "number", unsigned: true }).references(
    () => photos.id
  ),
  // location: varchar("location", { length: 256 }),
  // measurements: varchar("measurements", { length: 256 }),
  // quantity: int("quantity"),
  // materials_list: varchar("measurements", { length: 256 }),
  // costEstimate: decimal("cost_estimate", { precision: 2 }),
  conditionText: text("condition_text"),
  deficiencyText: text("deficiency_text"),
  additionalDetails: text("additional_details"),
  status: mysqlEnum("status", IssueStatuses).notNull().default(ISSUE_OPEN),
  severity: mysqlEnum("severity", IssueSeverities),
  orgId: varchar("org_id", { length: 256 })
    .notNull()
    .references(() => orgs.id),
});

// relations
export const issuesRelations = relations(issues, ({ one }) => ({
  org: one(orgs, {
    fields: [issues.orgId],
    references: [orgs.id],
  }),
  opportunity: one(opportunities, {
    fields: [issues.oppId],
    references: [opportunities.id],
  }),
  photo: one(photos, {
    fields: [issues.photoId],
    references: [photos.id],
  }),
  issueTemplate: one(issueTemplates, {
    fields: [issues.issueTemplateId],
    references: [issueTemplates.id],
  }),
  repairTemplate: one(repairTemplates, {
    fields: [issues.repairTemplateId],
    references: [repairTemplates.id],
  }),
}));

// Schema for issues - used to validate API requests
export const insertIssueSchema = createInsertSchema(issues);

export const insertIssueParams = createSelectSchema(issues, {
  oppId: z.coerce.number(),
  issueTemplateId: z.coerce.number(),
  repairTemplateId: z.coerce.number(),
  photoId: z.coerce.number(),
}).omit({
  id: true,
  orgId: true,
  createdAt: true,
  updatedAt: true,
});

export const updateIssueSchema = createSelectSchema(issues, {}).omit({
  createdAt: true,
  updatedAt: true,
});

export const updateIssueParams = createSelectSchema(issues, {
  oppId: z.coerce.number(),
  issueTemplateId: z.coerce.number(),
  repairTemplateId: z.coerce.number(),
  photoId: z.coerce.number(),
}).omit({
  orgId: true,
  createdAt: true,
  updatedAt: true,
});

export const issueIdSchema = updateIssueSchema.pick({ id: true });
export const issueOpportunityIdSchema = updateIssueSchema.pick({
  oppId: true,
});

// Types for issues - used to type API request params and within Components
export type Issue = z.infer<typeof updateIssueSchema>;
export type NewIssue = z.infer<typeof insertIssueSchema>;
export type NewIssueParams = z.infer<typeof insertIssueParams>;
export type UpdateIssueParams = z.infer<typeof updateIssueParams>;
export type IssueId = z.infer<typeof issueIdSchema>["id"];

// this type infers the return from getIssues() - meaning it will include any joins
export type CompleteIssue = Awaited<
  ReturnType<typeof getIssues>
>["issues"][number];

export type CompleteIssueForList = Awaited<
  ReturnType<typeof getIssuesByOpportunityId>
>["issues"][number];
