import OppList from "@/components/opps/OppList";
import NewOppModal from "@/components/opps/OppModal";
import { MainPageWrapper } from "@/components/main-page";
import { getCompanies } from "@/lib/api/companies/queries";
import { getContacts } from "@/lib/api/contacts/queries";
import { getOpps } from "@/lib/api/opps/queries";
import { getProperties } from "@/lib/api/properties/queries";

export default async function Opps() {
  const { opps } = await getOpps();
  const { companies } = await getCompanies();
  const { properties } = await getProperties();
  const { contacts } = await getContacts();

  return (
    <MainPageWrapper>
      <div className="flex justify-between">
        <h1 className="font-semibold text-2xl my-2">Opportunities</h1>
        <NewOppModal />
      </div>
      <OppList
        opps={opps}
        companies={companies}
        properties={properties}
        contacts={contacts}
      />
    </MainPageWrapper>
  );
}
