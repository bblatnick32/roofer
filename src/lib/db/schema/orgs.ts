import { varchar, mysqlTable, datetime } from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./users";
import { getOrgs } from "@/lib/api/orgs/queries";
import { relations } from "drizzle-orm";
import { leads } from "./leads";
import { opportunities } from "./opportunities";
import { photos } from "./photos";
import { workItems } from "./workItems";
import { repairTemplates } from "./repairTemplates";

export const orgs = mysqlTable("orgs", {
  id: varchar("id", { length: 256 }).primaryKey(), // matches clerk org id

  // Stripe
  stripeCustomerId: varchar("stripe_customer_id", { length: 256 }).unique(),
  stripeSubscriptionId: varchar("stripe_subscription_id", {
    length: 256,
  }).unique(),
  stripePriceId: varchar("stripe_price_id", { length: 256 }),
  stripeCurrentPeriodEnd: datetime("stripe_current_period_end"),
});

// relations
export const orgsRelations = relations(orgs, ({ many }) => ({
  users: many(users),
  leads: many(leads),
  opportunities: many(opportunities),
  photos: many(photos),
  workItems: many(workItems),
  repairTemplates: many(repairTemplates),
  issueTemplates: many(repairTemplates),
  // projects: many(projects),
}));

// Schema for orgs - used to validate API requests
export const insertOrgSchema = createInsertSchema(orgs);

export const insertOrgParams = createSelectSchema(orgs, {
  stripeCurrentPeriodEnd: z.coerce.string(),
});

export const updateOrgSchema = createSelectSchema(orgs);

export const updateOrgParams = createSelectSchema(orgs, {
  stripeCurrentPeriodEnd: z.coerce.string(),
});

export const orgIdSchema = updateOrgSchema.pick({ id: true });

// Types for orgs - used to type API request params and within Components
export type Org = z.infer<typeof updateOrgSchema>;
export type NewOrg = typeof orgs.$inferInsert; // insert type
export type NewOrgParams = z.infer<typeof insertOrgParams>;
export type UpdateOrgParams = z.infer<typeof updateOrgParams>;
export type OrgId = z.infer<typeof orgIdSchema>["id"];

// this type infers the return from getOrgs() - meaning it will include any joins
export type CompleteOrg = Awaited<ReturnType<typeof getOrgs>>["orgs"][number];
