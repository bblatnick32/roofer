"use client";
import {
  Contact,
  ContactId,
  NewContactParams,
  insertContactParams,
} from "@/lib/db/schema/contacts";
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
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const ContactForm = ({
  contact,
  closeModal,
  companyId,
  onCreate,
}: {
  contact?: Contact;
  closeModal?: () => void;
  companyId?: number;
  onCreate?: (id: ContactId) => void;
}) => {
  const { toast } = useToast();
  const { data: companies } = trpc.companies.getCompanies.useQuery();

  const editing = !!contact?.id;

  const router = useRouter();
  const utils = trpc.useUtils();

  const form = useForm<z.infer<typeof insertContactParams>>({
    // latest Zod release has introduced a TS error with zodResolver
    // open issue: https://github.com/colinhacks/zod/issues/2663
    // errors locally but not in production
    resolver: zodResolver(insertContactParams),
    defaultValues: contact ?? {
      name: "",
      email: "",
      phone: "",
      companyId,
    },
  });

  const onSuccess = async (
    action: "create" | "update" | "delete",
    data?: { error?: string; id?: string }
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

    await utils.contacts.getContacts.invalidate();
    utils.contacts.getContacts.prefetch();

    // router.refresh();

    if (onCreate && action === "create") onCreate(parseInt(data!.id!));
    if (closeModal) closeModal();

    toast({
      title: "Success",
      description: `Contact ${action}d!`,
      variant: "default",
    });
  };

  const { mutate: createContact, isLoading: isCreating } =
    trpc.contacts.createContact.useMutation({
      onSuccess: (res) => onSuccess("create", res),
    });

  const { mutate: updateContact, isLoading: isUpdating } =
    trpc.contacts.updateContact.useMutation({
      onSuccess: (res) => onSuccess("update", res),
    });

  const { mutate: deleteContact, isLoading: isDeleting } =
    trpc.contacts.deleteContact.useMutation({
      onSuccess: (res) => onSuccess("delete", res),
    });

  const handleSubmit = (values: NewContactParams) => {
    if (editing) {
      updateContact({ ...values, id: contact.id });
    } else {
      createContact(values);
    }
  };

  const onErrors = (errors: any) => {
    console.error(errors);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          form.handleSubmit(handleSubmit, onErrors)();
          e.stopPropagation();
          e.preventDefault();
        }}
        className={"space-y-8"}
      >
        {!companyId && (
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
        )}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
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
            onClick={() => deleteContact({ id: contact.id })}
          >
            Delet{isDeleting ? "ing..." : "e"}
          </Button>
        ) : null}
      </form>
    </Form>
  );
};

export default ContactForm;
