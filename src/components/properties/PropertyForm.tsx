"use client";
import {
  Property,
  NewPropertyParams,
  insertPropertyParams,
  PropertyId,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AddressAutocomplete from "../ui/address-autocomplete";

const PropertyForm = ({
  property,
  closeModal,
  companyId,
  onCreate,
}: {
  property?: Property;
  closeModal?: () => void;
  companyId?: number;
  onCreate?: (id: PropertyId) => void;
}) => {
  const { toast } = useToast();
  const { data: companies } = trpc.companies.getCompanies.useQuery();

  const editing = !!property?.id;

  const router = useRouter();
  const utils = trpc.useUtils();

  const form = useForm<z.infer<typeof insertPropertyParams>>({
    // latest Zod release has introduced a TS error with zodResolver
    // open issue: https://github.com/colinhacks/zod/issues/2663
    // errors locally but not in production
    resolver: zodResolver(insertPropertyParams),
    defaultValues: property ?? {
      name: "",
      address: "",
      companyId,
    },
  });

  const onSuccess = async (
    action: "create" | "update" | "delete",
    data?: { error?: string; id?: string }
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

    if (onCreate && action === "create") onCreate(parseInt(data!.id!));
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

  const onErrors = (errors: any) => {
    console.error(errors);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          form.handleSubmit(handleSubmit, onErrors)();
          e.stopPropagation();
          e.preventDefault();
        }}
        className={"space-y-8"}
      >
        {!companyId && (
          <FormField
            control={form.control}
            name="companyId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(parseInt(value));
                    }}
                    defaultValue={String(field.value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a company" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies?.companies.map((company) => (
                        <SelectItem
                          key={company.id}
                          value={company.id.toString()}
                        >
                          {company.name}{" "}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        )}
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
                <AddressAutocomplete
                  {...field}
                  value={field.value ?? ""}
                  onValueChange={(value) => {
                    console.log(value);
                    field.onChange(value);
                  }}
                />
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
