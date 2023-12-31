import JobList from "@/components/jobs/JobList";
import NewJobModal from "@/components/jobs/JobModal";
import { MainPageWrapper } from "@/components/main-page";
import { getCompanies } from "@/lib/api/companies/queries";
import { getContacts } from "@/lib/api/contacts/queries";
import { getJobs } from "@/lib/api/jobs/queries";
import { getProperties } from "@/lib/api/properties/queries";

export default async function Jobs() {
  const { jobs } = await getJobs();
  const { companies } = await getCompanies();
  const { properties } = await getProperties();
  const { contacts } = await getContacts();

  return (
    <MainPageWrapper>
      <div className="flex justify-between">
        <h1 className="font-semibold text-2xl my-2">Jobs</h1>
        <NewJobModal />
      </div>
      <JobList
        jobs={jobs}
        companies={companies}
        properties={properties}
        contacts={contacts}
      />
    </MainPageWrapper>
  );
}
