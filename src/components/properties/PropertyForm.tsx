"use client";

import {
  Property,
  NewPropertyParams,
  insertPropertyParams,
} from "@/lib/db/schema/properties";
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
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

const PropertyForm = ({
  property,
  closeModal,
}: {
  property?: Property;
  closeModal?: () => void;
}) => {
  const { toast } = useToast();

  const editing = !!property?.id;

  const router = useRouter();
  const utils = trpc.useContext();

  const form = useForm<z.infer<typeof insertPropertyParams>>({
    // latest Zod release has introduced a TS error with zodResolver
    // open issue: https://github.com/colinhacks/zod/issues/2663
    // errors locally but not in production
    resolver: zodResolver(insertPropertyParams),
    defaultValues: property ?? {
      name: "",
      address: "",
    },
  });

  const onSuccess = async (
    action: "create" | "update" | "delete",
    data?: { error?: string }
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

    await utils.properties.getProperties.invalidate();
    utils.properties.getProperties.prefetch();
    router.refresh();
    if (closeModal) closeModal();
    toast({
      title: "Success",
      description: `Property ${action}d!`,
      variant: "default",
    });
  };

  const { mutate: createProperty, isLoading: isCreating } =
    trpc.properties.createProperty.useMutation({
      onSuccess: (res) => onSuccess("create", res),
    });

  const { mutate: updateProperty, isLoading: isUpdating } =
    trpc.properties.updateProperty.useMutation({
      onSuccess: (res) => onSuccess("update", res),
    });

  const { mutate: deleteProperty, isLoading: isDeleting } =
    trpc.properties.deleteProperty.useMutation({
      onSuccess: (res) => onSuccess("delete", res),
    });

  const handleSubmit = (values: NewPropertyParams) => {
    if (editing) {
      updateProperty({ ...values, id: property.id });
    } else {
      createProperty(values);
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
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
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
            onClick={() => deleteProperty({ id: property.id })}
          >
            Delet{isDeleting ? "ing..." : "e"}
          </Button>
        ) : null}
      </form>
    </Form>
  );
};

export default PropertyForm;
