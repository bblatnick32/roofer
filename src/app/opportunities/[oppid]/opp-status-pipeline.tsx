"use client";
import { OppStatuses, Opportunity } from "@/lib/db";
import { useState } from "react";
import StatusPipeline from "@/components/ui/status-pipeline";

const statuses = Array.from(OppStatuses);
type Status = (typeof statuses)[number];

const OppStatusPipeline = ({ opportunity }: { opportunity: Opportunity }) => {
  const [currentStatus, setCurrentStatus] = useState(opportunity.status);

  const handleOnClick = (status: Status) => {
    setCurrentStatus(status);
  };

  return (
    <>
      <StatusPipeline<Status>
        statuses={statuses}
        currentStatus={currentStatus}
        onClick={handleOnClick}
      />
    </>
  );
};

export default OppStatusPipeline;
