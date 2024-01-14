"use client";
import {
  CompleteCompany,
  CompleteContact,
  CompleteProperty,
  Opp,
} from "@/lib/db";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc/client";

const OppOverview = ({
  opp,
  company,
  property,
  contact,
}: {
  opp: Opp;
  company?: CompleteCompany;
  property?: CompleteProperty;
  contact?: CompleteContact;
}) => {
  let companyName = "";
  if (opp.companyId) {
    const { data: c } = trpc.companies.getCompanyById.useQuery(
      {
        id: opp.companyId,
      },
      {
        initialData: { company },
        refetchOnMount: false,
      }
    );
    companyName = c.company ? c.company.name : "";
  }

  let propertyName = "";
  if (opp.propertyId) {
    const { data: p } = trpc.properties.getPropertyById.useQuery(
      {
        id: opp.propertyId,
      },
      {
        initialData: { property },
        refetchOnMount: false,
      }
    );
    propertyName = p.property ? p.property.name : "";
  }

  let contactName = "";
  if (opp.contactId) {
    const { data: c } = trpc.contacts.getContactById.useQuery(
      {
        id: opp.contactId,
      },
      {
        initialData: { contact },
        refetchOnMount: false,
      }
    );
    contactName = c.contact ? c.contact.name : "";
  }

  return (
    <div className="grid grid-cols-4 gap-8">
      <div className="flex flex-col gap-2">
        <Label>Name</Label>
        <span className="text-sm">{opp.name}</span>
      </div>
      <div className="flex flex-col gap-2">
        <Label>Company</Label>
        <span className="text-sm">{companyName}</span>
      </div>
      <div className="flex flex-col gap-2">
        <Label>Property</Label>
        <span className="text-sm">{propertyName}</span>
      </div>
      <div className="flex flex-col gap-2">
        <Label>Contact</Label>
        <span className="text-sm">{contactName}</span>
      </div>
      <div className="flex flex-col gap-2">
        <Label>Description</Label>
        <span className="text-sm">{opp.description}</span>
      </div>
    </div>
  );
};

export default OppOverview;
