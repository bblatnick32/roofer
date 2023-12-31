import { ColumnDef } from "@tanstack/react-table";
import LeadModal from "./LeadModal";

import { Company, Property, Lead, Contact } from "@/lib/db";
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
}): ColumnDef<Lead>[] {
  return [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        return (
          <Link href={`/leads/${row.original.id}`}>
            <Button variant="link">{row.getValue("name")}</Button>
          </Link>
        );
      },
    },
    {
      accessorKey: "companyId",
      header: "Company",
      cell: ({ row }) => {
        const lead = row.original;
        const company = companies?.find((c) => c.id === lead.companyId);
        return company?.name;
      },
    },
    {
      accessorKey: "propertyId",
      header: "Property",
      cell: ({ row }) => {
        const lead = row.original;
        const property = properties?.find((p) => p.id === lead.propertyId);
        return property?.name;
      },
    },
    {
      accessorKey: "contactId",
      header: "Contact",
      cell: ({ row }) => {
        const lead = row.original;
        const contact = contacts?.find((c) => c.id === lead.contactId);
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
        const lead = row.original;
        return <LeadModal lead={lead} />;
      },
    },
  ];
}
