import LeadList from "@/components/leads/LeadList";
import { getLeads } from "@/lib/api/jobs/queries";
import { getCompanies } from "@/lib/api/companies/queries";
import { getProperties } from "@/lib/api/properties/queries";
import { getContacts } from "@/lib/api/contacts/queries";
import { MainPageWrapper } from "@/components/main-page";

export const revalidate = 0;

export default async function Leads() {
  const { leads } = await getLeads();
  const { companies } = await getCompanies();
  const { properties } = await getProperties();
  const { contacts } = await getContacts();

  return (
    <MainPageWrapper>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Leads</h1>
        </div>
        <LeadList
          leads={leads}
          companies={companies}
          properties={properties}
          contacts={contacts}
        />
      </div>
    </MainPageWrapper>
  );
}
