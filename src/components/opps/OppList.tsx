"use client";
import { CompleteOpp } from "@/lib/db/schema/opps";
import OppModal from "./OppModal";
import { DataTable } from "../ui/data-table";
import getColumns from "./get-columns";
import { Company, Property, Contact } from "@/lib/db";

export default function OppList({
  opps,
  companies,
  properties,
  contacts,
}: {
  opps: CompleteOpp[];
  companies: Company[];
  properties: Property[];
  contacts: Contact[];
}) {
  const columns = getColumns({
    companies,
    properties,
    contacts,
  });

  if (opps.length === 0) {
    return <EmptyState />;
  }

  return <DataTable columns={columns} data={opps} />;
}

const EmptyState = () => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No opportunities
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new opportunity.
      </p>
      <div className="mt-6">
        <OppModal emptyState={true} />
      </div>
    </div>
  );
};
