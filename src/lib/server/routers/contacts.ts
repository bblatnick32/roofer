import { getContactById, getContacts } from "@/lib/api/contacts/queries";
import { privateProcedure, router } from "@/lib/server/trpc";
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
  getContacts: privateProcedure.query(async () => {
    return getContacts();
  }),
  getContactById: privateProcedure
    .input(contactIdSchema)
    .query(async ({ input }) => {
      return getContactById(input.id);
    }),
  createContact: privateProcedure
    .input(insertContactParams)
    .mutation(async ({ input }) => {
      return createContact(input);
    }),
  updateContact: privateProcedure
    .input(updateContactParams)
    .mutation(async ({ input }) => {
      return updateContact(input.id, input);
    }),
  deleteContact: privateProcedure
    .input(contactIdSchema)
    .mutation(async ({ input }) => {
      return deleteContact(input.id);
    }),
});
