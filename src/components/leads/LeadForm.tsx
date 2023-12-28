"use client";
import {
  NEW,
  Lead,
  NewLeadParams,
  UpdateLeadParams,
  insertLeadParams,
} from "@/lib/db/schema/jobs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "@/components/ui/form";
import { trpc } from "@/lib/trpc/client";
import { Button } from "../ui/button";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

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
      status: NEW,
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
    trpc.jobs.createLead.useMutation({
      onSuccess: async () => onSuccess("create"),
    });

  const { mutate: updateLead, isLoading: isUpdating } =
    trpc.jobs.updateLead.useMutation({
      onSuccess: async () => onSuccess("update"),
    });

  const { mutate: deleteLead, isLoading: isDeleting } =
    trpc.jobs.deleteLead.useMutation({
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
