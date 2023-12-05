import CompanyList from "@/components/companies/CompanyList";
import NewCompanyModal from "@/components/companies/CompanyModal";
import { api } from "@/lib/trpc/api";
import { checkAuth } from "@/lib/auth/utils";

export default async function Companies() {
  await checkAuth();
  const { companies } = await api.companies.getCompanies.query();

  return (
    <main className="max-w-3xl mx-auto p-4 rounded-lg bg-card">
      <div className="flex justify-between">
        <h1 className="font-semibold text-2xl my-2">Companies</h1>
        <NewCompanyModal />
      </div>
      <CompanyList companies={companies} />
    </main>
  );
}
