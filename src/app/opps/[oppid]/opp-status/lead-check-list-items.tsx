"use client";
import { Opp } from "@/lib/db";
import { CheckListItems } from "@/components/check-list-items";
import OppForm from "@/components/opps/OppForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

const LeadCheckListItems = ({ opp }: { opp: Opp }) => {
  const [open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);

  const items = [
    {
      label: "Document company.",
      value: "document-company",
      completed: !!opp.companyId,
    },
    {
      label: "Document property.",
      value: "document-property",
      completed: !!opp.propertyId,
    },
    {
      label: "Document contact.",
      value: "document-contact",
      completed: !!opp.contactId,
    },
    {
      label: "Document description.",
      value: "document-description",
      completed: !!opp.description,
    },
  ];

  const handleClick = (e: React.MouseEvent, value: string) => {
    e.stopPropagation();
    e.preventDefault();
    setOpen(true);
  };

  return (
    <>
      <CheckListItems items={items} onClick={handleClick} />
      <Dialog onOpenChange={setOpen} open={open}>
        <DialogContent>
          <DialogHeader className="px-5 pt-5">
            <DialogTitle>Edit Opportunity</DialogTitle>
          </DialogHeader>
          <div className="px-5 pb-5">
            <OppForm closeModal={closeModal} opp={opp} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LeadCheckListItems;
