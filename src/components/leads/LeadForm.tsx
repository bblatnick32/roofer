import { z } from "zod";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import { type Action, cn } from "@/lib/utils";
import { type TAddOptimistic } from "@/app/leads/useOptimisticLeads";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import NewCompanyModal from "@/components/companies/CompanyModal";
import NewPropertyModal from "@/components/properties/PropertyModal";
import NewContactModal from "@/components/contacts/ContactModal";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { type Lead, insertLeadParams } from "@/lib/db/schema/jobs";
import {
  createLeadAction,
  deleteLeadAction,
  updateLeadAction,
} from "@/lib/actions/leads";
import { type Company } from "@/lib/db/schema/companies";
import { type Property } from "@/lib/db/schema/properties";
import { type Contact } from "@/lib/db/schema/contacts";

const EMPTY = -3;

const LeadForm = ({
  companies,
  properties,
  contacts,
  lead,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  lead?: Lead | null;
  companies: Company[];
  properties: Property[];
  contacts: Contact[];
  openModal?: (lead?: Lead) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<Lead>(insertLeadParams);
  const { toast } = useToast();
  const editing = !!lead?.id;

  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();

  const onSuccess = (
    action: Action,
    data?: { error: string; values: Lead }
  ) => {
    const failed = Boolean(data?.error);
    if (failed) {
      openModal && openModal(data?.values);
    } else {
      router.refresh();
      postSuccess && postSuccess();
    }

    toast({
      title: failed ? `Failed to ${action}` : "Success",
      description: failed ? data?.error ?? "Error" : `Lead ${action}d!`,
      variant: failed ? "destructive" : "default",
    });
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries()) as any;
    payload.type = "Lead";

    const leadParsed = await insertLeadParams.safeParseAsync(payload);
    if (!leadParsed.success) {
      setErrors(leadParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = leadParsed.data;
    try {
      startMutation(async () => {
        addOptimistic &&
          addOptimistic({
            data: {
              ...values,
              id: editing ? lead.id : EMPTY,
            },
            action: editing ? "update" : "create",
          });

        const error = editing
          ? await updateLeadAction({ ...values, id: lead.id })
          : await createLeadAction(values);

        const errorFormatted = {
          error: error ?? "Error",
          values: editing ? { ...lead, ...values } : { ...values, id: EMPTY },
        };
        onSuccess(
          editing ? "update" : "create",
          error ? errorFormatted : undefined
        );
      });
    } catch (e) {
      if (e instanceof z.ZodError) {
        setErrors(e.flatten().fieldErrors);
      }
    }
  };

  return (
    <form action={handleSubmit} onChange={handleChange} className={"space-y-8"}>
      {/* Schema fields start */}
      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.description ? "text-destructive" : ""
          )}
        >
          Description
        </Label>
        <Input
          type="text"
          name="description"
          className={cn(errors?.description ? "ring ring-destructive" : "")}
          defaultValue={lead?.description ?? ""}
        />
        {errors?.description ? (
          <p className="text-xs text-destructive mt-2">
            {errors.description[0]}
          </p>
        ) : (
          <div className="h-6" />
        )}
      </div>

      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.companyId ? "text-destructive" : ""
          )}
        >
          Company
        </Label>
        <Select defaultValue={lead?.companyId?.toString()} name="companyId">
          <SelectTrigger
            className={cn(errors?.companyId ? "ring ring-destructive" : "")}
          >
            <SelectValue placeholder="Select a company" />
          </SelectTrigger>
          <SelectContent>
            {companies?.map((company) => (
              <SelectItem key={company.id} value={company.id.toString()}>
                {company.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="mt-4">
          <NewCompanyModal />
        </div>
        {errors?.companyId ? (
          <p className="text-xs text-destructive mt-2">{errors.companyId[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>

      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.propertyId ? "text-destructive" : ""
          )}
        >
          Property
        </Label>
        <Select defaultValue={lead?.propertyId?.toString()} name="propertyId">
          <SelectTrigger
            className={cn(errors?.propertyId ? "ring ring-destructive" : "")}
          >
            <SelectValue placeholder="Select a property" />
          </SelectTrigger>
          <SelectContent>
            {properties?.map((property) => (
              <SelectItem key={property.id} value={property.id.toString()}>
                {property.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="mt-4">
          <NewPropertyModal />
        </div>
        {errors?.propertyId ? (
          <p className="text-xs text-destructive mt-2">
            {errors.propertyId[0]}
          </p>
        ) : (
          <div className="h-6" />
        )}
      </div>

      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.contactId ? "text-destructive" : ""
          )}
        >
          Contact
        </Label>
        <Select defaultValue={lead?.contactId?.toString()} name="contactId">
          <SelectTrigger
            className={cn(errors?.contactId ? "ring ring-destructive" : "")}
          >
            <SelectValue placeholder="Select a contact" />
          </SelectTrigger>
          <SelectContent>
            {contacts?.map((contact) => (
              <SelectItem key={contact.id} value={contact.id.toString()}>
                {contact.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="mt-4">
          <NewContactModal />
        </div>
        {errors?.contactId ? (
          <p className="text-xs text-destructive mt-2">{errors.contactId[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      {/* Schema fields end */}

      {/* Save Button */}
      <SaveButton errors={hasErrors} editing={editing} />

      {/* Delete Button */}
      {editing ? (
        <Button
          type="button"
          disabled={isDeleting || pending || hasErrors}
          variant={"destructive"}
          onClick={() => {
            setIsDeleting(true);
            closeModal && closeModal();
            startMutation(async () => {
              addOptimistic && addOptimistic({ action: "delete", data: lead });
              const error = await deleteLeadAction(lead.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? "Error",
                values: lead,
              };

              onSuccess("delete", error ? errorFormatted : undefined);
            });
          }}
        >
          Delet{isDeleting ? "ing..." : "e"}
        </Button>
      ) : null}
    </form>
  );
};

export default LeadForm;

const SaveButton = ({
  editing,
  errors,
}: {
  editing: Boolean;
  errors: boolean;
}) => {
  const { pending } = useFormStatus();
  const isCreating = pending && editing === false;
  const isUpdating = pending && editing === true;
  return (
    <Button
      type="submit"
      className="mr-2"
      disabled={isCreating || isUpdating || errors}
      aria-disabled={isCreating || isUpdating || errors}
    >
      {editing
        ? `Sav${isUpdating ? "ing..." : "e"}`
        : `Creat${isCreating ? "ing..." : "e"}`}
    </Button>
  );
};
