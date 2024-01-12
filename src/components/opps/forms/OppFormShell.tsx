"use client";
import { Opp, UpdateOppParams, updateOppParams } from "@/lib/db/schema/opps";
import { UseFormReturn } from "react-hook-form";

import { Form, FormField } from "@/components/ui/form";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { ReactElement } from "react";

const OppFormShell = ({
  opp,
  form,
  closeModal,
  children,
}: {
  opp: Opp;
  form: UseFormReturn<z.infer<typeof updateOppParams>>;
  closeModal?: () => void;
  children:
    | ReactElement<typeof FormField, any>
    | ReactElement<typeof FormField, any>[];
}) => {
  const { toast } = useToast();
  // const { data: properties } = trpc.properties.getProperties.useQuery();
  // const { data: contacts } = trpc.contacts.getContacts.useQuery();
  const editing = !!opp?.id;

  const router = useRouter();

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

  const { mutate: updateOpp, isLoading: isUpdating } =
    trpc.opps.updateOpp.useMutation({
      onSuccess: (res) => onSuccess("update", res),
    });

  const handleSubmit = (values: UpdateOppParams) => {
    if (editing) {
      updateOpp({
        ...values,
      });
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
        {children}
        <Button type="submit" className="mr-1" disabled={isUpdating}>
          {`Sav${isUpdating ? "ing..." : "e"}`}
        </Button>
      </form>
    </Form>
  );
};

export default OppFormShell;
