"use client";
import { Opp, NewOppParams, insertOppParams } from "@/lib/db/schema/opps";
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
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "../ui/input";

const OppForm = ({
  opp,
  closeModal,
}: {
  opp?: Opp;
  closeModal?: () => void;
}) => {
  const { toast } = useToast();

  const editing = !!opp?.id;

  const router = useRouter();
  const utils = trpc.useUtils();

  const form = useForm<z.infer<typeof insertOppParams>>({
    // latest Zod release has introduced a TS error with zodResolver
    // open issue: https://github.com/colinhacks/zod/issues/2663
    // errors locally but not in production
    resolver: zodResolver(insertOppParams),
    defaultValues: opp ?? {
      name: "",
      companyId: null,
      propertyId: null,
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
    if (editing) {
      updateOpp({
        ...values,
        id: opp.id,
        status: opp.status,
        stage: opp.stage,
      });
    } else {
      createOpp(values);
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
