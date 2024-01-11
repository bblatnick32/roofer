"use client";
import { Opp } from "@/lib/db";
import { CheckListItem, CheckListItems } from "@/components/check-list-items";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

type OpenType =
  | "document-company"
  | "document-property"
  | "document-contact"
  | "document-description";

const LeadCheckListItems = ({ opp }: { opp: Opp }) => {
  const [open, setOpen] = useState(false);
  const closeModal = () => {
    setOpenType(null);
    setOpen(false);
  };

  const [openType, setOpenType] = useState<OpenType | null>(null);

  const items: CheckListItem<OpenType>[] = [
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

  const handleClick = (e: React.MouseEvent, value: OpenType) => {
    e.stopPropagation();
    e.preventDefault();

    setOpenType(value);
    setOpen(true);
  };

  return (
    <>
      <CheckListItems<OpenType> items={items} onClick={handleClick} />
      <Dialog onOpenChange={setOpen} open={open}>
        {openType === "document-company" && <DocumentCompanyDialogContent />}
        {openType === "document-property" && <DocumentPropertyDialogContent />}
        {openType === "document-contact" && <DocumentContactDialogContent />}
        {openType === "document-description" && (
          <DocumentDescriptionDialogContent />
        )}
      </Dialog>
    </>
  );
};

export default LeadCheckListItems;

const LeadCheckListItemDialogContent = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <DialogContent>
      <DialogHeader className="px-5 pt-5">
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      <div className="px-5 pb-5">{children}</div>
    </DialogContent>
  );
};

const DocumentCompanyDialogContent = () => {
  return (
    <LeadCheckListItemDialogContent title="Edit Opportunity Company">
      <div>Company</div>
    </LeadCheckListItemDialogContent>
  );
};

const DocumentPropertyDialogContent = () => {
  return (
    <LeadCheckListItemDialogContent title="Edit Opportunity Property">
      <div>Property</div>
    </LeadCheckListItemDialogContent>
  );
};

const DocumentContactDialogContent = () => {
  return (
    <LeadCheckListItemDialogContent title="Edit Opportunity Contact">
      <div>Contact</div>
    </LeadCheckListItemDialogContent>
  );
};

const DocumentDescriptionDialogContent = () => {
  return (
    <LeadCheckListItemDialogContent title="Edit Opportunity Description">
      <div>Description</div>
    </LeadCheckListItemDialogContent>
  );
};
