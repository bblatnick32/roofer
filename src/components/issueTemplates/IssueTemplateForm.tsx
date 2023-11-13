/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";

import {
  IssueTemplate,
  NewIssueTemplateParams,
  insertIssueTemplateParams,
} from "@/lib/db/schema/issueTemplates";
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

const IssueTemplateForm = ({
  issueTemplate,
  closeModal,
}: {
  issueTemplate?: IssueTemplate;
  closeModal: () => void;
}) => {
  const { toast } = useToast();

  const editing = !!issueTemplate?.id;

  const router = useRouter();
  const utils = trpc.useContext();

  const form = useForm<z.infer<typeof insertIssueTemplateParams>>({
    // latest Zod release has introduced a TS error with zodResolver
    // open issue: https://github.com/colinhacks/zod/issues/2663
    // errors locally but not in production
    resolver: zodResolver(insertIssueTemplateParams),
    defaultValues: issueTemplate ?? {
      name: "",
      description: "",
    },
  });

  const onSuccess = async (action: "create" | "update" | "delete") => {
    await utils.issueTemplates.getIssueTemplates.invalidate();
    router.refresh();
    closeModal();
    toast({
      title: "Success",
      description: `Issue Template ${action}d!`,
      variant: "default",
    });
  };

  const { mutate: createIssueTemplate, isLoading: isCreating } =
    trpc.issueTemplates.createIssueTemplate.useMutation({
      onSuccess: async () => onSuccess("create"),
    });

  const { mutate: updateIssueTemplate, isLoading: isUpdating } =
    trpc.issueTemplates.updateIssueTemplate.useMutation({
      onSuccess: async () => onSuccess("update"),
    });

  const { mutate: deleteIssueTemplate, isLoading: isDeleting } =
    trpc.issueTemplates.deleteIssueTemplate.useMutation({
      onSuccess: async () => onSuccess("delete"),
    });

  const handleSubmit = (values: NewIssueTemplateParams) => {
    if (editing) {
      updateIssueTemplate({ ...values, id: issueTemplate.id });
    } else {
      createIssueTemplate(values);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={"space-y-8"}>
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
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
            onClick={() => deleteIssueTemplate({ id: issueTemplate.id })}
          >
            Delet{isDeleting ? "ing..." : "e"}
          </Button>
        ) : null}
      </form>
    </Form>
  );
};

export default IssueTemplateForm;
