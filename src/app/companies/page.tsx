import CompanyList from "@/components/companies/CompanyList";
import NewCompanyModal from "@/components/companies/CompanyModal";
import { checkAuth } from "@/lib/auth/utils";
import { MainPageWrapper } from "@/components/main-page";
import { getCompanies } from "@/lib/api/companies/queries";

export default async function Companies() {
  await checkAuth();
  const { companies } = await getCompanies();

  return (
    <MainPageWrapper>
      <div className="flex justify-between">
        <h1 className="font-semibold text-2xl my-2">Companies</h1>
        <NewCompanyModal />
      </div>
      <CompanyList companies={companies} />
    </MainPageWrapper>
  );
}
