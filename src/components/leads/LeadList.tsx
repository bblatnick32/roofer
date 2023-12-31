"use client";
import { CompleteLead } from "@/lib/db/schema/jobs";
import LeadModal from "./LeadModal";
import { DataTable } from "../ui/data-table";
import getColumns from "./get-columns";
import { Company, Property, Contact } from "@/lib/db";

export default function LeadList({
  leads,
  companies,
  properties,
  contacts,
}: {
  leads: CompleteLead[];
  companies: Company[];
  properties: Property[];
  contacts: Contact[];
}) {
  const columns = getColumns({
    companies,
    properties,
    contacts,
  });

  if (leads.length === 0) {
    return <EmptyState />;
  }

  return <DataTable columns={columns} data={leads} />;
}

const EmptyState = () => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No leads
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new lead.
      </p>
      <div className="mt-6">
        <LeadModal emptyState={true} />
      </div>
    </div>
  );
};
