"use client";

import {
  LEAD,
  Lead,
  NewLeadParams,
  insertLeadParams,
} from "@/lib/db/schema/jobs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import NewCompanyModal from "@/components/companies/CompanyModal";
import NewPropertyModal from "@/components/properties/PropertyModal";
import NewContactModal from "@/components/contacts/ContactModal";

const LeadForm = ({
  lead,
  closeModal,
}: {
  lead?: Lead;
  closeModal?: () => void;
}) => {
  const { toast } = useToast();
  const { data: companies } = trpc.companies.getCompanies.useQuery();
  const { data: properties } = trpc.properties.getProperties.useQuery();
  const { data: contacts } = trpc.contacts.getContacts.useQuery();
  const editing = !!lead?.id;

  const router = useRouter();
  const utils = trpc.useUtils();

  const form = useForm<z.infer<typeof insertLeadParams>>({
    // latest Zod release has introduced a TS error with zodResolver
    // open issue: https://github.com/colinhacks/zod/issues/2663
    // errors locally but not in production
    resolver: zodResolver(insertLeadParams),
    defaultValues: lead ?? {
      description: "",
      companyId: null,
      propertyId: null,
      contactId: null,
      type: LEAD,
    },
  });

  const onSuccess = async (
    action: "create" | "update" | "delete",
    data?: { success?: boolean; error?: string }
  ) => {
    if (data?.error) {
      toast({
        title: `${action
          .slice(0, 1)
          .toUpperCase()
          .concat(action.slice(1))} Failed`,
        description: data.error,
        variant: "destructive",
      });
      return;
    }

    await utils.jobs.getLeads.invalidate();
    router.refresh();
    if (closeModal) closeModal();
    toast({
      title: "Success",
      description: `Lead ${action}d!`,
      variant: "default",
    });
  };

  const { mutate: createLead, isLoading: isCreating } =
    trpc.jobs.createLead.useMutation({
      onSuccess: (res) => onSuccess("create", res),
    });

  const { mutate: updateLead, isLoading: isUpdating } =
    trpc.jobs.updateLead.useMutation({
      onSuccess: (res) => onSuccess("update", res),
    });

  const { mutate: deleteLead, isLoading: isDeleting } =
    trpc.jobs.deleteLead.useMutation({
      onSuccess: (res) => onSuccess("delete", res),
    });

  const handleSubmit = (values: NewLeadParams) => {
    if (editing) {
      updateLead({ ...values, id: lead.id, status: lead.status });
    } else {
      createLead(values);
    }
  };

  const onErrors = (errors: any) => {
    console.error(errors);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit, onErrors)}
        className={"space-y-8"}
      >
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ""} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="companyId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Id</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(parseInt(value));
                    }}
                    defaultValue={String(field.value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a company" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies?.companies.map((company) => (
                        <SelectItem
                          key={company.id}
                          value={company.id.toString()}
                        >
                          {company.name}{" "}
                          {/* TODO: Replace with a field from the company model */}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <NewCompanyModal />
        </div>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="propertyId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Property Id</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={String(field.value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a property" />
                    </SelectTrigger>
                    <SelectContent>
                      {properties?.properties.map((property) => (
                        <SelectItem
                          key={property.id}
                          value={property.id.toString()}
                        >
                          {property.name}{" "}
                          {/* TODO: Replace with a field from the property model */}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <NewPropertyModal />
        </div>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="contactId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Id</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={String(field.value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a contact" />
                    </SelectTrigger>
                    <SelectContent>
                      {contacts?.contacts.map((contact) => (
                        <SelectItem
                          key={contact.id}
                          value={contact.id.toString()}
                        >
                          {contact.name}{" "}
                          {/* TODO: Replace with a field from the contact model */}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <NewContactModal />
        </div>
        <Button
          type="submit"
          className="mr-1"
          disabled={isCreating || isUpdating}
        >
          {editing
            ? `Sav${isUpdating ? "ing..." : "e"}`
            : `Creat${isCreating ? "ing..." : "e"}`}
        </Button>
        {editing ? (
          <Button
            type="button"
            variant={"destructive"}
            onClick={() => deleteLead({ id: lead.id })}
          >
            Delet{isDeleting ? "ing..." : "e"}
          </Button>
        ) : null}
      </form>
    </Form>
  );
};

export default LeadForm;
