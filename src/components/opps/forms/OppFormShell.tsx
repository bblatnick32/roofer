"use client";

import { Opp, UpdateOppParams, updateOppParams } from "@/lib/db/schema/opps";
import { UseFormReturn } from "react-hook-form";

import { Form, FormField } from "@/components/ui/form";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { ReactElement } from "react";
import { useOppOnSuccess } from "../hooks/use-opp-on-success";

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
  const editing = !!opp?.id;

  const onSuccess = useOppOnSuccess(closeModal);

  const { mutate: updateOpp, isLoading: isUpdating } =
    trpc.opps.updateOpp.useMutation({
      onSuccess: (res) => {
        onSuccess("update", res);
        form.reset({}, { keepValues: true });
      },
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

  const noUpdates = Object.keys(form.formState.dirtyFields).length === 0;

  return (
    <Form {...form}>
      <form className={"space-y-8"}>
        {children}
        <Button
          onClick={() => {
            form.handleSubmit(handleSubmit, onErrors)();
          }}
          className="mr-1"
          disabled={isUpdating || noUpdates}
        >
          {`Sav${isUpdating ? "ing..." : "e"}`}
        </Button>
      </form>
    </Form>
  );
};

export default OppFormShell;
