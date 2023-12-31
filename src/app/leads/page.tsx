import LeadList from "@/components/leads/LeadList";
import NewLeadModal from "@/components/leads/LeadModal";
import { MainPageWrapper } from "@/components/main-page";
import { getCompanies } from "@/lib/api/companies/queries";
import { getContacts } from "@/lib/api/contacts/queries";
import { getLeads } from "@/lib/api/jobs/queries";
import { getProperties } from "@/lib/api/properties/queries";

export default async function Leads() {
  const { leads } = await getLeads();
  const { companies } = await getCompanies();
  const { properties } = await getProperties();
  const { contacts } = await getContacts();

  return (
    <MainPageWrapper>
      <div className="flex justify-between">
        <h1 className="font-semibold text-2xl my-2">Leads</h1>
        <NewLeadModal />
      </div>
      <LeadList
        leads={leads}
        companies={companies}
        properties={properties}
        contacts={contacts}
      />
    </MainPageWrapper>
  );
}
