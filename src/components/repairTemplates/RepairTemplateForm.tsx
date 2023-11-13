/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";

import {
  RepairTemplate,
  NewRepairTemplateParams,
  insertRepairTemplateParams,
} from "@/lib/db/schema/repairTemplates";
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

const RepairTemplateForm = ({
  repairTemplate,
  closeModal,
}: {
  repairTemplate?: RepairTemplate;
  closeModal: () => void;
}) => {
  const { toast } = useToast();

  const editing = !!repairTemplate?.id;

  const router = useRouter();
  const utils = trpc.useContext();

  const form = useForm<z.infer<typeof insertRepairTemplateParams>>({
    // latest Zod release has introduced a TS error with zodResolver
    // open issue: https://github.com/colinhacks/zod/issues/2663
    // errors locally but not in production
    resolver: zodResolver(insertRepairTemplateParams),
    defaultValues: repairTemplate ?? {
      name: "",
      description: "",
      // materialList: "",
      // costEstimateFormula: "",
    },
  });

  const onSuccess = async (action: "create" | "update" | "delete") => {
    await utils.repairTemplates.getRepairTemplates.invalidate();
    router.refresh();
    closeModal();
    toast({
      title: "Success",
      description: `Repair Template ${action}d!`,
      variant: "default",
    });
  };

  const { mutate: createRepairTemplate, isLoading: isCreating } =
    trpc.repairTemplates.createRepairTemplate.useMutation({
      onSuccess: async () => onSuccess("create"),
    });

  const { mutate: updateRepairTemplate, isLoading: isUpdating } =
    trpc.repairTemplates.updateRepairTemplate.useMutation({
      onSuccess: async () => onSuccess("update"),
    });

  const { mutate: deleteRepairTemplate, isLoading: isDeleting } =
    trpc.repairTemplates.deleteRepairTemplate.useMutation({
      onSuccess: async () => onSuccess("delete"),
    });

  const handleSubmit = (values: NewRepairTemplateParams) => {
    if (editing) {
      updateRepairTemplate({ ...values, id: repairTemplate.id });
    } else {
      createRepairTemplate(values);
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
        {/* <FormField
          control={form.control}
          name="materialList"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Material List</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ""} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="costEstimateFormula"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cost Estimate Formula</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ""} />
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
            onClick={() => deleteRepairTemplate({ id: repairTemplate.id })}
          >
            Delet{isDeleting ? "ing..." : "e"}
          </Button>
        ) : null}
      </form>
    </Form>
  );
};

export default RepairTemplateForm;
