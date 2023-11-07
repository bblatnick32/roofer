"use client";

import { Opportunitie, NewOpportunitieParams, insertOpportunitieParams } from "@/lib/db/schema/opportunities";
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
import { z } from "zod";import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

const OpportunitieForm = ({
  opportunitie,
  closeModal,
}: {
  opportunitie?: Opportunitie;
  closeModal: () => void;
}) => {
  const { toast } = useToast();
  
  const editing = !!opportunitie?.id;

  const router = useRouter();
  const utils = trpc.useContext();

  const form = useForm<z.infer<typeof insertOpportunitieParams>>({
    // latest Zod release has introduced a TS error with zodResolver
    // open issue: https://github.com/colinhacks/zod/issues/2663
    // errors locally but not in production
    resolver: zodResolver(insertOpportunitieParams),
    defaultValues: opportunitie ?? {
      value: 0,
     name: "",
     closeDate: ""
    },
  });

  const onSuccess = (action: "create" | "update" | "delete") => {
    utils.opportunities.getOpportunities.invalidate();
    router.refresh();
    closeModal();toast({
      title: 'Success',
      description: `Opportunitie ${action}d!`,
      variant: "default",
    });
  };

  const { mutate: createOpportunitie, isLoading: isCreating } =
    trpc.opportunities.createOpportunitie.useMutation({
      onSuccess: () => onSuccess("create"),
    });

  const { mutate: updateOpportunitie, isLoading: isUpdating } =
    trpc.opportunities.updateOpportunitie.useMutation({
      onSuccess: () => onSuccess("update"),
    });

  const { mutate: deleteOpportunitie, isLoading: isDeleting } =
    trpc.opportunities.deleteOpportunitie.useMutation({
      onSuccess: () => onSuccess("delete"),
    });

  const handleSubmit = (values: NewOpportunitieParams) => {
    if (editing) {
      updateOpportunitie({ ...values, id: opportunitie.id });
    } else {
      createOpportunitie(values);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={"space-y-8"}>
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (<FormItem>
              <FormLabel>Value</FormLabel>
                <FormControl>
            <Input {...field} />
          </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (<FormItem>
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
          name="closeDate"
          render={({ field }) => (<FormItem>
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
                    selected={new Date(field.value)}
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
            onClick={() => deleteOpportunitie({ id: opportunitie.id })}
          >
            Delet{isDeleting ? "ing..." : "e"}
          </Button>
        ) : null}
      </form>
    </Form>
  );
};

export default OpportunitieForm;
