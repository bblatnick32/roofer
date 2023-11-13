import { createPhotoFromUpload } from "@/lib/api/photos/mutations";
import { checkAuth } from "@/lib/auth/utils";
import { PHOTO_PROCESSING } from "@/lib/db/schema/photos";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { z } from "zod";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileCount: 1, maxFileSize: "4MB" } })
    .input(z.object({ opportunityId: z.number() }))
    .middleware(async ({ input }) => {
      const user = await checkAuth();

      return {
        orgId: user.activeOrgId!,
        opportunityId: input.opportunityId,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("onUploadComplete: metadata", metadata);

      await createPhotoFromUpload({
        key: file.key,
        name: file.name,
        url: `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`,
        status: PHOTO_PROCESSING,
        oppId: metadata.opportunityId,
        orgId: metadata.orgId,
      });
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
