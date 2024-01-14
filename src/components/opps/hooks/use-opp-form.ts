import { Opp, insertOppParams, updateOppParams } from "@/lib/db";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const useOppForm = (opp: Opp) => {
  const form = useForm<z.infer<typeof updateOppParams>>({
    // latest Zod release has introduced a TS error with zodResolver
    // open issue: https://github.com/colinhacks/zod/issues/2663
    // errors locally but not in production
    resolver: zodResolver(updateOppParams),
    defaultValues: opp,
  });
  return form;
};

export { useOppForm };

const useNewOppForm = () => {
  const form = useForm<z.infer<typeof insertOppParams>>({
    // latest Zod release has introduced a TS error with zodResolver
    // open issue: https://github.com/colinhacks/zod/issues/2663
    // errors locally but not in production
    resolver: zodResolver(insertOppParams),
    defaultValues: {
      name: "",
      companyId: null,
      propertyId: null,
      contactId: null,
      description: "",
    },
  });
  return form;
};

export { useNewOppForm };
