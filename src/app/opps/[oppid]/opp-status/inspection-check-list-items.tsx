"use client";

import { CheckListItem, CheckListItems } from "@/components/check-list-items";
import { Opp } from "@/lib/db";

type OpenType =
  | "schedule-inspection"
  | "overview-photos"
  | "observation-photos"
  | "composition-photos"
  | "document-issues";

const InspectionCheckListItems = ({ opp }: { opp: Opp }) => {
  const items: CheckListItem<OpenType>[] = [
    {
      label: "Schedule inspection.",
      value: "schedule-inspection",
      completed: false,
      disabled: false,
    },
    {
      label: "Upload overview photos.",
      value: "overview-photos",
      completed: false,
      disabled: false,
    },
    {
      label: "Upload observation photos.",
      value: "observation-photos",
      completed: false,
      disabled: false,
    },
    {
      label: "Upload composition photos.",
      value: "composition-photos",
      completed: false,
      disabled: false,
    },
    {
      label: "Document issues.",
      value: "document-issues",
      completed: false,
      disabled: false,
    },
  ];

  return (
    <>
      <CheckListItems<OpenType> items={items} />
    </>
  );
};

export default InspectionCheckListItems;
