"use client";
import { CompleteOpportunity } from "@/lib/db/schema/opportunities";
import { trpc } from "@/lib/trpc/client";
import OpportunityModal from "./OpportunityModal";
import { CompleteContact } from "@/lib/db/schema/contacts";
import { Button } from "../ui/button";
import Link from "next/link";

export default function OpportunityList({
  opportunities,
  contacts,
}: {
  opportunities: CompleteOpportunity[];
  contacts: CompleteContact[];
}) {
  const { data: o } = trpc.opportunities.getOpportunities.useQuery(undefined, {
    initialData: { opportunities },
  });

  if (o.opportunities.length === 0) {
    return <EmptyState contacts={contacts} />;
  }

  return (
    <ul>
      {o.opportunities.map((opportunity) => (
        <Opportunity
          opportunity={opportunity}
          key={opportunity.id}
          contacts={contacts}
        />
      ))}
    </ul>
  );
}

const Opportunity = ({
  opportunity,
  contacts,
}: {
  opportunity: CompleteOpportunity;
  contacts: CompleteContact[];
}) => {
  return (
    <li className="flex justify-between my-2 w-full">
      <Link href={`/opportunities/${opportunity.id}`} className="w-full">
        <Button variant="ghost" size="sm" className="w-full justify-start">
          {opportunity.name}
        </Button>
      </Link>
      {/* <OpportunityModal opportunity={opportunity} contacts={contacts} /> */}
    </li>
  );
};

const EmptyState = ({ contacts }: { contacts: CompleteContact[] }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-gray-900">
        No opportunities
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        Get started by creating a new opportunity.
      </p>
      <div className="mt-6">
        <OpportunityModal emptyState={true} contacts={contacts} />
      </div>
    </div>
  );
};
