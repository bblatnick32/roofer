import ContactList from "undefined/components/contacts/ContactList";
import NewContactModal from "undefined/components/contacts/ContactModal";
import { api } from "@/lib/trpc/api";
import { checkAuth } from "@/lib/auth/utils";

export default async function Contacts() {
  await checkAuth();
  const { contacts } = await api.contacts.getContacts.query();

  return (
    <main className="max-w-3xl mx-auto p-4 rounded-lg bg-card">
      <div className="flex justify-between">
        <h1 className="font-semibold text-2xl my-2">Contacts</h1>
        <NewContactModal />
      </div>
      <ContactList contacts={contacts} />
    </main>
  );
}
