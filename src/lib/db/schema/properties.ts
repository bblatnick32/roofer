import {
  varchar,
  serial,
  mysqlTable,
  bigint,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { getProperties } from "@/lib/api/properties/queries";
import { relations } from "drizzle-orm";
import { orgs } from "./orgs";
import { companies } from "./companies";
import { opportunityProperties } from "./opportunityProperties";
import { leads } from "./leads";

export const properties = mysqlTable(
  "properties",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
    address: varchar("address", { length: 256 }),
    orgId: varchar("org_id", { length: 256 })
      .notNull()
      .references(() => orgs.id, { onDelete: "cascade" }),
    leadId: bigint("lead_id", { mode: "number", unsigned: true }),
    companyId: bigint("company_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
  },
  (table) => {
    return {
      idIdx: uniqueIndex("id_idx").on(table.id),
    };
  }
);

// relations
export const propertiesRelations = relations(properties, ({ many, one }) => ({
  org: one(orgs, {
    fields: [properties.orgId],
    references: [orgs.id],
  }),
  lead: one(leads, {
    fields: [properties.leadId],
    references: [leads.id],
  }),
  company: one(companies, {
    fields: [properties.companyId],
    references: [companies.id],
  }),
  opportunityProperties: many(opportunityProperties),
}));

// Schema for properties - used to validate API requests
export const insertPropertySchema = createInsertSchema(properties);

export const insertPropertyFromLeadSchema = createInsertSchema(properties)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    address: true,
  })
  .required({
    leadId: true,
  });

export const insertPropertyParams = createSelectSchema(properties, {
  name: z.string().min(1, "Name cannot be empty."),
  address: z.string().min(1, "Address cannot be empty."),
}).omit({
  id: true,
  orgId: true,
  createdAt: true,
  updatedAt: true,
});

export const updatePropertySchema = createSelectSchema(properties, {}).omit({
  createdAt: true,
  updatedAt: true,
});

export const updatePropertyParams = createSelectSchema(properties, {
  name: z.string().min(1, "Name cannot be empty."),
  address: z.string().min(1, "Address cannot be empty."),
}).omit({
  orgId: true,
  createdAt: true,
  updatedAt: true,
});

export const propertyIdSchema = updatePropertySchema.pick({ id: true });

// Types for properties - used to type API request params and within Components
export type Property = z.infer<typeof updatePropertySchema>;
export type NewProperty = z.infer<typeof insertPropertySchema>;
export type NewPropertyFromLead = z.infer<typeof insertPropertyFromLeadSchema>;
export type NewPropertyParams = z.infer<typeof insertPropertyParams>;
export type UpdatePropertyParams = z.infer<typeof updatePropertyParams>;
export type PropertyId = z.infer<typeof propertyIdSchema>["id"];

// this type infers the return from getProperties() - meaning it will include any joins
export type CompleteProperty = Awaited<
  ReturnType<typeof getProperties>
>["properties"][number];
