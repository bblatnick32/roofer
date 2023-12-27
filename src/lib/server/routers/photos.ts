import { getPhotoById, getPhotos } from "@/lib/api/photos/queries";
import { privateProcedure, router } from "../trpc";
import {
  photoIdSchema,
  photoKeySchema,
  insertPhotoParams,
  updatePhotoParams,
} from "@/lib/db/schema/photos";
import {
  createPhoto,
  deletePhoto,
  getPhotoByKey,
  updatePhoto,
} from "@/lib/api/photos/mutations";

export const photosRouter = router({
  getPhotos: privateProcedure.query(async () => {
    return getPhotos();
  }),
  getPhotoById: privateProcedure
    .input(photoIdSchema)
    .query(async ({ input }) => {
      return getPhotoById(input.id);
    }),
  getPhotoByKey: privateProcedure
    .input(photoKeySchema)
    .mutation(async ({ input }) => {
      return getPhotoByKey(input.key);
    }),
  // getPhotosByOpportunityId: privateProcedure
  //   .input(photoIdSchema)
  //   .query(async ({ input }) => {
  //     return getPhotosByOpportunityId(input.id);
  //   }),
  createPhoto: privateProcedure
    .input(insertPhotoParams)
    .mutation(async ({ input }) => {
      return createPhoto(input);
    }),
  updatePhoto: privateProcedure
    .input(updatePhotoParams)
    .mutation(async ({ input }) => {
      return updatePhoto(input.id, input);
    }),
  deletePhoto: privateProcedure
    .input(photoIdSchema)
    .mutation(async ({ input }) => {
      return deletePhoto(input.id);
    }),
});
