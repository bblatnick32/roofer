import LeadList from "@/components/leads/LeadList";
import NewLeadModal from "@/components/leads/LeadModal";
import { MainPageWrapper } from "@/components/main-page";
import { getLeads } from "@/lib/api/jobs/queries";
import { api } from "@/lib/trpc/api";

export default async function Leads() {
  const { leads } = await getLeads();
  const { companies } = await api.companies.getCompanies.query();
  const { properties } = await api.properties.getProperties.query();
  const { contacts } = await api.contacts.getContacts.query();

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
