"use client";
import { CompleteOpportunity } from "@/lib/db/schema/opportunities";
import { trpc } from "@/lib/trpc/client";
import OpportunityModal from "./OpportunityModal";
import { CompleteLead } from "@/lib/db/schema/leads";
import { Button } from "../ui/button";
import Link from "next/link";

export default function OpportunityList({
  opportunities,
  leads,
}: {
  opportunities: CompleteOpportunity[];
  leads: CompleteLead[];
}) {
  const { data: o } = trpc.opportunities.getOpportunities.useQuery(undefined, {
    initialData: { opportunities },
    refetchOnMount: false,
  });

  if (o.opportunities.length === 0) {
    return <EmptyState leads={leads} />;
  }

  return (
    <ul>
      {o.opportunities.map((opportunity) => (
        <Opportunity
          opportunity={opportunity}
          key={opportunity.id}
          leads={leads}
        />
      ))}
    </ul>
  );
}

const Opportunity = ({
  opportunity,
  leads,
}: {
  opportunity: CompleteOpportunity;
  leads: CompleteLead[];
}) => {
  return (
    <li className="flex justify-between my-2">
      <div className="w-full">
        <div>{opportunity.name}</div>
      </div>
      {/* <OpportunityModal opportunity={opportunity} leads={leads} /> */}
      <Link href={`/opportunities/${opportunity.id}`}>
        <Button variant="ghost" size="sm">
          Edit
        </Button>
      </Link>
    </li>
  );
};

const EmptyState = ({ leads }: { leads: CompleteLead[] }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-gray-900">
        No opportunities
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        Get started by creating a new opportunity.
      </p>
      <div className="mt-6">
        <OpportunityModal emptyState={true} leads={leads} />
      </div>
    </div>
  );
};
