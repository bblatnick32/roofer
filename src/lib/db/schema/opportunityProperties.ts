import {
  varchar,
  mysqlTable,
  bigint,
  primaryKey,
} from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { getOpportunityProperties } from "@/lib/api/opportunityProperties/queries";
import { opportunities } from "./opportunities";
import { properties } from "./properties";
import { relations } from "drizzle-orm";
import { orgs } from "./orgs";

export const opportunityProperties = mysqlTable(
  "opportunity_properties",
  {
    opportunityId: bigint("opportunity_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => opportunities.id, { onDelete: "cascade" }),
    propertyId: bigint("property_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => properties.id, { onDelete: "cascade" }),
    orgId: varchar("org_id", { length: 256 }).notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.propertyId, table.opportunityId] }),
    };
  }
);

// relations
export const opportunityPropertiesRelations = relations(
  opportunityProperties,
  ({ one }) => ({
    org: one(orgs, {
      fields: [opportunityProperties.orgId],
      references: [orgs.id],
    }),
    opportunity: one(opportunities, {
      fields: [opportunityProperties.opportunityId],
      references: [opportunities.id],
    }),
    property: one(properties, {
      fields: [opportunityProperties.propertyId],
      references: [properties.id],
    }),
  })
);

// Schema for opportunityProperties - used to validate API requests
export const insertOpportunityPropertySchema = createInsertSchema(
  opportunityProperties
);

export const insertOpportunityPropertyParams = createSelectSchema(
  opportunityProperties,
  {}
).omit({
  id: true,
  orgId: true,
});

export const updateOpportunityPropertySchema = createSelectSchema(
  opportunityProperties
);

export const updateOpportunityPropertyParams = createSelectSchema(
  opportunityProperties,
  {}
).omit({
  orgId: true,
});

export const opportunityPropertyIdSchema = updateOpportunityPropertySchema;

// Types for opportunityProperties - used to type API request params and within Components
export type OpportunityProperty = z.infer<
  typeof updateOpportunityPropertySchema
>;
export type NewOpportunityProperty = z.infer<
  typeof insertOpportunityPropertySchema
>;
export type NewOpportunityPropertyParams = z.infer<
  typeof insertOpportunityPropertyParams
>;
export type UpdateOpportunityPropertyParams = z.infer<
  typeof updateOpportunityPropertyParams
>;

// this type infers the return from getOpportunityProperties() - meaning it will include any joins
export type CompleteOpportunityProperty = Awaited<
  ReturnType<typeof getOpportunityProperties>
>["opportunityProperties"][number];
