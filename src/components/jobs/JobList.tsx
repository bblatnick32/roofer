"use client";
import { CompleteJob } from "@/lib/db/schema/jobs";
import JobModal from "./JobModal";
import { DataTable } from "../ui/data-table";
import getColumns from "./get-columns";
import { Company, Property, Contact } from "@/lib/db";

export default function JobList({
  jobs,
  companies,
  properties,
  contacts,
}: {
  jobs: CompleteJob[];
  companies: Company[];
  properties: Property[];
  contacts: Contact[];
}) {
  const columns = getColumns({
    companies,
    properties,
    contacts,
  });

  if (jobs.length === 0) {
    return <EmptyState />;
  }

  return <DataTable columns={columns} data={jobs} />;
}

const EmptyState = () => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No jobs
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new job.
      </p>
      <div className="mt-6">
        <JobModal emptyState={true} />
      </div>
    </div>
  );
};
