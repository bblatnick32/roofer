"use client";

import { NewOppParams, insertOppParams } from "@/lib/db/schema/opps";
import { UseFormReturn } from "react-hook-form";

import { Form, FormField } from "@/components/ui/form";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { ReactElement } from "react";
import { useOppOnSuccess } from "../hooks/use-opp-on-success";
import { useRouter } from "next/navigation";

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
  const onSuccess = useOppOnSuccess(closeModal);
  const router = useRouter();

  const { mutate: createOpp, isLoading: isCreating } =
    trpc.opps.createOpp.useMutation({
      onSuccess: (res) => {
        router.push(`/opps/${res.id}`);
        onSuccess("create", res);
      },
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
        <Button type="submit" className="mr-1" disabled={isCreating}>
          {`Creat${isCreating ? "ing..." : "e"}`}
        </Button>
      </form>
    </Form>
  );
};

export default NewOppFormShell;
