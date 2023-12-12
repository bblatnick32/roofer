"use client";
import { CompleteContact } from "@/lib/db/schema/contacts";
import ContactModal from "./ContactModal";
import { trpc } from "@/lib/trpc/client";

export default function ContactList({
  contacts,
}: {
  contacts: CompleteContact[];
}) {
  const { data: c } = trpc.contacts.getContacts.useQuery(undefined, {
    initialData: { contacts },
  });

  if (c.contacts.length === 0) {
    return <EmptyState />;
  }

  return (
    <ul>
      {c.contacts.map((contact) => (
        <Contact contact={contact} key={contact.id} />
      ))}
    </ul>
  );
}

const Contact = ({ contact }: { contact: CompleteContact }) => {
  return (
    <li className="flex justify-between my-2">
      <div className="w-full">
        <div>{contact.name}</div>
      </div>
      <ContactModal contact={contact} />
    </li>
  );
};

const EmptyState = () => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No contacts
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new contact.
      </p>
      <div className="mt-6">
        <ContactModal emptyState={true} />
      </div>
    </div>
  );
};
