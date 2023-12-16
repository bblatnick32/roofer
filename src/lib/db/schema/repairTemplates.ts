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

import { getRepairTemplates } from "@/lib/api/repairTemplates/queries";
import { relations } from "drizzle-orm";
import { orgs } from "./orgs";
import { issues } from "./issues";

export const repairTemplates = mysqlTable(
  "repair_templates",
  {
    id: serial("id").primaryKey(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
    name: varchar("name", { length: 256 }).notNull(),
    description: text("description"),
    // materialList: varchar("material_list", { length: 256 }),
    // costEstimateFormula: varchar("cost_estimate_formula", { length: 256 }),
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
export const repairTemplatesRelations = relations(
  repairTemplates,
  ({ one, many }) => ({
    org: one(orgs, {
      fields: [repairTemplates.orgId],
      references: [orgs.id],
    }),
    issues: many(issues),
  })
);

// Schema for repairTemplates - used to validate API requests
export const insertRepairTemplateSchema = createInsertSchema(repairTemplates);

export const insertRepairTemplateParams = createSelectSchema(
  repairTemplates,
  {}
).omit({
  id: true,
  orgId: true,
  createdAt: true,
  updatedAt: true,
});

export const updateRepairTemplateSchema = createSelectSchema(
  repairTemplates,
  {}
).omit({
  createdAt: true,
  updatedAt: true,
});

export const updateRepairTemplateParams = createSelectSchema(
  repairTemplates,
  {}
).omit({
  orgId: true,
  createdAt: true,
  updatedAt: true,
});

export const repairTemplateIdSchema = updateRepairTemplateSchema.pick({
  id: true,
});

// Types for repairTemplates - used to type API request params and within Components
export type RepairTemplate = z.infer<typeof updateRepairTemplateSchema>;
export type NewRepairTemplate = z.infer<typeof insertRepairTemplateSchema>;
export type NewRepairTemplateParams = z.infer<
  typeof insertRepairTemplateParams
>;
export type UpdateRepairTemplateParams = z.infer<
  typeof updateRepairTemplateParams
>;
export type RepairTemplateId = z.infer<typeof repairTemplateIdSchema>["id"];

// this type infers the return from getRepairTemplates() - meaning it will include any joins
export type CompleteRepairTemplate = Awaited<
  ReturnType<typeof getRepairTemplates>
>["repairTemplates"][number];
