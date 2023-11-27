/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";

import {
  Issue,
  NewIssueParams,
  insertIssueParams,
} from "@/lib/db/schema/issues";
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
import { CompleteIssueTemplate } from "@/lib/db/schema/issueTemplates";
import { CompleteRepairTemplate } from "@/lib/db/schema/repairTemplates";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const IssueForm = ({
  issue,
  opportunityId,
  photoId,
  issueTemplates,
  repairTemplates,
  closeModal,
}: {
  issue?: Issue;
  opportunityId: number;
  photoId: number | null;
  issueTemplates: CompleteIssueTemplate[];
  repairTemplates: CompleteRepairTemplate[];
  closeModal: () => void;
}) => {
  const { toast } = useToast();

  const editing = !!issue?.id;

  const router = useRouter();
  const utils = trpc.useUtils();

  const form = useForm<z.infer<typeof insertIssueParams>>({
    // latest Zod release has introduced a TS error with zodResolver
    // open issue: https://github.com/colinhacks/zod/issues/2663
    // errors locally but not in production
    resolver: zodResolver(insertIssueParams),
    values: {
      status: "open",
      oppId: opportunityId,
      issueTemplateId: null,
      repairTemplateId: null,
      photoId: photoId,
      conditionText: null,
      deficiencyText: null,
      additionalDetails: null,
      severity: null,
    },
    resetOptions: {
      keepDirtyValues: true,
      keepErrors: true,
    },
    defaultValues: issue ?? {
      oppId: opportunityId,
      issueTemplateId: null,
      repairTemplateId: null,
      photoId: photoId,
      additionalDetails: "",
    },
  });

  const onSuccess = async (action: "create" | "update" | "delete") => {
    await utils.issues.getIssuesByOpportunityId.invalidate();
    router.refresh();
    closeModal();
    toast({
      title: "Success",
      description: `Issue ${action}d!`,
      variant: "default",
    });
  };

  const { mutate: createIssue, isLoading: isCreating } =
    trpc.issues.createIssue.useMutation({
      onSuccess: async () => onSuccess("create"),
    });

  const { mutate: updateIssue, isLoading: isUpdating } =
    trpc.issues.updateIssue.useMutation({
      onSuccess: async () => onSuccess("update"),
    });

  const { mutate: deleteIssue, isLoading: isDeleting } =
    trpc.issues.deleteIssue.useMutation({
      onSuccess: async () => onSuccess("delete"),
    });

  const handleSubmit = (values: NewIssueParams) => {
    if (editing) {
      updateIssue({ ...values, id: issue.id });
    } else {
      createIssue(values);
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
          name="issueTemplateId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select
                defaultValue={
                  field.value !== null ? field.value.toString() : undefined
                }
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {issueTemplates.map((template) => (
                    <SelectItem
                      key={template.id}
                      value={template.id.toString()}
                    >
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="additionalDetails"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Details</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ""} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="repairTemplateId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recommended Repair</FormLabel>
              <Select
                defaultValue={
                  field.value !== null ? field.value.toString() : undefined
                }
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {repairTemplates.map((template) => (
                    <SelectItem
                      key={template.id}
                      value={template.id.toString()}
                    >
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />
        {/* <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ""} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        /> */}
        {/* <FormField
          control={form.control}
          name="costEstimate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cost Estimate</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        /> */}
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
            onClick={() => deleteIssue({ id: issue.id })}
          >
            Delet{isDeleting ? "ing..." : "e"}
          </Button>
        ) : null}
      </form>
    </Form>
  );
};

export default IssueForm;
