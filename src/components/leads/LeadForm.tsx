"use client";
import {
  LEAD_NEW,
  Lead,
  NewLeadParams,
  UpdateLeadParams,
  insertLeadParams,
} from "@/lib/db/schema/leads";
import { useForm, useFieldArray } from "react-hook-form";
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
import { cn } from "@/lib/utils";
import { Trash } from "lucide-react";

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

  const { fields, append, remove } = useFieldArray({
    name: "properties",
    control: form.control,
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

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onErrors)}
        className={"space-y-8"}
        autoComplete="off"
      >
        <div className="flex gap-8">
          <div className="space-y-4 basis-1/2">
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
          </div>
          <div className="basis-1/2">
            {fields.map((field, index) => (
              <FormField
                control={form.control}
                key={field.id}
                name={`properties.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={cn(index !== 0 && "sr-only")}>
                      Properties
                    </FormLabel>
                    <div className="flex items-center gap-2">
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => remove(index)}
                      >
                        <Trash className="h-5 w-5" />
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => append({ name: "" })}
            >
              Add Property
            </Button>
          </div>
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
