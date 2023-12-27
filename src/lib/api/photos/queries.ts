import { db } from "@/lib/db/client";
import { eq, and } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import { type PhotoId, photoIdSchema, photos } from "@/lib/db/schema/photos";

export const getPhotos = async () => {
  const { session } = await getUserAuth();
  const p = await db
    .select()
    .from(photos)
    .where(eq(photos.orgId, session?.user.activeOrgId!));

  return { photos: p };
};

export const getPhotoById = async (id: PhotoId) => {
  const { session } = await getUserAuth();
  const { id: photoId } = photoIdSchema.parse({ id });
  const [p] = await db
    .select()
    .from(photos)
    .where(
      and(eq(photos.id, photoId), eq(photos.orgId, session?.user.activeOrgId!))
    );
  return { photo: p };
};

// export const getPhotosByOpportunityId = async (id: OpportunityId) => {
//   const { session } = await getUserAuth();
//   const { id: opportunityId } = opportunityIdSchema.parse({ id });
//   const p = await db
//     .select()
//     .from(photos)
//     .where(
//       and(
//         eq(photos.oppId, opportunityId),
//         eq(photos.orgId, session?.user.activeOrgId!)
//       )
//     );
//   return { photos: p };
// };
