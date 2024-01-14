import ContactList from "@/components/contacts/ContactList";
import NewContactModal from "@/components/contacts/ContactModal";
import { MainPageWrapper } from "@/components/main-page";
import { getContacts } from "@/lib/api/contacts/queries";
import { checkAuth } from "@/lib/auth/utils";

export default async function Contacts() {
  await checkAuth("contacts");
  const { contacts } = await getContacts();

  return (
    <MainPageWrapper>
      <div className="flex justify-between">
        <h1 className="font-semibold text-2xl my-2">Contacts</h1>
        <NewContactModal />
      </div>
      <ContactList contacts={contacts} />
    </MainPageWrapper>
  );
}
