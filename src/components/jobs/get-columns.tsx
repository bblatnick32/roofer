import { ColumnDef } from "@tanstack/react-table";
import JobModal from "./JobModal";

import { Company, Property, Job, Contact } from "@/lib/db";
import Link from "next/link";
import { Button } from "../ui/button";

export default function getColumns({
  companies,
  properties,
  contacts,
}: {
  companies?: Company[];
  properties?: Property[];
  contacts?: Contact[];
}): ColumnDef<Job>[] {
  return [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        return (
          <Link href={`/jobs/${row.original.id}/detail`}>
            <Button variant="link">{row.getValue("name")}</Button>
          </Link>
        );
      },
    },
    {
      accessorKey: "companyId",
      header: "Company",
      cell: ({ row }) => {
        const job = row.original;
        const company = companies?.find((c) => c.id === job.companyId);
        return company?.name;
      },
    },
    {
      accessorKey: "propertyId",
      header: "Property",
      cell: ({ row }) => {
        const job = row.original;
        const property = properties?.find((p) => p.id === job.propertyId);
        return property?.name;
      },
    },
    {
      accessorKey: "contactId",
      header: "Contact",
      cell: ({ row }) => {
        const job = row.original;
        const contact = contacts?.find((c) => c.id === job.contactId);
        return contact?.name;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const job = row.original;
        return <JobModal job={job} />;
      },
    },
  ];
}
