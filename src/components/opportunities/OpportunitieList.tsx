"use client";
import { CompleteOpportunitie } from "@/lib/db/schema/opportunities";
import { trpc } from "@/lib/trpc/client";
import OpportunitieModal from "./OpportunitieModal";


export default function OpportunitieList({ opportunities }: { opportunities: CompleteOpportunitie[] }) {
  const { data: o } = trpc.opportunities.getOpportunities.useQuery(undefined, {
    initialData: { opportunities },
    refetchOnMount: false,
  });

  if (o.opportunities.length === 0) {
    return <EmptyState />;
  }

  return (
    <ul>
      {o.opportunities.map((opportunitie) => (
        <Opportunitie opportunitie={opportunitie} key={opportunitie.id} />
      ))}
    </ul>
  );
}

const Opportunitie = ({ opportunitie }: { opportunitie: CompleteOpportunitie }) => {
  return (
    <li className="flex justify-between my-2">
      <div className="w-full">
        <div>{opportunitie.value}</div>
      </div>
      <OpportunitieModal opportunitie={opportunitie} />
    </li>
  );
};

const EmptyState = () => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-gray-900">No opportunities</h3>
      <p className="mt-1 text-sm text-gray-500">
        Get started by creating a new opportunitie.
      </p>
      <div className="mt-6">
        <OpportunitieModal emptyState={true} />
      </div>
    </div>
  );
};

