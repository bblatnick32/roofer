"use client";
import { CompleteOpportunity } from "@/lib/db/schema/opportunities";
import OpportunityModal from "./OpportunityModal";
import { Button } from "../ui/button";
import Link from "next/link";
import { trpc } from "@/lib/trpc/client";

export default function OpportunityList({
  opportunities,
}: {
  opportunities: CompleteOpportunity[];
}) {
  const { data: o } = trpc.opportunities.getOpportunities.useQuery(undefined, {
    initialData: { opportunities },
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
    <li className="flex justify-between my-2 w-full">
      <Link href={`/opportunities/${opportunity.id}`} className="w-full">
        <Button variant="ghost" size="sm" className="w-full justify-start">
          {opportunity.name}
        </Button>
      </Link>
      {/* <OpportunityModal opportunity={opportunity} /> */}
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
