// "use client";
// import { Lead } from "@/lib/db";
// import { ColumnDef } from "@tanstack/react-table";
// import LeadModal from "../LeadModal";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";

// export const columns: ColumnDef<Lead>[] = [
//   {
//     accessorKey: "name",
//     header: "Name",
//     cell: ({ row }) => {
//       return (
//         <Link href={`/leads/${row.original.id}`}>
//           <Button variant="link">{row.getValue("name")}</Button>
//         </Link>
//       );
//     },
//   },
//   {
//     accessorKey: "company",
//     header: "Company",
//   },
//   {
//     accessorKey: "email",
//     header: "Email",
//   },
//   {
//     accessorKey: "phone",
//     header: "Phone",
//   },
//   {
//     accessorKey: "address",
//     header: "Address",
//   },
//   {
//     accessorKey: "status",
//     header: "Status",
//   },
//   {
//     id: "actions",
//     cell: ({ row }) => {
//       const lead = row.original;
//       return <LeadModal lead={lead} />;
//     },
//   },
// ];
