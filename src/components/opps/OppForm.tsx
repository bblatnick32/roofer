"use client";
import {
  Opp,
  NewOppParams,
  updateOppParams,
  insertOppParams,
  UpdateOppParams,
} from "@/lib/db/schema/opps";
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
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

const OppForm = ({
  opp,
  closeModal,
}: {
  opp?: Opp;
  closeModal?: () => void;
}) => {
  const { toast } = useToast();
  const { data: companies } = trpc.companies.getCompanies.useQuery();
  const { data: properties } = trpc.properties.getProperties.useQuery();
  const { data: contacts } = trpc.contacts.getContacts.useQuery();
  const editing = !!opp?.id;

  const router = useRouter();

  const form = useForm<z.infer<typeof insertOppParams>>({
    // latest Zod release has introduced a TS error with zodResolver
    // open issue: https://github.com/colinhacks/zod/issues/2663
    // errors locally but not in production
    resolver: zodResolver(updateOppParams),
    defaultValues: opp,
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

    router.refresh();
    if (closeModal) closeModal();
    toast({
      title: "Success",
      description: `Opportunity ${action}d!`,
      variant: "default",
    });
  };

  const { mutate: createOpp, isLoading: isCreating } =
    trpc.opps.createOpp.useMutation({
      onSuccess: (res) => onSuccess("create", res),
    });

  const { mutate: updateOpp, isLoading: isUpdating } =
    trpc.opps.updateOpp.useMutation({
      onSuccess: (res) => onSuccess("update", res),
    });

  const handleSubmit = (values: NewOppParams | UpdateOppParams) => {
    if (editing) {
      updateOpp({
        ...(values as UpdateOppParams),
      });
    } else {
      createOpp(values as NewOppParams);
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ""} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="companyId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company</FormLabel>
              <FormControl>
                <div className="flex gap-4">
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
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <NewCompanyModal />
                </div>
              </FormControl>

              <FormMessage errorMessage="Company cannot be empty." />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="propertyId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Property</FormLabel>
              <FormControl>
                <div className="flex gap-4">
                  <Select
                    onValueChange={(value) => {
                      field.onChange(parseInt(value));
                    }}
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
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <NewPropertyModal />
                </div>
              </FormControl>

              <FormMessage errorMessage="Property cannot be empty." />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contactId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact</FormLabel>
              <FormControl>
                <div className="flex gap-4">
                  <Select
                    onValueChange={(value) => {
                      field.onChange(parseInt(value));
                    }}
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
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <NewContactModal />
                </div>
              </FormControl>
              <FormMessage errorMessage="Contact cannot be empty." />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} value={field.value ?? ""} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="mr-1"
          disabled={isCreating || isUpdating}
        >
          {editing
            ? `Sav${isUpdating ? "ing..." : "e"}`
            : `Creat${isCreating ? "ing..." : "e"}`}
        </Button>
      </form>
    </Form>
  );
};

export default OppForm;
