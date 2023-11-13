"use client";
import { CompleteRepairTemplate } from "@/lib/db/schema/repairTemplates";
import { trpc } from "@/lib/trpc/client";
import RepairTemplateModal from "./RepairTemplateModal";


export default function RepairTemplateList({ repairTemplates }: { repairTemplates: CompleteRepairTemplate[] }) {
  const { data: r } = trpc.repairTemplates.getRepairTemplates.useQuery(undefined, {
    initialData: { repairTemplates },
    refetchOnMount: false,
  });

  if (r.repairTemplates.length === 0) {
    return <EmptyState />;
  }

  return (
    <ul>
      {r.repairTemplates.map((repairTemplate) => (
        <RepairTemplate repairTemplate={repairTemplate} key={repairTemplate.id} />
      ))}
    </ul>
  );
}

const RepairTemplate = ({ repairTemplate }: { repairTemplate: CompleteRepairTemplate }) => {
  return (
    <li className="flex justify-between my-2">
      <div className="w-full">
        <div>{repairTemplate.name}</div>
      </div>
      <RepairTemplateModal repairTemplate={repairTemplate} />
    </li>
  );
};

const EmptyState = () => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-gray-900">No repair templates</h3>
      <p className="mt-1 text-sm text-gray-500">
        Get started by creating a new repair template.
      </p>
      <div className="mt-6">
        <RepairTemplateModal emptyState={true} />
      </div>
    </div>
  );
};

