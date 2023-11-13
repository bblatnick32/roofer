"use client";
import { CompleteIssueTemplate } from "@/lib/db/schema/issueTemplates";
import { trpc } from "@/lib/trpc/client";
import IssueTemplateModal from "./IssueTemplateModal";


export default function IssueTemplateList({ issueTemplates }: { issueTemplates: CompleteIssueTemplate[] }) {
  const { data: i } = trpc.issueTemplates.getIssueTemplates.useQuery(undefined, {
    initialData: { issueTemplates },
    refetchOnMount: false,
  });

  if (i.issueTemplates.length === 0) {
    return <EmptyState />;
  }

  return (
    <ul>
      {i.issueTemplates.map((issueTemplate) => (
        <IssueTemplate issueTemplate={issueTemplate} key={issueTemplate.id} />
      ))}
    </ul>
  );
}

const IssueTemplate = ({ issueTemplate }: { issueTemplate: CompleteIssueTemplate }) => {
  return (
    <li className="flex justify-between my-2">
      <div className="w-full">
        <div>{issueTemplate.name}</div>
      </div>
      <IssueTemplateModal issueTemplate={issueTemplate} />
    </li>
  );
};

const EmptyState = () => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-gray-900">No issue templates</h3>
      <p className="mt-1 text-sm text-gray-500">
        Get started by creating a new issue template.
      </p>
      <div className="mt-6">
        <IssueTemplateModal emptyState={true} />
      </div>
    </div>
  );
};

