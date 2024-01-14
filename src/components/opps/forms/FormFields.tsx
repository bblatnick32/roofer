import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Company,
  CompanyId,
  Contact,
  Property,
  updateOppParams,
} from "@/lib/db";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Path, UseFormReturn, useController } from "react-hook-form";
import { z } from "zod";
import NewCompanyModal from "@/components/companies/CompanyModal";
import NewPropertyModal from "@/components/properties/PropertyModal";
import NewContactModal from "@/components/contacts/ContactModal";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { InputFormField } from "@/components/ui/form-field";

export const NameFormField = <T extends z.ZodType<{ name: string }, any>>({
  form,
}: {
  form: UseFormReturn<z.infer<T>>;
}) => {
  const fieldName = "name" as Path<z.infer<T>>;
  return <InputFormField name={fieldName} label="Name" form={form} />;
};

export const CompanyFormField = ({
  form,
  companies,
}: {
  form: UseFormReturn<z.infer<typeof updateOppParams>>;
  companies: Company[] | undefined;
}) => {
  const { field } = useController({
    control: form.control,
    name: "companyId",
  });

  const [value, setValue] = useState(field.value);
  return (
    <FormItem>
      <FormLabel>Company</FormLabel>
      <FormControl>
        <div className="flex gap-4">
          <Select
            onValueChange={(value) => {
              if (!value) return;
              const val = parseInt(value);
              setValue(val);
              field.onChange(val);
            }}
            value={value ? String(value) : undefined}
            disabled={companies?.length === 0}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a company" />
            </SelectTrigger>
            <SelectContent>
              {companies?.map((company) => (
                <SelectItem key={company.id} value={company.id.toString()}>
                  {company.name}{" "}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <NewCompanyModal
            onCreate={(id) => {
              setValue(id);
              field.onChange(id);
            }}
          />
        </div>
      </FormControl>

      <FormMessage errorMessage="Company cannot be empty." />
    </FormItem>
  );
};

export const PropertyFormField = ({
  form,
  properties,
  companyId,
}: {
  form: UseFormReturn<z.infer<typeof updateOppParams>>;
  properties: Property[] | undefined;
  companyId: CompanyId;
}) => {
  const { field } = useController({
    control: form.control,
    name: "propertyId",
  });
  const [value, setValue] = useState(field.value);
  return (
    <FormItem>
      <FormLabel>Property</FormLabel>
      <FormControl>
        <div className="flex gap-4">
          <Select
            onValueChange={(value) => {
              if (!value) return;
              const val = parseInt(value);
              setValue(val);
              field.onChange(val);
            }}
            value={value ? String(value) : undefined}
            disabled={properties?.length === 0}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a property" />
            </SelectTrigger>
            <SelectContent>
              {properties?.map((property) => (
                <SelectItem key={property.id} value={property.id.toString()}>
                  {property.name}{" "}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <NewPropertyModal
            companyId={companyId}
            onCreate={(id) => {
              setValue(id);
              field.onChange(id);
            }}
          />
        </div>
      </FormControl>

      <FormMessage errorMessage="Property cannot be empty." />
    </FormItem>
  );
};

export const ContactFormField = ({
  form,
  contacts,
  companyId,
}: {
  form: UseFormReturn<z.infer<typeof updateOppParams>>;
  contacts: Contact[] | undefined;
  companyId: CompanyId;
}) => {
  const { field } = useController({
    control: form.control,
    name: "contactId",
  });
  const [value, setValue] = useState(field.value);
  return (
    <FormItem>
      <FormLabel>Contact</FormLabel>
      <FormControl>
        <div className="flex gap-4">
          <Select
            onValueChange={(value) => {
              if (!value) return;
              const val = parseInt(value);
              setValue(val);
              field.onChange(val);
            }}
            value={value ? String(value) : undefined}
            disabled={contacts?.length === 0}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a contact" />
            </SelectTrigger>
            <SelectContent>
              {contacts?.map((contact) => (
                <SelectItem key={contact.id} value={contact.id.toString()}>
                  {contact.name}{" "}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <NewContactModal
            companyId={companyId}
            onCreate={(id) => {
              setValue(id);
              field.onChange(id);
            }}
          />
        </div>
      </FormControl>

      <FormMessage errorMessage="Contact cannot be empty." />
    </FormItem>
  );
};

export const DescriptionFormField = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof updateOppParams>>;
}) => {
  return (
    <FormField
      control={form.control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Description</FormLabel>
          <FormControl>
            <Textarea {...field} value={field.value ?? ""} />
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
};
