import { varchar, serial, mysqlTable, timestamp } from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { getCompanies } from "@/lib/api/companies/queries";
import { relations } from "drizzle-orm";
import { orgs } from "./orgs";
import { opportunities } from "./opportunities";
import { contacts } from "./contacts";
import { properties } from "./properties";

export const companies = mysqlTable("companies", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  address: varchar("address", { length: 256 }),
  orgId: varchar("org_id", { length: 256 }).notNull(),
});

// relations
export const companiesRelations = relations(companies, ({ many, one }) => ({
  org: one(orgs, {
    fields: [companies.orgId],
    references: [orgs.id],
  }),
  opportunities: many(opportunities),
  contacts: many(contacts),
  properties: many(properties),
}));

// Schema for companies - used to validate API requests
export const insertCompanySchema = createInsertSchema(companies);

export const insertCompanyParams = createSelectSchema(companies, {
  name: z.string().min(1, "Name cannot be empty."),
}).omit({
  id: true,
  orgId: true,
  createdAt: true,
  updatedAt: true,
});

export const updateCompanySchema = createSelectSchema(companies, {}).omit({
  createdAt: true,
  updatedAt: true,
});

export const updateCompanyParams = createSelectSchema(companies, {
  name: z.string().min(1, "Name cannot be empty."),
}).omit({
  orgId: true,
  createdAt: true,
  updatedAt: true,
});
export const companyIdSchema = updateCompanySchema.pick({ id: true });
export const companyNameSchema = updateCompanySchema.pick({ name: true });

// Types for companies - used to type API request params and within Components
export type Company = z.infer<typeof updateCompanySchema>;
export type NewCompany = z.infer<typeof insertCompanySchema>;
export type NewCompanyParams = z.infer<typeof insertCompanyParams>;
export type UpdateCompanyParams = z.infer<typeof updateCompanyParams>;
export type CompanyId = z.infer<typeof companyIdSchema>["id"];
export type CompanyName = z.infer<typeof companyNameSchema>["name"];

// this type infers the return from getCompanies() - meaning it will include any joins
export type CompleteCompany = Awaited<
  ReturnType<typeof getCompanies>
>["companies"][number];
