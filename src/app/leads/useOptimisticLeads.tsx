import { type Company } from "@/lib/db/schema/companies";
import { type Property } from "@/lib/db/schema/properties";
import { type Contact } from "@/lib/db/schema/contacts";
import { type Lead, type CompleteLead } from "@/lib/db/schema/jobs";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<Lead>) => void;

export const OPTIMISTIC = -1;
export const DELETE = -2;

export const useOptimisticLeads = (
  leads: CompleteLead[],
  companies: Company[],
  properties: Property[],
  contacts: Contact[]
) => {
  const [optimisticLeads, addOptimisticLead] = useOptimistic(
    leads,
    (
      currentState: CompleteLead[],
      action: OptimisticAction<Lead>
    ): CompleteLead[] => {
      const { data } = action;

      const optimisticCompany = companies.find(
        (company) => company.id === data.companyId
      )!;

      const optimisticProperty = properties.find(
        (property) => property.id === data.propertyId
      )!;

      const optimisticContact = contacts.find(
        (contact) => contact.id === data.contactId
      )!;

      const optimisticLead = {
        ...data,
        company: optimisticCompany,
        property: optimisticProperty,
        contact: optimisticContact,
        id: OPTIMISTIC,
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticLead]
            : [...currentState, optimisticLead];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticLead } : item
          );
        case "delete":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, id: DELETE } : item
          );
        default:
          return currentState;
      }
    }
  );

  return { addOptimisticLead, optimisticLeads };
};
