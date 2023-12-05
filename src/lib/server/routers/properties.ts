import { getPropertyById, getProperties } from "@/lib/api/properties/queries";
import { router, privateProcedure } from "@/lib/server/trpc";
import {
  propertyIdSchema,
  insertPropertyParams,
  updatePropertyParams,
} from "@/lib/db/schema/properties";
import {
  createProperty,
  deleteProperty,
  updateProperty,
} from "@/lib/api/properties/mutations";

export const propertiesRouter = router({
  getProperties: privateProcedure.query(async () => {
    return getProperties();
  }),
  getPropertyById: privateProcedure
    .input(propertyIdSchema)
    .query(async ({ input }) => {
      return getPropertyById(input.id);
    }),
  createProperty: privateProcedure
    .input(insertPropertyParams)
    .mutation(async ({ input }) => {
      return createProperty(input);
    }),
  updateProperty: privateProcedure
    .input(updatePropertyParams)
    .mutation(async ({ input }) => {
      return updateProperty(input.id, input);
    }),
  deleteProperty: privateProcedure
    .input(propertyIdSchema)
    .mutation(async ({ input }) => {
      return deleteProperty(input.id);
    }),
});
