"use client";
import { NewOppParams, insertOppParams } from "@/lib/db/schema/opps";
import { UseFormReturn } from "react-hook-form";

import { Form, FormField } from "@/components/ui/form";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { ReactElement } from "react";

const NewOppFormShell = ({
  form,
  closeModal,
  children,
}: {
  form: UseFormReturn<z.infer<typeof insertOppParams>>;
  closeModal?: () => void;
  children:
    | ReactElement<typeof FormField, any>
    | ReactElement<typeof FormField, any>[];
}) => {
  const { toast } = useToast();

  const editing = false;

  const router = useRouter();

  const onSuccess = async (
    action: "create" | "update" | "delete",
    data?: { success?: boolean; error?: string; id?: string }
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

    if (data?.id) router.push(`/opps/${data?.id}`);
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

  const handleSubmit = (values: NewOppParams) => {
    createOpp(values);
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

export default NewOppFormShell;
