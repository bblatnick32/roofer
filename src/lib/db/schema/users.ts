import { varchar, mysqlTable } from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { getUsers } from "@/lib/api/users/queries";
import { relations } from "drizzle-orm";
import { orgs } from "./orgs";

export const users = mysqlTable("users", {
  id: varchar("id", { length: 256 }).primaryKey(), // matches clerk user id
  orgId: varchar("org_id", { length: 256 })
    .notNull()
    .references(() => orgs.id, { onDelete: "cascade" }), // matches clerk org id
  email: varchar("email", { length: 256 }).unique(),
});

// relations
export const usersRelations = relations(users, ({ one }) => ({
  org: one(orgs, {
    fields: [users.orgId],
    references: [orgs.id],
  }),
}));

// Schema for users - used to validate API requests
export const insertUserSchema = createInsertSchema(users);
export const insertUserParams = createSelectSchema(users, {});

export const updateUserSchema = createSelectSchema(users);
export const updateUserParams = createSelectSchema(users, {});
export const userIdSchema = updateUserSchema.pick({ id: true });

// Types for users - used to type API request params and within Components
export type User = z.infer<typeof updateUserSchema>;
export type NewUser = z.infer<typeof insertUserSchema>;
export type NewUserParams = z.infer<typeof insertUserParams>;
export type UpdateUserParams = z.infer<typeof updateUserParams>;
export type UserId = z.infer<typeof userIdSchema>["id"];

// this type infers the return from getUsers() - meaning it will include any joins
export type CompleteUser = Awaited<
  ReturnType<typeof getUsers>
>["users"][number];
