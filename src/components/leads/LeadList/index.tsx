// import { Lead } from "@/lib/db/schema/jobs";
// import LeadModal from "../LeadModal";
// import { DataTable } from "@/components/ui/data-table";
// import { columns } from "./columns";

// export default function LeadList({ leads }: { leads: Lead[] }) {
//   if (leads.length === 0) {
//     return <EmptyState />;
//   }

//   return <DataTable columns={columns} data={leads} />;
// }

// const EmptyState = () => {
//   return (
//     <div className="text-center">
//       <h3 className="mt-2 text-sm font-semibold text-gray-900">No leads</h3>
//       <p className="mt-1 text-sm text-gray-500">
//         Get started by creating a new lead.
//       </p>
//       <div className="mt-6">
//         <LeadModal emptyState={true} />
//       </div>
//     </div>
//   );
// };
