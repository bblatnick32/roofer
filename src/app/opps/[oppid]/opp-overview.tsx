import { Opp } from "@/lib/db";
import { Label } from "@/components/ui/label";
import { getCompanyById } from "@/lib/api/companies/queries";
import { getPropertyById } from "@/lib/api/properties/queries";
import { getContactById } from "@/lib/api/contacts/queries";

const OppOverview = async ({ opp }: { opp: Opp }) => {
  let companyName = "";
  if (opp.companyId) {
    const { company } = await getCompanyById(opp.companyId);
    companyName = company ? company.name : "";
  }

  let propertyName = "";
  if (opp.propertyId) {
    const { property } = await getPropertyById(opp.propertyId);
    propertyName = property ? property.name : "";
  }

  let contactName = "";
  if (opp.contactId) {
    const { contact } = await getContactById(opp.contactId);
    contactName = contact ? contact.name : "";
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
