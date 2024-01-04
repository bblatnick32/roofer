"use client";
import { Job, NewJobParams, insertJobParams } from "@/lib/db/schema/jobs";
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

const JobForm = ({
  job,
  closeModal,
}: {
  job?: Job;
  closeModal?: () => void;
}) => {
  const { toast } = useToast();
  const { data: companies } = trpc.companies.getCompanies.useQuery();
  const { data: properties } = trpc.properties.getProperties.useQuery();
  const { data: contacts } = trpc.contacts.getContacts.useQuery();
  const editing = !!job?.id;

  const router = useRouter();
  const utils = trpc.useUtils();

  const form = useForm<z.infer<typeof insertJobParams>>({
    // latest Zod release has introduced a TS error with zodResolver
    // open issue: https://github.com/colinhacks/zod/issues/2663
    // errors locally but not in production
    resolver: zodResolver(insertJobParams),
    defaultValues: job ?? {
      name: "",
      companyId: undefined,
      propertyId: undefined,
      contactId: null,
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

    router.refresh();
    if (closeModal) closeModal();
    toast({
      title: "Success",
      description: `Job ${action}d!`,
      variant: "default",
    });
  };

  const { mutate: createJob, isLoading: isCreating } =
    trpc.jobs.createJob.useMutation({
      onSuccess: (res) => onSuccess("create", res),
    });

  const { mutate: updateJob, isLoading: isUpdating } =
    trpc.jobs.updateJob.useMutation({
      onSuccess: (res) => onSuccess("update", res),
    });

  const { mutate: deleteJob, isLoading: isDeleting } =
    trpc.jobs.deleteJob.useMutation({
      onSuccess: (res) => onSuccess("delete", res),
    });

  const handleSubmit = (values: NewJobParams) => {
    if (editing) {
      updateJob({
        ...values,
        id: job.id,
        status: job.status,
        stage: job.stage,
      });
    } else {
      createJob(values);
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
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="companyId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company</FormLabel>
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
                <FormLabel>Property</FormLabel>
                <FormControl>
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
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <NewPropertyModal companyId={form.getValues("companyId")} />
        </div>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="contactId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact</FormLabel>
                <FormControl>
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
            onClick={() => deleteJob({ id: job.id })}
          >
            Delet{isDeleting ? "ing..." : "e"}
          </Button>
        ) : null}
      </form>
    </Form>
  );
};

export default JobForm;
