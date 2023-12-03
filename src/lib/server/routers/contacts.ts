import { getContactById, getContacts } from "@/lib/api/contacts/queries";
import { publicProcedure, router } from "@/lib/server/trpc";
import {
  contactIdSchema,
  insertContactParams,
  updateContactParams,
} from "@/lib/db/schema/contacts";
import {
  createContact,
  deleteContact,
  updateContact,
} from "@/lib/api/contacts/mutations";

export const contactsRouter = router({
  getContacts: publicProcedure.query(async () => {
    return getContacts();
  }),
  getContactById: publicProcedure
    .input(contactIdSchema)
    .query(async ({ input }) => {
      return getContactById(input.id);
    }),
  createContact: publicProcedure
    .input(insertContactParams)
    .mutation(async ({ input }) => {
      return createContact(input);
    }),
  updateContact: publicProcedure
    .input(updateContactParams)
    .mutation(async ({ input }) => {
      return updateContact(input.id, input);
    }),
  deleteContact: publicProcedure
    .input(contactIdSchema)
    .mutation(async ({ input }) => {
      return deleteContact(input.id);
    }),
});
