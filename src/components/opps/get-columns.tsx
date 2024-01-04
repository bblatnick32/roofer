import { ColumnDef } from "@tanstack/react-table";
import OppModal from "./OppModal";

import { Company, Property, Opp, Contact } from "@/lib/db";
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
}): ColumnDef<Opp>[] {
  return [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        return (
          <Link href={`/opps/${row.original.id}/detail`}>
            <Button variant="link">{row.getValue("name")}</Button>
          </Link>
        );
      },
    },
    {
      accessorKey: "companyId",
      header: "Company",
      cell: ({ row }) => {
        const opp = row.original;
        const company = companies?.find((c) => c.id === opp.companyId);
        return company?.name;
      },
    },
    {
      accessorKey: "propertyId",
      header: "Property",
      cell: ({ row }) => {
        const opp = row.original;
        const property = properties?.find((p) => p.id === opp.propertyId);
        return property?.name;
      },
    },
    {
      accessorKey: "contactId",
      header: "Contact",
      cell: ({ row }) => {
        const opp = row.original;
        const contact = contacts?.find((c) => c.id === opp.contactId);
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
        const opp = row.original;
        return <OppModal opp={opp} />;
      },
    },
  ];
}
