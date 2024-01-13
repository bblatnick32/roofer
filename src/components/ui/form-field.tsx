import { Path, UseFormReturn } from "react-hook-form";
import { TypeOf, z } from "zod";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "./form";
import { Input } from "./input";

const InputFormField = <T extends z.ZodType<{}, any>>({
  name,
  label,
  form,
}: {
  name: Path<TypeOf<T>>;
  label: string;
  form: UseFormReturn<z.infer<T>>;
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input {...field} value={field.value ?? ""} />
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export { InputFormField };
