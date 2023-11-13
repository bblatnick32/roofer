import {
  bigint,
  // int,
  varchar,
  text,
  serial,
  mysqlTable,
  // decimal,
  mysqlEnum,
  timestamp,
} from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

import { getWorkItems } from "@/lib/api/workItems/queries";
import { opportunities } from "./opportunities";
import { orgs } from "./orgs";
import { photos } from "./photos";

export const WORK_ITEM_OPEN = "open";
export const WORK_ITEM_IN_PROGRESS = "in_progress";
export const WORK_ITEM_COMPLETED = "completed";
export const WORK_ITEM_DEFERRED = "deferred";

export const WorkItemStatuses = [
  WORK_ITEM_OPEN,
  WORK_ITEM_IN_PROGRESS,
  WORK_ITEM_COMPLETED,
  WORK_ITEM_DEFERRED,
] as const;

export const WORK_ITEM_LOW = "low";
export const WORK_ITEM_MEDIUM = "medium";
export const WORK_ITEM_HIGH = "high";
export const WORK_ITEM_CRITICAL = "critical";

export const WorkItemSeverities = [
  WORK_ITEM_LOW,
  WORK_ITEM_MEDIUM,
  WORK_ITEM_HIGH,
  WORK_ITEM_CRITICAL,
] as const;

export const workItems = mysqlTable("work_items", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  oppId: bigint("opp_id", { mode: "number" }).notNull(),
  issueTemplateId: bigint("issue_template_id", { mode: "number" }),
  repairTemplateId: bigint("repair_template_id", { mode: "number" }),
  photoId: bigint("photo_id", { mode: "number" }),
  // location: varchar("location", { length: 256 }),
  // measurements: varchar("measurements", { length: 256 }),
  // quantity: int("quantity"),
  // materials_list: varchar("measurements", { length: 256 }),
  // costEstimate: decimal("cost_estimate", { precision: 2 }),
  conditionText: text("condition_text"),
  deficiencyText: text("deficiency_text"),
  additionalDetails: text("additional_details"),
  status: mysqlEnum("status", WorkItemStatuses)
    .notNull()
    .default(WORK_ITEM_OPEN),
  severity: mysqlEnum("severity", WorkItemSeverities),
  orgId: varchar("org_id", { length: 256 }).notNull(),
});

// relations
export const workItemsRelations = relations(workItems, ({ one }) => ({
  org: one(orgs, {
    fields: [workItems.orgId],
    references: [orgs.id],
  }),
  opportunity: one(opportunities, {
    fields: [workItems.oppId],
    references: [opportunities.id],
  }),
  photo: one(photos, {
    fields: [workItems.photoId],
    references: [photos.id],
  }),
}));

// Schema for workItems - used to validate API requests
export const insertWorkItemSchema = createInsertSchema(workItems);

export const insertWorkItemParams = createSelectSchema(workItems, {
  oppId: z.coerce.number(),
  issueTemplateId: z.coerce.number(),
  repairTemplateId: z.coerce.number(),
  photoId: z.coerce.number(),
  // costEstimate: z.coerce.number(),
}).omit({
  id: true,
  orgId: true,
  createdAt: true,
  updatedAt: true,
});

export const updateWorkItemSchema = createSelectSchema(workItems, {}).omit({
  createdAt: true,
  updatedAt: true,
});

export const updateWorkItemParams = createSelectSchema(workItems, {
  oppId: z.coerce.number(),
  issueTemplateId: z.coerce.number(),
  repairTemplateId: z.coerce.number(),
  photoId: z.coerce.number(),
  // costEstimate: z.coerce.number(),
}).omit({
  orgId: true,
  createdAt: true,
  updatedAt: true,
});

export const workItemIdSchema = updateWorkItemSchema.pick({ id: true });
export const workItemOpportunityIdSchema = updateWorkItemSchema.pick({
  oppId: true,
});

// Types for workItems - used to type API request params and within Components
export type WorkItem = z.infer<typeof updateWorkItemSchema>;
export type NewWorkItem = z.infer<typeof insertWorkItemSchema>;
export type NewWorkItemParams = z.infer<typeof insertWorkItemParams>;
export type UpdateWorkItemParams = z.infer<typeof updateWorkItemParams>;
export type WorkItemId = z.infer<typeof workItemIdSchema>["id"];

// this type infers the return from getWorkItems() - meaning it will include any joins
export type CompleteWorkItem = Awaited<
  ReturnType<typeof getWorkItems>
>["workItems"][number];
