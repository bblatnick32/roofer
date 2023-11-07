"use client";
import { CompleteOpportunity } from "@/lib/db/schema/opportunities";
import { trpc } from "@/lib/trpc/client";
import OpportunityModal from "./OpportunityModal";

export default function OpportunityList({
  opportunities,
}: {
  opportunities: CompleteOpportunity[];
}) {
  const { data: o } = trpc.opportunities.getOpportunities.useQuery(undefined, {
    initialData: { opportunities },
    refetchOnMount: false,
  });

  if (o.opportunities.length === 0) {
    return <EmptyState />;
  }

  return (
    <ul>
      {o.opportunities.map((opportunity) => (
        <Opportunity opportunity={opportunity} key={opportunity.id} />
      ))}
    </ul>
  );
}

const Opportunity = ({ opportunity }: { opportunity: CompleteOpportunity }) => {
  return (
    <li className="flex justify-between my-2">
      <div className="w-full">
        <div>{opportunity.value}</div>
      </div>
      <OpportunityModal opportunity={opportunity} />
    </li>
  );
};

const EmptyState = () => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-gray-900">
        No opportunities
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        Get started by creating a new opportunity.
      </p>
      <div className="mt-6">
        <OpportunityModal emptyState={true} />
      </div>
    </div>
  );
};
