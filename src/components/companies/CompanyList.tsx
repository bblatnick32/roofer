"use client";
import { CompleteCompany } from "@/lib/db/schema/companies";
import CompanyModal from "./CompanyModal";
import { trpc } from "@/lib/trpc/client";

export default function CompanyList({
  companies,
}: {
  companies: CompleteCompany[];
}) {
  const { data: c } = trpc.companies.getCompanies.useQuery(undefined, {
    initialData: { companies },
    refetchOnMount: false,
  });

  if (c.companies.length === 0) {
    return <EmptyState />;
  }

  return (
    <ul>
      {c.companies.map((company) => (
        <Company company={company} key={company.id} />
      ))}
    </ul>
  );
}

const Company = ({ company }: { company: CompleteCompany }) => {
  return (
    <li className="flex justify-between my-2">
      <div className="w-full">
        <div>{company.name}</div>
      </div>
      <CompanyModal company={company} />
    </li>
  );
};

const EmptyState = () => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No companies
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new company.
      </p>
      <div className="mt-6">
        <CompanyModal emptyState={true} />
      </div>
    </div>
  );
};
