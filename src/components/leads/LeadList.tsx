"use client";
import { CompleteLead } from "@/lib/db/schema/leads";
import { trpc } from "@/lib/trpc/client";
import LeadModal from "./LeadModal";


export default function LeadList({ leads }: { leads: CompleteLead[] }) {
  const { data: l } = trpc.leads.getLeads.useQuery(undefined, {
    initialData: { leads },
    refetchOnMount: false,
  });

  if (l.leads.length === 0) {
    return <EmptyState />;
  }

  return (
    <ul>
      {l.leads.map((lead) => (
        <Lead lead={lead} key={lead.id} />
      ))}
    </ul>
  );
}

const Lead = ({ lead }: { lead: CompleteLead }) => {
  return (
    <li className="flex justify-between my-2">
      <div className="w-full">
        <div>{lead.name}</div>
      </div>
      <LeadModal lead={lead} />
    </li>
  );
};

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

