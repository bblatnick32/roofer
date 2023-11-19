import { db } from "@/lib/db/client";
import { and, eq } from "drizzle-orm";
import {
  PhotoId,
  NewPhotoParams,
  UpdatePhotoParams,
  updatePhotoSchema,
  insertPhotoSchema,
  photos,
  photoIdSchema,
  PhotoKey,
  photoKeySchema,
  NewPhotoFromUploadParams,
} from "@/lib/db/schema/photos";
import { getUserAuth } from "@/lib/auth/utils";
import { TRPCError } from "@trpc/server";

export const createPhoto = async (photo: NewPhotoParams) => {
  const { session } = await getUserAuth();
  const newPhoto = insertPhotoSchema.parse({
    ...photo,
    orgId: session?.user.activeOrgId!,
  });

  try {
    await db.insert(photos).values(newPhoto);
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const createPhotoFromUpload = async (
  photo: NewPhotoFromUploadParams
) => {
  const newPhoto = insertPhotoSchema.parse({
    ...photo,
  });

  try {
    await db.insert(photos).values(newPhoto);
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const updatePhoto = async (id: PhotoId, photo: UpdatePhotoParams) => {
  const { session } = await getUserAuth();
  const { id: photoId } = photoIdSchema.parse({ id });
  const newPhoto = updatePhotoSchema.parse({
    ...photo,
    orgId: session?.user.activeOrgId!,
  });
  try {
    await db
      .update(photos)
      .set(newPhoto)
      .where(
        and(
          eq(photos.id, photoId!),
          eq(photos.orgId, session?.user.activeOrgId!)
        )
      );
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const deletePhoto = async (id: PhotoId) => {
  const { session } = await getUserAuth();
  const { id: photoId } = photoIdSchema.parse({ id });
  try {
    await db
      .delete(photos)
      .where(
        and(
          eq(photos.id, photoId!),
          eq(photos.orgId, session?.user.activeOrgId!)
        )
      );
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    return { error: message };
  }
};

export const getPhotoByKey = async (key: PhotoKey) => {
  const { session } = await getUserAuth();
  const { key: photoKey } = photoKeySchema.parse({ key });

  if (!photoKey) return { photo: null };

  const [p] = await db
    .select()
    .from(photos)
    .where(
      and(
        eq(photos.key, photoKey),
        eq(photos.orgId, session?.user.activeOrgId!)
      )
    );

  if (!p) {
    throw new TRPCError({ code: "NOT_FOUND" });
  }

  return { photo: p };
};
