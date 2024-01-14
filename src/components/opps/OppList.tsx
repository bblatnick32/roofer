"use client";
import { CompleteOpp } from "@/lib/db/schema/opps";
import OppModal from "./OppModal";
import { DataTable } from "../ui/data-table";
import { Company, Property, Contact } from "@/lib/db";
import useColumns from "./hooks/use-columns";
import { trpc } from "@/lib/trpc/client";

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
  const { data: o } = trpc.opps.getOpps.useQuery(undefined, {
    initialData: { opps },
    refetchOnMount: false,
  });

  const columns = useColumns({
    companies,
    properties,
    contacts,
  });

  if (o.opps.length === 0) {
    return <EmptyState />;
  }

  return <DataTable columns={columns} data={o.opps} />;
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
