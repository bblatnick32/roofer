"use client";
import { CompleteLead } from "@/lib/db/schema/leads";
import { trpc } from "@/lib/trpc/client";
import LeadModal from "../LeadModal";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { useRouter } from "next/navigation";

export default function LeadList({ leads }: { leads: CompleteLead[] }) {
  const router = useRouter();

  const { data: l } = trpc.leads.getLeads.useQuery(undefined, {
    initialData: { leads },
  });

  if (l.leads.length === 0) {
    return <EmptyState />;
  }

  return <DataTable columns={columns} data={l.leads} />;
}

const EmptyState = () => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-gray-900">No leads</h3>
      <p className="mt-1 text-sm text-gray-500">
        Get started by creating a new lead.
      </p>
      <div className="mt-6">
        <LeadModal emptyState={true} />
      </div>
    </div>
  );
};
