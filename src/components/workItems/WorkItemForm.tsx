/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";

import {
  WorkItem,
  NewWorkItemParams,
  insertWorkItemParams,
} from "@/lib/db/schema/workItems";
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

const WorkItemForm = ({
  workItem,
  opportunityId,
  photoId,
  issueTemplates,
  repairTemplates,
  closeModal,
}: {
  workItem?: WorkItem;
  opportunityId: number;
  photoId: number | null;
  issueTemplates: CompleteIssueTemplate[];
  repairTemplates: CompleteRepairTemplate[];
  closeModal: () => void;
}) => {
  const { toast } = useToast();

  const editing = !!workItem?.id;

  const router = useRouter();
  const utils = trpc.useUtils();

  const form = useForm<z.infer<typeof insertWorkItemParams>>({
    // latest Zod release has introduced a TS error with zodResolver
    // open issue: https://github.com/colinhacks/zod/issues/2663
    // errors locally but not in production
    resolver: zodResolver(insertWorkItemParams),
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
    defaultValues: workItem ?? {
      oppId: opportunityId,
      issueTemplateId: null,
      repairTemplateId: null,
      photoId: photoId,
      additionalDetails: "",
    },
  });

  const onSuccess = async (action: "create" | "update" | "delete") => {
    await utils.workItems.getWorkItemsByOpportunityId.invalidate();
    router.refresh();
    closeModal();
    toast({
      title: "Success",
      description: `Work Item ${action}d!`,
      variant: "default",
    });
  };

  const { mutate: createWorkItem, isLoading: isCreating } =
    trpc.workItems.createWorkItem.useMutation({
      onSuccess: async () => onSuccess("create"),
    });

  const { mutate: updateWorkItem, isLoading: isUpdating } =
    trpc.workItems.updateWorkItem.useMutation({
      onSuccess: async () => onSuccess("update"),
    });

  const { mutate: deleteWorkItem, isLoading: isDeleting } =
    trpc.workItems.deleteWorkItem.useMutation({
      onSuccess: async () => onSuccess("delete"),
    });

  const handleSubmit = (values: NewWorkItemParams) => {
    if (editing) {
      updateWorkItem({ ...values, id: workItem.id });
    } else {
      createWorkItem(values);
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
              <FormLabel>Issue</FormLabel>
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
          name="repairTemplateId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Repair</FormLabel>
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
            onClick={() => deleteWorkItem({ id: workItem.id })}
          >
            Delet{isDeleting ? "ing..." : "e"}
          </Button>
        ) : null}
      </form>
    </Form>
  );
};

export default WorkItemForm;
