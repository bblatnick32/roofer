import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Company, Contact, Property, updateOppParams } from "@/lib/db";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@radix-ui/react-select";
import { Path, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import NewCompanyModal from "@/components/companies/CompanyModal";
import NewPropertyModal from "@/components/properties/PropertyModal";
import NewContactModal from "@/components/contacts/ContactModal";
import { Textarea } from "@/components/ui/textarea";

export const NameFormField = <T extends z.ZodType<{ name: string }, any>>({
  form,
}: {
  form: UseFormReturn<z.infer<T>>;
}) => {
  const fieldName = "name" as Path<z.infer<T>>;

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Name</FormLabel>
          <FormControl>
            <Input {...field} value={field.value ?? ""} />
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export const CompanyFormField = ({
  form,
  companies,
}: {
  form: UseFormReturn<z.infer<typeof updateOppParams>>;
  companies: Company[];
}) => {
  return (
    <FormField
      control={form.control}
      name="companyId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Company</FormLabel>
          <FormControl>
            <div className="flex gap-4">
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
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id.toString()}>
                      {company.name}{" "}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <NewCompanyModal />
            </div>
          </FormControl>

          <FormMessage errorMessage="Company cannot be empty." />
        </FormItem>
      )}
    />
  );
};

export const PropertyFormField = ({
  form,
  properties,
}: {
  form: UseFormReturn<z.infer<typeof updateOppParams>>;
  properties: Property[];
}) => {
  return (
    <FormField
      control={form.control}
      name="propertyId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Property</FormLabel>
          <FormControl>
            <div className="flex gap-4">
              <Select
                onValueChange={(value) => {
                  field.onChange(parseInt(value));
                }}
                defaultValue={String(field.value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a property" />
                </SelectTrigger>
                <SelectContent>
                  {properties.map((property) => (
                    <SelectItem
                      key={property.id}
                      value={property.id.toString()}
                    >
                      {property.name}{" "}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <NewPropertyModal />
            </div>
          </FormControl>

          <FormMessage errorMessage="Property cannot be empty." />
        </FormItem>
      )}
    />
  );
};

export const ContactFormField = ({
  form,
  contacts,
}: {
  form: UseFormReturn<z.infer<typeof updateOppParams>>;
  contacts: Contact[];
}) => {
  return (
    <FormField
      control={form.control}
      name="contactId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Contact</FormLabel>
          <FormControl>
            <div className="flex gap-4">
              <Select
                onValueChange={(value) => {
                  field.onChange(parseInt(value));
                }}
                defaultValue={String(field.value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a contact" />
                </SelectTrigger>
                <SelectContent>
                  {contacts.map((contact) => (
                    <SelectItem key={contact.id} value={contact.id.toString()}>
                      {contact.name}{" "}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <NewContactModal />
            </div>
          </FormControl>

          <FormMessage errorMessage="Contact cannot be empty." />
        </FormItem>
      )}
    />
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
