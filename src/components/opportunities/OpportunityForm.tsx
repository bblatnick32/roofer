/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";

import {
  Opportunity,
  NewOpportunityParams,
  insertOpportunityParams,
  UpdateOpportunityParams,
} from "@/lib/db/schema/opportunities";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

const OpportunityForm = ({
  opportunity,
  closeModal,
}: {
  opportunity?: Opportunity;
  closeModal: () => void;
}) => {
  const { toast } = useToast();

  const editing = !!opportunity?.id;

  const router = useRouter();
  const utils = trpc.useContext();

  const form = useForm<z.infer<typeof insertOpportunityParams>>({
    // latest Zod release has introduced a TS error with zodResolver
    // open issue: https://github.com/colinhacks/zod/issues/2663
    // errors locally but not in production
    resolver: zodResolver(insertOpportunityParams),
    defaultValues: opportunity
      ? {
          ...opportunity,
          closeDate: opportunity.closeDate?.toISOString() ?? "",
        }
      : {
          value: 0,
          name: "",
          closeDate: "",
        },
  });

  const onSuccess = async (action: "create" | "update" | "delete") => {
    await utils.opportunities.getOpportunities.invalidate();
    router.refresh();
    closeModal();
    toast({
      title: "Success",
      description: `Opportunity ${action}d!`,
      variant: "default",
    });
  };

  const { mutate: createOpportunity, isLoading: isCreating } =
    trpc.opportunities.createOpportunity.useMutation({
      onSuccess: async () => onSuccess("create"),
    });

  const { mutate: updateOpportunity, isLoading: isUpdating } =
    trpc.opportunities.updateOpportunity.useMutation({
      onSuccess: async () => onSuccess("update"),
    });

  const { mutate: deleteOpportunity, isLoading: isDeleting } =
    trpc.opportunities.deleteOpportunity.useMutation({
      onSuccess: async () => onSuccess("delete"),
    });

  const onSubmit = (values: NewOpportunityParams | UpdateOpportunityParams) => {
    if (editing) {
      updateOpportunity({
        ...(values as UpdateOpportunityParams),
        id: opportunity.id,
      });
    } else {
      createOpportunity(values as NewOpportunityParams);
    }
  };

  const onErrors = (errors: any) => {
    console.log(errors);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onErrors)}
        className={"space-y-8"}
      >
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
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Value</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ""} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="closeDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Close Date</FormLabel>
              <br />
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(new Date(field.value), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={new Date(field.value || Date.now())}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

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
            onClick={() => deleteOpportunity({ id: opportunity.id })}
          >
            Delet{isDeleting ? "ing..." : "e"}
          </Button>
        ) : null}
      </form>
    </Form>
  );
};

export default OpportunityForm;
