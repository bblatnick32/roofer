"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { type Lead, CompleteLead } from "@/lib/db/schema/jobs";
import Modal from "@/components/shared/Modal";
import { type Company } from "@/lib/db/schema/companies";
import { type Property } from "@/lib/db/schema/properties";
import { type Contact } from "@/lib/db/schema/contacts";
import {
  DELETE,
  OPTIMISTIC,
  useOptimisticLeads,
} from "@/app/leads/useOptimisticLeads";
import { Button } from "@/components/ui/button";
import LeadForm from "./LeadForm";
import { PlusIcon } from "lucide-react";

type TOpenModal = (lead?: Lead) => void;

export default function LeadList({
  leads,
  companies,
  properties,
  contacts,
}: {
  leads: CompleteLead[];
  companies: Company[];
  properties: Property[];
  contacts: Contact[];
}) {
  const { optimisticLeads, addOptimisticLead } = useOptimisticLeads(
    leads,
    companies,
    properties,
    contacts
  );
  const [open, setOpen] = useState(false);
  const [activeLead, setActiveLead] = useState<Lead | null>(null);
  const openModal = (lead?: Lead) => {
    setOpen(true);
    lead ? setActiveLead(lead) : setActiveLead(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeLead ? "Edit Lead" : "Create Lead"}
      >
        <LeadForm
          lead={activeLead}
          addOptimistic={addOptimisticLead}
          openModal={openModal}
          closeModal={closeModal}
          companies={companies}
          properties={properties}
          contacts={contacts}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button variant={"outline"} onClick={() => openModal()}>
          Create New Lead
        </Button>
      </div>
      {optimisticLeads.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticLeads.map((lead) => (
            <Lead lead={lead} key={lead.id} openModal={openModal} />
          ))}
        </ul>
      )}
    </div>
  );
}

const Lead = ({
  lead,
  openModal,
}: {
  lead: CompleteLead;
  openModal: TOpenModal;
}) => {
  const optimistic = lead.id === OPTIMISTIC;
  const deleting = lead.id === DELETE;
  const mutating = optimistic || deleting;
  return (
    <li
      className={cn(
        "flex justify-between my-2",
        mutating ? "opacity-30 animate-pulse" : "",
        deleting ? "text-destructive" : ""
      )}
    >
      <div className="w-full">
        <div>{lead.description}</div>
      </div>
      <Button
        onClick={() => openModal(lead)}
        disabled={mutating}
        variant={"ghost"}
      >
        Edit
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No leads
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new lead.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Lead
        </Button>
      </div>
    </div>
  );
};
