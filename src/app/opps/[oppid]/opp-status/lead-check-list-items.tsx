"use client";
import { Opp } from "@/lib/db";
import { CheckListItems } from "@/components/check-list-items";

const LeadCheckListItems = ({ opp }: { opp: Opp }) => {
  const isDocumented = !!(
    opp.companyId &&
    opp.propertyId &&
    opp.contactId &&
    opp.description
  );

  const items = [
    {
      label: "Document company, property, contact, and description.",
      value: "document",
      completed: isDocumented,
    },
  ];

  const handleClick = (e: React.MouseEvent, value: string) => {
    e.stopPropagation();
    e.preventDefault();
    console.log("clicked", value);
  };

  return <CheckListItems items={items} onClick={handleClick} />;
};

export default LeadCheckListItems;
