"use client";
import {
  LEAD_NEW,
  Lead,
  LeadStatuses,
  NewLeadParams,
  UpdateLeadParams,
  insertLeadParams,
} from "@/lib/db/schema/leads";
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
import { Button } from "../ui/button";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import AddressInput from "../ui/address-input";

const LeadForm = ({
  lead,
  closeModal,
}: {
  lead?: Lead;
  closeModal: () => void;
}) => {
  const { toast } = useToast();

  const editing = !!lead?.id;

  const router = useRouter();

  const form = useForm<z.infer<typeof insertLeadParams>>({
    // latest Zod release has introduced a TS error with zodResolver
    // open issue: https://github.com/colinhacks/zod/issues/2663
    // errors locally but not in production
    resolver: zodResolver(insertLeadParams),
    defaultValues: lead ?? {
      name: "",
      company: "",
      email: "",
      phone: "",
      address: "",
      status: LEAD_NEW,
    },
  });

  const onSuccess = async (action: "create" | "update" | "delete") => {
    closeModal();
    router.refresh();
    toast({
      title: "Success",
      description: `Lead ${action}d!`,
      variant: "default",
    });
  };

  const { mutate: createLead, isLoading: isCreating } =
    trpc.leads.createLead.useMutation({
      onSuccess: async () => onSuccess("create"),
    });

  const { mutate: updateLead, isLoading: isUpdating } =
    trpc.leads.updateLead.useMutation({
      onSuccess: async () => onSuccess("update"),
    });

  const { mutate: deleteLead, isLoading: isDeleting } =
    trpc.leads.deleteLead.useMutation({
      onSuccess: async () => onSuccess("delete"),
    });

  const onSubmit = (values: NewLeadParams | UpdateLeadParams) => {
    if (editing) {
      updateLead({ ...(values as UpdateLeadParams), id: lead.id });
    } else {
      createLead(values as NewLeadParams);
    }
  };

  const onErrors = (errors: any) => {
    console.error(errors);
  };

  const StatusEnum = z.enum(LeadStatuses);
  type StatusEnum = z.infer<typeof StatusEnum>;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onErrors)}
        className={"space-y-8"}
        autoComplete="off"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field, fieldState: { error } }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              {error && <FormMessage>{error.message}</FormMessage>}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ""} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ""} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ""} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <AddressInput {...field} value={field.value ?? ""} />
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
