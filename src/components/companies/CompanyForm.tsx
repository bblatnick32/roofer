"use client";

import {
  Company,
  CompanyId,
  NewCompanyParams,
  insertCompanyParams,
} from "@/lib/db/schema/companies";
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

const CompanyForm = ({
  company,
  closeModal,
  onCreate,
}: {
  company?: Company;
  closeModal?: () => void;
  onCreate?: (id: CompanyId) => void;
}) => {
  const { toast } = useToast();

  const editing = !!company?.id;

  const router = useRouter();
  const utils = trpc.useUtils();

  const form = useForm<z.infer<typeof insertCompanyParams>>({
    // latest Zod release has introduced a TS error with zodResolver
    // open issue: https://github.com/colinhacks/zod/issues/2663
    // errors locally but not in production
    resolver: zodResolver(insertCompanyParams),
    defaultValues: company ?? {
      name: "",
      address: "",
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

    await utils.companies.getCompanies.invalidate();
    utils.companies.getCompanies.prefetch();
    // router.refresh();

    if (onCreate && action === "create") onCreate(parseInt(data!.id!));
    if (closeModal) closeModal();

    toast({
      title: "Success",
      description: `Company ${action}d!`,
      variant: "default",
    });
  };

  const { mutate: createCompany, isLoading: isCreating } =
    trpc.companies.createCompany.useMutation({
      onSuccess: (res) => onSuccess("create", res),
    });

  const { mutate: updateCompany, isLoading: isUpdating } =
    trpc.companies.updateCompany.useMutation({
      onSuccess: (res) => onSuccess("update", res),
    });

  const { mutate: deleteCompany, isLoading: isDeleting } =
    trpc.companies.deleteCompany.useMutation({
      onSuccess: (res) => onSuccess("delete", res),
    });

  const handleSubmit = (values: NewCompanyParams) => {
    if (editing) {
      updateCompany({ ...values, id: company.id });
    } else {
      createCompany(values);
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
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
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
            onClick={() => deleteCompany({ id: company.id })}
          >
            Delet{isDeleting ? "ing..." : "e"}
          </Button>
        ) : null}
      </form>
    </Form>
  );
};

export default CompanyForm;
