"use client";
import { CompleteProperty } from "@/lib/db/schema/properties";
import PropertyModal from "./PropertyModal";
import { trpc } from "@/lib/trpc/client";

export default function PropertyList({
  properties,
}: {
  properties: CompleteProperty[];
}) {
  const { data: p } = trpc.properties.getProperties.useQuery(undefined, {
    initialData: { properties },
    refetchOnMount: false,
  });

  if (p.properties.length === 0) {
    return <EmptyState />;
  }

  return (
    <ul>
      {p.properties.map((property) => (
        <Property property={property} key={property.id} />
      ))}
    </ul>
  );
}

const Property = ({ property }: { property: CompleteProperty }) => {
  return (
    <li className="flex justify-between my-2">
      <div className="w-full">
        <div>{property.name}</div>
      </div>
      <PropertyModal property={property} />
    </li>
  );
};

const EmptyState = () => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No properties
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new property.
      </p>
      <div className="mt-6">
        <PropertyModal emptyState={true} />
      </div>
    </div>
  );
};
