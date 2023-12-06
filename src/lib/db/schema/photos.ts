import {
  bigint,
  varchar,
  serial,
  mysqlTable,
  timestamp,
  mysqlEnum,
  uniqueIndex,
} from "drizzle-orm/mysql-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { getPhotos } from "@/lib/api/photos/queries";
import { opportunities } from "./opportunities";
import { relations } from "drizzle-orm";
import { orgs } from "./orgs";
import { issues } from "./issues";

export const PHOTO_PENDING = "pending";
export const PHOTO_PROCESSING = "processing";
export const PHOTO_FAILED = "failed";
export const PHOTO_SUCCESS = "success";

export const PhotoStatuses = [
  PHOTO_PENDING,
  PHOTO_PROCESSING,
  PHOTO_FAILED,
  PHOTO_SUCCESS,
] as const;

export const photos = mysqlTable(
  "photos",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
    url: varchar("url", { length: 256 }),
    key: varchar("key", { length: 256 }),
    orgId: varchar("org_id", { length: 256 })
      .notNull()
      .references(() => orgs.id),
    oppId: bigint("opp_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => opportunities.id),
    status: mysqlEnum("status", PhotoStatuses).notNull().default(PHOTO_PENDING),
  },
  (table) => {
    return {
      idIdx: uniqueIndex("id_idx").on(table.id),
    };
  }
);

// relations
export const photosRelations = relations(photos, ({ one }) => ({
  org: one(orgs, {
    fields: [photos.orgId],
    references: [orgs.id],
  }),
  opportunity: one(opportunities, {
    fields: [photos.oppId],
    references: [opportunities.id],
  }),
  issue: one(issues),
}));

// Schema for photos - used to validate API requests
export const insertPhotoSchema = createInsertSchema(photos);

export const insertPhotoParams = createSelectSchema(photos, {}).omit({
  id: true,
  orgId: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPhotoFromUploadParams = createSelectSchema(photos, {}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updatePhotoSchema = createSelectSchema(photos, {}).omit({
  createdAt: true,
  updatedAt: true,
});

export const updatePhotoParams = createSelectSchema(photos, {}).omit({
  orgId: true,
  createdAt: true,
  updatedAt: true,
});

export const photoIdSchema = updatePhotoSchema.pick({ id: true });
export const photoKeySchema = updatePhotoSchema.pick({ key: true });

// Types for photos - used to type API request params and within Components
export type Photo = z.infer<typeof updatePhotoSchema>;
export type NewPhoto = z.infer<typeof insertPhotoSchema>;
export type NewPhotoParams = z.infer<typeof insertPhotoParams>;
export type NewPhotoFromUploadParams = z.infer<
  typeof insertPhotoFromUploadParams
>;

export type UpdatePhotoParams = z.infer<typeof updatePhotoParams>;
export type PhotoId = z.infer<typeof photoIdSchema>["id"];
export type PhotoKey = z.infer<typeof photoKeySchema>["key"];

// this type infers the return from getPhotos() - meaning it will include any joins
export type CompletePhoto = Awaited<
  ReturnType<typeof getPhotos>
>["photos"][number];
