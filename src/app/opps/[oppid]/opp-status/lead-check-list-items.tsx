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
import { useOppForm } from "@/components/opps/hooks/use-opp-form";
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
  const [openType, setOpenType] = useState<OpenType | null>(null);

  const form = useOppForm(opp);

  const closeModal = () => {
    setOpenType(null);
    setOpen(false);
  };

  const handleOnOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      form.reset();
    }
  };

  const items: CheckListItem<OpenType>[] = [
    {
      label: "Document company.",
      value: "document-company",
      completed: !!opp.companyId,
      disabled: false,
    },
    {
      label: "Document property.",
      value: "document-property",
      completed: !!opp.propertyId,
      disabled: !opp.companyId,
    },
    {
      label: "Document contact.",
      value: "document-contact",
      completed: !!opp.contactId,
      disabled: !opp.companyId,
    },
    {
      label: "Document description.",
      value: "document-description",
      completed: !!opp.description,
      disabled: !opp.companyId,
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
      <Dialog onOpenChange={handleOnOpenChange} open={open}>
        {openType === "document-company" && (
          <DocumentCompanyDialogContent
            opp={opp}
            closeModal={closeModal}
            form={form}
          />
        )}
        {openType === "document-property" && (
          <DocumentPropertyDialogContent
            opp={opp}
            closeModal={closeModal}
            form={form}
          />
        )}
        {openType === "document-contact" && (
          <DocumentContactDialogContent
            opp={opp}
            closeModal={closeModal}
            form={form}
          />
        )}
        {openType === "document-description" && (
          <DocumentDescriptionDialogContent
            opp={opp}
            closeModal={closeModal}
            form={form}
          />
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
  form,
  opp,
  closeModal,
}: {
  form: ReturnType<typeof useOppForm>;
  opp: Opp;
  closeModal: () => void;
}) => {
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
  form,
  opp,
  closeModal,
}: {
  form: ReturnType<typeof useOppForm>;
  opp: Opp;
  closeModal: () => void;
}) => {
  const { data } = trpc.properties.getProperties.useQuery();

  return (
    <LeadCheckListItemDialogContent title="Edit Opportunity Property">
      <OppFormShell opp={opp} form={form} closeModal={closeModal}>
        <PropertyFormField
          form={form}
          properties={data?.properties}
          companyId={opp.companyId!}
        />
      </OppFormShell>
    </LeadCheckListItemDialogContent>
  );
};

const DocumentContactDialogContent = ({
  form,
  opp,
  closeModal,
}: {
  form: ReturnType<typeof useOppForm>;
  opp: Opp;
  closeModal: () => void;
}) => {
  const { data } = trpc.contacts.getContacts.useQuery();

  return (
    <LeadCheckListItemDialogContent title="Edit Opportunity Contact">
      <OppFormShell opp={opp} form={form} closeModal={closeModal}>
        <ContactFormField
          form={form}
          contacts={data?.contacts}
          companyId={opp.companyId!}
        />
      </OppFormShell>
    </LeadCheckListItemDialogContent>
  );
};

const DocumentDescriptionDialogContent = ({
  form,
  opp,
  closeModal,
}: {
  form: ReturnType<typeof useOppForm>;
  opp: Opp;
  closeModal: () => void;
}) => {
  return (
    <LeadCheckListItemDialogContent title="Edit Opportunity Description">
      <OppFormShell opp={opp} form={form} closeModal={closeModal}>
        <DescriptionFormField form={form} />
      </OppFormShell>
    </LeadCheckListItemDialogContent>
  );
};
