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
import { useOppForm } from "@/components/opps/forms/hooks";
import OppFormShell from "@/components/opps/forms/OppFormShell";
import {
  CompanyFormField,
  ContactFormField,
  DescriptionFormField,
  PropertyFormField,
} from "@/components/opps/forms/FormFields";
import { trpc } from "@/lib/trpc/client";

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
        {openType === "document-company" && (
          <DocumentCompanyDialogContent opp={opp} closeModal={closeModal} />
        )}
        {openType === "document-property" && (
          <DocumentPropertyDialogContent opp={opp} closeModal={closeModal} />
        )}
        {openType === "document-contact" && (
          <DocumentContactDialogContent opp={opp} closeModal={closeModal} />
        )}
        {openType === "document-description" && (
          <DocumentDescriptionDialogContent opp={opp} closeModal={closeModal} />
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

const DocumentCompanyDialogContent = ({
  opp,
  closeModal,
}: {
  opp: Opp;
  closeModal: () => void;
}) => {
  const form = useOppForm(opp);
  const { data } = trpc.companies.getCompanies.useQuery();

  return (
    <LeadCheckListItemDialogContent title="Edit Opportunity Company">
      <OppFormShell opp={opp} form={form} closeModal={closeModal}>
        <CompanyFormField form={form} companies={data?.companies} />
      </OppFormShell>
    </LeadCheckListItemDialogContent>
  );
};

const DocumentPropertyDialogContent = ({
  opp,
  closeModal,
}: {
  opp: Opp;
  closeModal: () => void;
}) => {
  const form = useOppForm(opp);
  const { data } = trpc.properties.getProperties.useQuery();

  return (
    <LeadCheckListItemDialogContent title="Edit Opportunity Property">
      <OppFormShell opp={opp} form={form} closeModal={closeModal}>
        <PropertyFormField form={form} properties={data?.properties} />
      </OppFormShell>
    </LeadCheckListItemDialogContent>
  );
};

const DocumentContactDialogContent = ({
  opp,
  closeModal,
}: {
  opp: Opp;
  closeModal: () => void;
}) => {
  const form = useOppForm(opp);
  const { data } = trpc.contacts.getContacts.useQuery();

  return (
    <LeadCheckListItemDialogContent title="Edit Opportunity Contact">
      <OppFormShell opp={opp} form={form} closeModal={closeModal}>
        <ContactFormField form={form} contacts={data?.contacts} />
      </OppFormShell>
    </LeadCheckListItemDialogContent>
  );
};

const DocumentDescriptionDialogContent = ({
  opp,
  closeModal,
}: {
  opp: Opp;
  closeModal: () => void;
}) => {
  const form = useOppForm(opp);

  return (
    <LeadCheckListItemDialogContent title="Edit Opportunity Description">
      <OppFormShell opp={opp} form={form} closeModal={closeModal}>
        <DescriptionFormField form={form} />
      </OppFormShell>
    </LeadCheckListItemDialogContent>
  );
};
