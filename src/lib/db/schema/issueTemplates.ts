import {
  varchar,
  text,
  serial,
  mysqlTable,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { getIssueTemplates } from "@/lib/api/issueTemplates/queries";
import { relations } from "drizzle-orm";
import { orgs } from "./orgs";
import { issues } from "./issues";

export const issueTemplates = mysqlTable(
  "issue_templates",
  {
    id: serial("id").primaryKey(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
    name: varchar("name", { length: 256 }).notNull(),
    description: text("description"),
    orgId: varchar("org_id", { length: 256 })
      .notNull()
      .references(() => orgs.id, { onDelete: "cascade" }),
  },
  (table) => {
    return {
      idIdx: uniqueIndex("id_idx").on(table.id),
    };
  }
);

// relations
export const issueTemplatesRelations = relations(
  issueTemplates,
  ({ one, many }) => ({
    org: one(orgs, {
      fields: [issueTemplates.orgId],
      references: [orgs.id],
    }),
    issues: many(issues),
  })
);

// Schema for issueTemplates - used to validate API requests
export const insertIssueTemplateSchema = createInsertSchema(issueTemplates);

export const insertIssueTemplateParams = createSelectSchema(
  issueTemplates,
  {}
).omit({
  id: true,
  orgId: true,
  createdAt: true,
  updatedAt: true,
});

export const updateIssueTemplateSchema = createSelectSchema(
  issueTemplates,
  {}
).omit({
  createdAt: true,
  updatedAt: true,
});

export const updateIssueTemplateParams = createSelectSchema(
  issueTemplates,
  {}
).omit({
  orgId: true,
  createdAt: true,
  updatedAt: true,
});

export const issueTemplateIdSchema = updateIssueTemplateSchema.pick({
  id: true,
});

// Types for issueTemplates - used to type API request params and within Components
export type IssueTemplate = z.infer<typeof updateIssueTemplateSchema>;
export type NewIssueTemplate = z.infer<typeof insertIssueTemplateSchema>;
export type NewIssueTemplateParams = z.infer<typeof insertIssueTemplateParams>;
export type UpdateIssueTemplateParams = z.infer<
  typeof updateIssueTemplateParams
>;
export type IssueTemplateId = z.infer<typeof issueTemplateIdSchema>["id"];

// this type infers the return from getIssueTemplates() - meaning it will include any joins
export type CompleteIssueTemplate = Awaited<
  ReturnType<typeof getIssueTemplates>
>["issueTemplates"][number];
