"use client";
import { Lead } from "@/lib/db";
import { ColumnDef } from "@tanstack/react-table";
import LeadModal from "../LeadModal";

export const columns: ColumnDef<Lead>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "company",
    header: "Company",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "address",
    header: "Address",
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
